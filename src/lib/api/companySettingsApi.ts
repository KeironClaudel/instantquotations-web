import { apiClient } from "@/lib/api/apiClient";
import { createApiClientError, getResponseHeader, isApiClientError, toApiClientError } from "@/lib/api/apiErrors";
import { cloneDefaultCompanySettings } from "@/lib/defaults/companySettings";
import { normalizeCompanySettings } from "@/lib/utils/companySettings";
import type { CompanySettings } from "@/types/company";

export type UpdateCompanySettingsRequest = {
  displayName: string;
  legalName: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  termsAndConditions: string | null;
  logoFileName: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  proformPrefix: string;
  taxPercentage: number;
  currencySymbol: string;
  taxLabel: string;
  resendApiKey: string | null;
  clearResendApiKey: boolean;
  resendSenderEmail: string | null;
  resendSenderName: string | null;
  resendReplyToEmail: string | null;
};

export type LoadCompanySettingsSuccessResult = {
  success: true;
  data: CompanySettings;
};

export type LoadCompanySettingsFailureResult = {
  success: false;
  error: ReturnType<typeof toApiClientError>;
  fallbackData: CompanySettings;
};

export type LoadCompanySettingsResult =
  | LoadCompanySettingsSuccessResult
  | LoadCompanySettingsFailureResult;

type CompanySettingsPayload = Record<string, unknown>;

function buildCompanySettingsUrl(forceFresh?: boolean): string {
  if (!forceFresh) {
    return "/api/company-settings";
  }

  return `/api/company-settings?refresh=${Date.now()}`;
}

function isCompanySettingsPayload(value: unknown): value is CompanySettingsPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const payload = value as CompanySettingsPayload;

  return (
    typeof payload.displayName === "string" &&
    typeof payload.proformPrefix === "string" &&
    typeof payload.taxPercentage === "number" &&
    typeof payload.currencySymbol === "string" &&
    typeof payload.taxLabel === "string"
  );
}

function parseCompanySettingsResponse(
  data: unknown,
  endpoint: string,
  statusCode: number,
  contentType: string | null,
): CompanySettings {
  if (!isCompanySettingsPayload(data)) {
    throw createApiClientError({
      kind: "invalid-payload",
      endpoint,
      method: "GET",
      statusCode,
      code: null,
      contentType,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator === "undefined" ? "Unknown" : navigator.userAgent,
      message: "The API response did not match the expected company settings shape.",
    });
  }

  return normalizeCompanySettings(data as CompanySettings);
}

export async function getCurrentCompanySettings(forceFresh?: boolean): Promise<CompanySettings> {
  const endpoint = buildCompanySettingsUrl(forceFresh);
  const response = await apiClient.get<unknown>(endpoint);
  return parseCompanySettingsResponse(
    response.data,
    endpoint,
    response.status,
    getResponseHeader(response.headers, "content-type"),
  );
}

export async function loadCompanySettingsSafely(
  forceFresh?: boolean,
): Promise<LoadCompanySettingsResult> {
  try {
    const data = await getCurrentCompanySettings(forceFresh);

    return {
      success: true,
      data,
    };
  } catch (error) {
    const normalizedError = isApiClientError(error) ? error : toApiClientError(error);

    return {
      success: false,
      error: normalizedError,
      fallbackData: cloneDefaultCompanySettings(),
    };
  }
}

export async function updateCompanySettings(
  request: UpdateCompanySettingsRequest,
): Promise<void> {
  await apiClient.put("/api/company-settings", request);
}

export async function replaceCompanyLogo(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("logoFile", file);

  await apiClient.put("/api/company-settings/logo", formData);
}
