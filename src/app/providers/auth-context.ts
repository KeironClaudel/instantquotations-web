import { createContext } from "react";
import type { LoginRequest, AuthUser } from "@/types/auth";
import type { CompanySettings } from "@/types/company";
import type { ApiClientError } from "@/lib/api/apiErrors";

export type CompanySettingsSource = "remote" | "fallback" | "missing";

export type AuthContextValue = {
  user: AuthUser | null;
  companySettings: CompanySettings;
  companySettingsSource: CompanySettingsSource;
  companySettingsError: ApiClientError | null;
  hasDismissedCompanySettingsError: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hydrateSession: () => Promise<void>;
  refreshCompanySettings: () => Promise<void>;
  retryCompanySettingsLoad: () => Promise<void>;
  dismissCompanySettingsError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
