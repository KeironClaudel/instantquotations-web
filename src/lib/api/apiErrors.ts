import axios, { type AxiosError, type AxiosResponseHeaders, type RawAxiosResponseHeaders } from "axios";

export type ApiErrorKind =
  | "network"
  | "canceled"
  | "timeout"
  | "http"
  | "invalid-content-type"
  | "invalid-payload"
  | "unknown";

export type ApiErrorDetails = {
  kind: ApiErrorKind;
  endpoint: string;
  method: string | null;
  statusCode: number | null;
  code: string | null;
  contentType: string | null;
  timestamp: string;
  userAgent: string;
};

type ApiClientErrorInput = ApiErrorDetails & {
  cause?: unknown;
  message: string;
};

export class ApiClientError extends Error {
  readonly kind: ApiErrorKind;
  readonly endpoint: string;
  readonly method: string | null;
  readonly statusCode: number | null;
  readonly code: string | null;
  readonly contentType: string | null;
  readonly timestamp: string;
  readonly userAgent: string;
  override readonly cause?: unknown;

  constructor(input: ApiClientErrorInput) {
    super(input.message);
    this.name = "ApiClientError";
    this.kind = input.kind;
    this.endpoint = input.endpoint;
    this.method = input.method;
    this.statusCode = input.statusCode;
    this.code = input.code;
    this.contentType = input.contentType;
    this.timestamp = input.timestamp;
    this.userAgent = input.userAgent;
    this.cause = input.cause;
  }
}

type HeaderCollection = AxiosResponseHeaders | Partial<RawAxiosResponseHeaders> | undefined;

function getUserAgent(): string {
  if (typeof navigator === "undefined") {
    return "Unknown";
  }

  return navigator.userAgent;
}

function getTimestamp(): string {
  return new Date().toISOString();
}

function getWindowOrigin(): string {
  if (typeof window === "undefined") {
    return "http://localhost";
  }

  return window.location.origin;
}

export function getResponseHeader(
  headers: HeaderCollection,
  name: string,
): string | null {
  if (!headers) {
    return null;
  }

  const normalizedName = name.toLowerCase();
  const entries = Object.entries(headers as Record<string, unknown>);

  for (const [headerName, headerValue] of entries) {
    if (headerName.toLowerCase() !== normalizedName) {
      continue;
    }

    if (typeof headerValue === "string") {
      return headerValue;
    }

    if (Array.isArray(headerValue)) {
      return headerValue.join(", ");
    }
  }

  return null;
}

export function buildRequestUrl(baseURL?: string, url?: string): string {
  if (!url) {
    return "Unknown";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (baseURL) {
    try {
      return new URL(url, baseURL).toString();
    } catch {
      return `${baseURL.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
    }
  }

  try {
    return new URL(url, getWindowOrigin()).toString();
  } catch {
    return url;
  }
}

function isTimeoutError(error: AxiosError): boolean {
  return (
    error.code === "ECONNABORTED" ||
    error.message.toLowerCase().includes("timeout")
  );
}

function isCanceledError(error: AxiosError): boolean {
  return error.code === "ERR_CANCELED" || error.response?.status === 499;
}

function isNetworkError(error: AxiosError): boolean {
  return error.code === "ERR_NETWORK";
}

function isHtmlLikeResponse(contentType: string | null, data: unknown): boolean {
  if (contentType?.toLowerCase().includes("text/html")) {
    return true;
  }

  if (typeof data !== "string") {
    return false;
  }

  return /^\s*<(?:!doctype html|html|body|head|script)/i.test(data);
}

function buildApiErrorKind(error: AxiosError): ApiErrorKind {
  if (isCanceledError(error)) {
    return "canceled";
  }

  if (isTimeoutError(error)) {
    return "timeout";
  }

  if (isNetworkError(error)) {
    return "network";
  }

  const contentType = getResponseHeader(error.response?.headers, "content-type");

  if (isHtmlLikeResponse(contentType, error.response?.data)) {
    return "invalid-content-type";
  }

  if (error.response) {
    return "http";
  }

  return "unknown";
}

function buildApiErrorMessage(error: AxiosError, kind: ApiErrorKind): string {
  switch (kind) {
    case "network":
      return "The network request could not reach the API.";
    case "canceled":
      return "The request was canceled or interrupted before it completed.";
    case "timeout":
      return "The API request timed out before the server responded.";
    case "invalid-content-type":
      return "The API returned HTML or another unexpected response instead of JSON.";
    case "http":
      return `The API returned an HTTP ${error.response?.status ?? "error"} response.`;
    default:
      return error.message || "An unexpected API error occurred.";
  }
}

export function createApiClientError(input: ApiClientErrorInput): ApiClientError {
  return new ApiClientError(input);
}

export function createApiClientErrorFromAxios(error: AxiosError): ApiClientError {
  const kind = buildApiErrorKind(error);
  const endpoint = buildRequestUrl(error.config?.baseURL, error.config?.url);

  return createApiClientError({
    kind,
    endpoint,
    method: error.config?.method?.toUpperCase() ?? null,
    statusCode: error.response?.status ?? null,
    code: error.code ?? null,
    contentType: getResponseHeader(error.response?.headers, "content-type"),
    timestamp: getTimestamp(),
    userAgent: getUserAgent(),
    message: buildApiErrorMessage(error, kind),
    cause: error,
  });
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function toApiClientError(error: unknown): ApiClientError {
  if (isApiClientError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return createApiClientErrorFromAxios(error);
  }

  const message =
    error instanceof Error
      ? error.message
      : "An unexpected client-side error occurred.";

  return createApiClientError({
    kind: "unknown",
    endpoint: "Unknown",
    method: null,
    statusCode: null,
    code: null,
    contentType: null,
    timestamp: getTimestamp(),
    userAgent: getUserAgent(),
    message,
    cause: error,
  });
}

export function formatApiDiagnostics(error: ApiClientError): string {
  return [
    `endpoint: ${error.endpoint}`,
    `statusCode: ${error.statusCode ?? "n/a"}`,
    `errorCode: ${error.code ?? "n/a"}`,
    `contentType: ${error.contentType ?? "n/a"}`,
    `timestamp: ${error.timestamp}`,
    `userAgent: ${error.userAgent}`,
  ].join("\n");
}

export function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) {
    return true;
  }

  return /(?:application|text)\/(?:[\w.+-]*\+)?json/i.test(contentType);
}

export function isUnexpectedJsonResponseContent(
  contentType: string | null,
  data: unknown,
): boolean {
  if (isHtmlLikeResponse(contentType, data)) {
    return true;
  }

  return !isJsonContentType(contentType);
}
