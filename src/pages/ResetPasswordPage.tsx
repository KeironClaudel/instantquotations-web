import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useResetPasswordPage } from "@/hooks/pages/auth/useResetPasswordPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const {
    confirmPassword,
    feedback,
    handleSubmit,
    isSubmitting,
    newPassword,
    setConfirmPassword,
    setNewPassword,
    token,
  } = useResetPasswordPage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <div className="mb-4 flex justify-end gap-2">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t("pages.resetPassword.title")}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t("pages.resetPassword.description")}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              htmlFor="new-password"
            >
              {t("pages.resetPassword.newPassword")}
            </label>
            <input
              id="new-password"
              type="password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t("pages.resetPassword.passwordHint")}
            </p>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              htmlFor="confirm-password"
            >
              {t("pages.resetPassword.confirmNewPassword")}
            </label>
            <input
              id="confirm-password"
              type="password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {!token ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {t("pages.resetPassword.invalidTokenBanner")}
            </div>
          ) : null}

          {feedback ? (
            <div
              className={`rounded-xl px-3 py-2 text-sm ${
                feedback.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {isSubmitting ? t("pages.resetPassword.updating") : t("pages.resetPassword.updatePassword")}
          </button>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <Link to="/login" className="font-medium text-slate-900 underline dark:text-slate-100">
              {t("pages.resetPassword.backToSignIn")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
