import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLoginPage } from "@/hooks/pages/auth/useLoginPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function LoginPage() {
  const { t } = useTranslation();
  const {
    email,
    errorMessage,
    handleSubmit,
    isSubmitting,
    setEmail,
    setPassword,
    password,
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
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-slate-900 underline dark:text-slate-100">
                {t("pages.login.forgotPassword")}
              </Link>
            </div>
          </div>

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
