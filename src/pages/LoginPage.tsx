import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoginPage } from "@/hooks/pages/auth/useLoginPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function LoginPage() {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    email,
    errorMessage,
    handleSubmit,
    isSubmitting,
    setEmail,
    setPassword,
    setRememberMe,
    password,
    rememberMe,
    shouldRedirect,
  } = useLoginPage();

  if (shouldRedirect) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <div className="mb-4 flex justify-end gap-2">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t("pages.login.title")}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t("pages.login.description")}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
              {t("common.labels.email")}
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
              {t("pages.login.password")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-11 text-slate-900 outline-none ring-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                aria-label={isPasswordVisible ? t("pages.login.hidePassword") : t("pages.login.showPassword")}
                aria-pressed={isPasswordVisible}
                className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-slate-500 transition hover:text-slate-700 focus:text-slate-700 focus:outline-none dark:text-slate-400 dark:hover:text-slate-200 dark:focus:text-slate-200"
              >
                {isPasswordVisible ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" />
                    <path d="M9.4 5.5A10.9 10.9 0 0 1 12 5.2c5.2 0 9.4 4.4 10 5-.4.5-1.8 2.1-3.9 3.5" />
                    <path d="M6.7 6.7C3.9 8.4 2.2 10.7 2 11c.6.7 4.8 5 10 5 1.3 0 2.4-.2 3.5-.5" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3.6-6.8 10-6.8S22 12 22 12s-3.6 6.8-10 6.8S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-slate-900 underline dark:text-slate-100">
                {t("pages.login.forgotPassword")}
              </Link>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <span>{t("pages.login.rememberMe")}</span>
          </label>

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {isSubmitting ? t("pages.login.signingIn") : t("pages.login.signIn")}
          </button>

          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            {t("pages.login.accessManagedByAdmin")}
          </div>
        </form>
      </div>
    </div>
  );
}
