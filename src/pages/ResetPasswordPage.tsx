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
    <div className="app-auth-shell">
      <div className="app-auth-frame">
        <div className="app-auth-split">
          <section className="app-auth-hero">
            <div className="app-page-badge border-white/20 bg-white/10 text-white">
              InstantQuotations
            </div>

            <h1 className="app-auth-title mt-5">{t("pages.resetPassword.title")}</h1>
            <p className="app-auth-copy">{t("pages.resetPassword.description")}</p>
          </section>

          <section className="app-auth-card">
          <div className="app-auth-utility">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>

          <div className="mb-6">
            <div className="app-page-badge">{t("components.appShell.workspace")}</div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] text-[var(--ip-text)]">
              {t("pages.resetPassword.title")}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--ip-text-soft)]">
              {t("pages.resetPassword.description")}
            </p>
          </div>

        <form className="app-auth-form" onSubmit={handleSubmit}>
          <div>
            <label
              className="app-label"
              htmlFor="new-password"
            >
              {t("pages.resetPassword.newPassword")}
            </label>
            <input
              id="new-password"
              type="password"
              className="app-input"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
            <p className="app-helper">
              {t("pages.resetPassword.passwordHint")}
            </p>
          </div>

          <div>
            <label
              className="app-label"
              htmlFor="confirm-password"
            >
              {t("pages.resetPassword.confirmNewPassword")}
            </label>
            <input
              id="confirm-password"
              type="password"
              className="app-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {!token ? (
            <div className="app-feedback-warning">
              {t("pages.resetPassword.invalidTokenBanner")}
            </div>
          ) : null}

          {feedback ? (
            <div
              className={`${
                feedback.type === "success"
                  ? "app-feedback-success"
                  : "app-feedback-error"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="app-button-primary w-full"
          >
            {isSubmitting ? t("pages.resetPassword.updating") : t("pages.resetPassword.updatePassword")}
          </button>

          <div className="text-center text-sm text-[var(--ip-text-soft)]">
            <Link to="/login" className="font-semibold text-[var(--ip-primary)] underline">
              {t("pages.resetPassword.backToSignIn")}
            </Link>
          </div>
        </form>
          </section>
        </div>
      </div>
    </div>
  );
}
