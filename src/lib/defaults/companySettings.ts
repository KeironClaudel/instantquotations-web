import type { CompanySettings } from "@/types/company";

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  displayName: "InstantProforms",
  legalName: null,
  website: null,
  phone: null,
  email: null,
  address: null,
  termsAndConditions: null,
  logoFileName: null,
  logoUrl: null,
  primaryColor: "#173b7a",
  secondaryColor: "#dbe2ff",
  accentColor: "#0f9f94",
  proformPrefix: "PRO",
  taxPercentage: 13,
  currencySymbol: "₡",
  taxLabel: "Tax",
  hasResendApiKeyConfigured: false,
  isResendEmailDeliveryConfigured: false,
  resendSenderEmail: null,
  resendSenderName: null,
  resendReplyToEmail: null,
};

export function cloneDefaultCompanySettings(): CompanySettings {
  return {
    ...DEFAULT_COMPANY_SETTINGS,
  };
}
