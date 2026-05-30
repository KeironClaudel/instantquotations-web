import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { isCompanySetupComplete } from "@/lib/utils/companySetup";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    "inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
    isActive
      ? "bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.14)] dark:bg-white dark:text-slate-950"
      : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
  ].join(" ");
}

function utilityLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
    isActive
      ? "bg-[var(--ip-primary-soft)] text-[var(--ip-primary)]"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
  ].join(" ");
}

function setupLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
    isActive
      ? "bg-amber-500 text-white shadow-[0_16px_30px_rgba(217,154,38,0.22)]"
      : "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-500/18 dark:text-amber-100 dark:hover:bg-amber-500/24",
  ].join(" ");
}

function withFixedWidth(className: string, widthClassName: string) {
  return `${className} ${widthClassName}`;
}

function getUserInitials(fullName?: string | null) {
  if (!fullName) {
    return "IP";
  }

  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppShell() {
  const { t } = useTranslation();
  const { companySettings, logout, user } = useAuth();
  const isSetupComplete = isCompanySetupComplete(companySettings);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userInitials = getUserInitials(user?.fullName);

  const primaryLinks = [
    {
      to: "/app",
      label: t("components.appShell.dashboard"),
      end: true,
      widthClassName: "lg:min-w-[7.75rem]",
    },
    {
      to: "/app/proforms/new",
      label: t("components.appShell.newProform"),
      widthClassName: "lg:min-w-[10.25rem]",
    },
    {
      to: "/app/proforms",
      label: t("components.appShell.proforms"),
      end: true,
      widthClassName: "lg:min-w-[7.5rem]",
    },
    {
      to: "/app/clients",
      label: t("components.appShell.clients"),
      widthClassName: "lg:min-w-[6.75rem]",
    },
  ];

  return (
    <div className="app-shell">
      <header className="app-topbar sticky top-0 z-40">
        <div className="mx-auto flex w-full max-w-none flex-col gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:px-8 lg:py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="app-card flex min-w-0 items-center gap-3 px-3 py-3 sm:px-5 lg:w-auto lg:min-w-[18rem] lg:max-w-[24rem] lg:flex-none">
              <Link
                to="/app"
                className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl"
              >
                {companySettings?.logoUrl ? (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] border border-[var(--ip-border)] bg-white/80 shadow-sm sm:h-14 sm:w-14 sm:rounded-[1.25rem] dark:bg-slate-950/70">
                    <img
                      src={companySettings.logoUrl}
                      alt={companySettings.displayName}
                      className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] bg-slate-950 text-sm font-black tracking-[0.16em] text-white sm:h-14 sm:w-14 sm:rounded-[1.25rem] dark:bg-white dark:text-slate-950">
                    IP
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.95rem] font-extrabold tracking-[-0.02em] text-[var(--ip-text)] sm:text-base">
                    {companySettings?.displayName ?? "InstantProforms"}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 pb-1 sm:gap-2 lg:overflow-x-auto lg:flex-nowrap lg:whitespace-nowrap lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
                    <span className="app-chip app-chip-strong">
                      {t("components.appShell.tax")}: {companySettings?.taxPercentage ?? 0}%
                    </span>

                    {!isSetupComplete ? (
                      <span className="app-chip app-chip-warning dark:bg-amber-500/18 dark:text-amber-100">
                        {t("components.appShell.setupNeedsAttention")}
                      </span>
                    ) : (
                      <span className="app-chip app-chip-success dark:bg-emerald-500/18 dark:text-emerald-100">
                        {t("components.appShell.setupComplete")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                className="app-button-secondary px-3 lg:hidden"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>
            </div>

            <nav className="app-card hidden min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto px-3 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-4 lg:flex">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={(state) => withFixedWidth(navLinkClassName(state), link.widthClassName)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center justify-end gap-3 lg:flex">
              <div className="app-card flex items-center gap-2 px-2 py-2">
                <LanguageSwitcher compact />
                <ThemeSwitcher compact />
              </div>

              <NavLink
                to="/app/settings"
                className={(state) => withFixedWidth(utilityLinkClassName(state), "lg:min-w-[8.75rem] lg:justify-center")}
              >
                {t("components.appShell.settings")}
              </NavLink>

              {user?.isPlatformAdmin ? (
                <NavLink
                  to="/app/admin/companies/new"
                  className={(state) => withFixedWidth(utilityLinkClassName(state), "lg:min-w-[11.5rem] lg:justify-center")}
                >
                  {t("components.appShell.registerCompany")}
                </NavLink>
              ) : null}

              {!isSetupComplete ? (
                <NavLink
                  to="/app/onboarding/company"
                  className={(state) => withFixedWidth(setupLinkClassName(state), "lg:min-w-[11rem] lg:justify-center")}
                >
                  {t("components.appShell.completeSetup")}
                </NavLink>
              ) : null}

              <button
                type="button"
                onClick={() => void logout()}
                className="app-button-secondary lg:min-w-[7.5rem] lg:justify-center"
              >
                {t("components.appShell.logout")}
              </button>

              <div className="app-card flex min-w-0 items-center gap-3 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-xs font-black tracking-[0.12em] text-white dark:bg-white dark:text-slate-950">
                  {userInitials}
                </div>
                <div className="min-w-0 max-w-[15rem]">
                  <div className="truncate text-sm font-bold text-[var(--ip-text)]">
                    {user?.fullName ?? "Workspace User"}
                  </div>
                  <div className="truncate text-xs text-[var(--ip-text-soft)]">
                    {user?.email ?? t("components.appShell.workspace")}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div
          aria-hidden={!isMobileMenuOpen}
          className={[
            "mx-auto w-full max-w-none overflow-hidden px-4 transition-all duration-300 ease-out sm:px-6 lg:hidden",
            isMobileMenuOpen
              ? "max-h-[22rem] translate-y-0 pb-4 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-2 pb-0 opacity-0",
          ].join(" ")}
        >
          <div className="app-card flex flex-col gap-2 px-3 py-3">
            <div className="grid grid-cols-2 gap-3 pb-2">
              <div className="flex justify-start">
                <div className="flex w-[8.25rem] justify-center">
                  <LanguageSwitcher compact />
                </div>
              </div>

              <div className="flex justify-end">
                <div className="flex w-[8.25rem] justify-center">
                  <ThemeSwitcher compact showLabelWhenCompact />
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--ip-border)] pt-3">
              <div className="mb-2 px-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ip-text-soft)]">
                {t("components.appShell.workspace")}
              </div>

              <div className="flex flex-col gap-2">
                {primaryLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      [
                        "inline-flex min-h-12 w-full items-center justify-start rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.14)] dark:bg-white dark:text-slate-950"
                          : "text-[var(--ip-text)] hover:bg-[var(--ip-primary-soft)] hover:text-[var(--ip-primary)]",
                      ].join(" ")
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--ip-border)] pt-3">
              <div className="mb-2 px-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ip-text-soft)]">
                {t("components.appShell.settings")}
              </div>

              <div className="flex flex-col gap-2">
                <NavLink
                  to="/app/settings"
                  className={utilityLinkClassName}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("components.appShell.settings")}
                </NavLink>

                {user?.isPlatformAdmin ? (
                  <NavLink
                    to="/app/admin/companies/new"
                    className={utilityLinkClassName}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("components.appShell.registerCompany")}
                  </NavLink>
                ) : null}

                {!isSetupComplete ? (
                  <NavLink
                    to="/app/onboarding/company"
                    className={setupLinkClassName}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("components.appShell.completeSetup")}
                  </NavLink>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    void logout();
                  }}
                  className="app-button-secondary justify-start"
                >
                  {t("components.appShell.logout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
