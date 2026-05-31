import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "@/lib/api/authApi";
import { cloneDefaultCompanySettings } from "@/lib/defaults/companySettings";
import { AuthContext, type AuthContextValue } from "@/app/providers/auth-context";
import { getCompanySettings, loadCompanySettingsSafely } from "@/lib/api/companyApi";
import type { AuthUser, LoginRequest } from "@/types/auth";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [companySettings, setCompanySettings] = useState<AuthContextValue["companySettings"]>(
    cloneDefaultCompanySettings(),
  );
  const [companySettingsSource, setCompanySettingsSource] =
    useState<AuthContextValue["companySettingsSource"]>("missing");
  const [companySettingsError, setCompanySettingsError] =
    useState<AuthContextValue["companySettingsError"]>(null);
  const [hasDismissedCompanySettingsError, setHasDismissedCompanySettingsError] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setCompanySettings(cloneDefaultCompanySettings());
    setCompanySettingsSource("missing");
    setCompanySettingsError(null);
    setHasDismissedCompanySettingsError(false);
  }, []);

  const loadStartupCompanySettings = useCallback(async () => {
    const result = await loadCompanySettingsSafely(true);

    if (result.success) {
      setCompanySettings(result.data);
      setCompanySettingsSource("remote");
      setCompanySettingsError(null);
      setHasDismissedCompanySettingsError(false);
      return;
    }

    setCompanySettings(result.fallbackData);
    setCompanySettingsSource("fallback");
    setCompanySettingsError(result.error);
    setHasDismissedCompanySettingsError(false);
  }, []);

  const hydrateSession = useCallback(async () => {
    try {
      setIsLoading(true);

      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await loadStartupCompanySettings();
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [clearSession, loadStartupCompanySettings]);

  const login = useCallback(
    async (request: LoginRequest) => {
      setIsLoading(true);

      try {
        const currentUser = await loginRequest(request);
        setUser(currentUser);
        await loadStartupCompanySettings();
      } catch (error) {
        clearSession();
        throw error instanceof Error ? error : new Error("Login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    [clearSession, loadStartupCompanySettings],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refreshCompanySettings = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const settings = await getCompanySettings(true);
      setCompanySettings(settings);
      setCompanySettingsSource("remote");
      setCompanySettingsError(null);
      setHasDismissedCompanySettingsError(false);
    } catch {
      // Preserve the last known settings so navigation and UI stay stable.
    }
  }, [user]);

  const retryCompanySettingsLoad = useCallback(async () => {
    if (!user) {
      return;
    }

    await loadStartupCompanySettings();
  }, [loadStartupCompanySettings, user]);

  const dismissCompanySettingsError = useCallback(() => {
    setHasDismissedCompanySettingsError(true);
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      setIsLoading(false);
      clearSession();
    }

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      companySettings,
      companySettingsSource,
      companySettingsError,
      hasDismissedCompanySettingsError,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      hydrateSession,
      refreshCompanySettings,
      retryCompanySettingsLoad,
      dismissCompanySettingsError,
    }),
    [
      user,
      companySettings,
      companySettingsSource,
      companySettingsError,
      hasDismissedCompanySettingsError,
      isLoading,
      login,
      logout,
      hydrateSession,
      refreshCompanySettings,
      retryCompanySettingsLoad,
      dismissCompanySettingsError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
