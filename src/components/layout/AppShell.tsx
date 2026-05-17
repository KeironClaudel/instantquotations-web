import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { isCompanySetupComplete } from "@/lib/utils/companySetup";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    "rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-slate-100 text-slate-900 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
  ].join(" ");
}

function setupLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    "rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-amber-500 text-white"
      : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:hover:bg-amber-500/25",
  ].join(" ");
}

export function AppShell() {
  const { t } = useTranslation();
  const { companySettings, logout, user } = useAuth();
  const isSetupComplete = isCompanySetupComplete(companySettings);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const primaryLinks = [
    { to: "/app", label: t("components.appShell.dashboard"), end: true },
    { to: "/app/proforms/new", label: t("components.appShell.newProform") },
    { to: "/app/proforms", label: t("components.appShell.proforms"), end: true },
    { to: "/app/clients", label: t("components.appShell.clients") },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {companySettings?.logoUrl ? (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <img
                    src={companySettings.logoUrl}
                    alt={companySettings.displayName}
                    className="h-9 w-9 object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-200 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  IP
                </div>
              )}

              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                  {companySettings?.displayName ?? "InstantProforms"}
                </div>

                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                    {t("components.appShell.tax")}: {companySettings?.taxPercentage ?? 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <LanguageSwitcher compact />
              <ThemeSwitcher compact />
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex">
            <nav className="flex items-center justify-end gap-2">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={navLinkClassName}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>

              {isMobileMenuOpen ? (
                <div className="absolute right-0 top-14 z-40 flex w-64 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <NavLink to="/app/settings" className={navLinkClassName} onClick={() => setIsMobileMenuOpen(false)}>
                    {t("components.appShell.settings")}
                  </NavLink>

                  {user?.isPlatformAdmin ? (
                    <NavLink
                      to="/app/admin/companies/new"
                      className={navLinkClassName}
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
                    onClick={() => void logout()}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    {t("components.appShell.logout")}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>

            {isMobileMenuOpen ? (
              <div className="absolute right-0 top-14 z-40 flex w-64 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <LanguageSwitcher compact />
                  <ThemeSwitcher compact />
                </div>

                <NavLink to="/app/settings" className={navLinkClassName} onClick={() => setIsMobileMenuOpen(false)}>
                  {t("components.appShell.settings")}
                </NavLink>

                {user?.isPlatformAdmin ? (
                  <NavLink
                    to="/app/admin/companies/new"
                    className={navLinkClassName}
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
                  onClick={() => void logout()}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {t("components.appShell.logout")}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6">
            {primaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `${navLinkClassName({ isActive })} whitespace-nowrap`}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
