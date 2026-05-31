import axios, { type InternalAxiosRequestConfig } from "axios";
import { getCookieValue } from "@/lib/utils/cookies";
import {
  buildRequestUrl,
  createApiClientError,
  getResponseHeader,
  isApiClientError,
  isUnexpectedJsonResponseContent,
  toApiClientError,
} from "@/lib/api/apiErrors";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl =
  configuredApiBaseUrl && configuredApiBaseUrl.length > 0
    ? configuredApiBaseUrl.replace(/\/+$/, "")
    : "/";

declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-CSRF-TOKEN",
});

let refreshRequest: Promise<void> | null = null;

function shouldSkipRefresh(url?: string) {
  return url === "/api/auth/login" || url === "/api/auth/logout" || url === "/api/auth/refresh";
}

function requiresCsrfHeader(method?: string) {
  if (!method) {
    return false;
  }

  return ["post", "put", "patch", "delete"].includes(method.toLowerCase());
}

function notifySessionExpired() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("auth:session-expired"));
}

async function refreshSession() {
  if (!refreshRequest) {
    refreshRequest = apiClient
      .post("/api/auth/refresh", undefined, { skipAuthRefresh: true })
      .then(() => undefined)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!requiresCsrfHeader(config.method)) {
    return config;
  }

  const csrfToken = getCookieValue("XSRF-TOKEN");

  if (csrfToken && !config.headers.has("X-CSRF-TOKEN")) {
    config.headers.set("X-CSRF-TOKEN", csrfToken);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const responseType = response.config.responseType;
    const shouldValidateJson =
      !responseType || responseType === "json" || responseType === "text";

    if (!shouldValidateJson) {
      return response;
    }

    const contentType = getResponseHeader(response.headers, "content-type");

    if (isUnexpectedJsonResponseContent(contentType, response.data)) {
      throw createApiClientError({
        kind: "invalid-content-type",
        endpoint: buildRequestUrl(response.config.baseURL, response.config.url),
        method: response.config.method?.toUpperCase() ?? null,
        statusCode: response.status,
        code: null,
        contentType,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator === "undefined" ? "Unknown" : navigator.userAgent,
        message: "The API returned HTML or another unexpected response instead of JSON.",
      });
    }

    return response;
  },
  async (error: unknown) => {
    if (isApiClientError(error)) {
      return Promise.reject(error);
    }

    if (!axios.isAxiosError(error)) {
      return Promise.reject(toApiClientError(error));
    }

    const config = error.config;

    if (
      !config ||
      config._retry ||
      config.skipAuthRefresh ||
      shouldSkipRefresh(config.url) ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      await refreshSession();
      return apiClient(config);
    } catch {
      notifySessionExpired();
      return Promise.reject(toApiClientError(error));
    }
  },
);
