import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { isCompanySetupComplete } from "@/lib/utils/companySetup";
import { getProformSeriesPreview } from "@/lib/utils/proformNumber";

export function useDashboardPage() {
  const { t } = useTranslation();
  const { user, companySettings, companySettingsSource } = useAuth();

  const isSetupComplete =
    companySettingsSource === "remote" && isCompanySetupComplete(companySettings);

  return {
    companySettings,
    companyName: companySettings.displayName.trim() || t("common.defaults.companyName"),
    currencySymbol: companySettings.currencySymbol.trim() || "-",
    isSetupComplete,
    logoUrl: companySettings.logoUrl ?? null,
    nextNumberPreview: getProformSeriesPreview(companySettings.proformPrefix ?? "C"),
    phone: companySettings.phone?.trim() || t("common.defaults.notConfiguredYet"),
    primaryColor: companySettings.primaryColor ?? "#0f172a",
    taxLabel: companySettings.taxLabel.trim() || "-",
    taxPercentage: Number.isFinite(companySettings.taxPercentage)
      ? `${companySettings.taxPercentage}%`
      : "-",
    userFirstName: user?.fullName?.split(" ")[0] ?? "User",
    website: companySettings.website?.trim() || t("common.defaults.notConfiguredYet"),
  };
}
