import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { isCompanySetupComplete } from "@/lib/utils/companySetup";
import { PageLoader } from "@/components/ui/PageLoader";
import { StartupErrorScreen } from "@/components/ui/StartupErrorScreen";

const DEVELOPER_DIAGNOSTICS_EMAIL = "keironqc@gmail.com";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const {
    companySettings,
    companySettingsError,
    companySettingsSource,
    dismissCompanySettingsError,
    hasDismissedCompanySettingsError,
    isAuthenticated,
    isLoading,
    retryCompanySettingsLoad,
    user,
  } = useAuth();
  const location = useLocation();
  const showDeveloperDiagnostics =
    import.meta.env.DEV &&
    user?.email?.trim().toLowerCase() === DEVELOPER_DIAGNOSTICS_EMAIL;

  if (isLoading) {
    return <PageLoader message={t("components.protectedRoute.loadingWorkspace")} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const isOnboardingRoute = location.pathname.startsWith("/app/onboarding");
  const isSetupComplete =
    companySettingsSource === "remote" && isCompanySetupComplete(companySettings);

  if (
    companySettingsSource === "fallback" &&
    companySettingsError &&
    !hasDismissedCompanySettingsError
  ) {
    return (
      <StartupErrorScreen
        error={companySettingsError}
        onRetry={retryCompanySettingsLoad}
        onContinue={dismissCompanySettingsError}
        showDeveloperDiagnostics={showDeveloperDiagnostics}
      />
    );
  }

  if (companySettingsSource === "remote" && !isSetupComplete && !isOnboardingRoute) {
    return <Navigate to="/app/onboarding/company" replace />;
  }

  if (companySettingsSource === "remote" && isSetupComplete && isOnboardingRoute) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
