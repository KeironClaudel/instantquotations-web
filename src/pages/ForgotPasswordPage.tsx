import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForgotPasswordPage } from "@/hooks/pages/auth/useForgotPasswordPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { email, feedback, handleSubmit, isSubmitting, setEmail } = useForgotPasswordPage();

  return (
    <div className="app-auth-shell password-auth-shell">
      <div className="app-auth-frame">
        <div className="password-auth-content">
          <section className="app-auth-card">
          <div className="password-auth-toolbar">
            <div className="app-page-badge">{t("components.appShell.workspace")}</div>
            <div className="password-auth-controls">
              <LanguageSwitcher compact />
              <ThemeSwitcher compact />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] text-[var(--ip-text)]">
              {t("pages.forgotPassword.title")}
            </h1>
            <p className="mt-2 text-sm leading-7 text-[var(--ip-text-soft)]">
              {t("pages.forgotPassword.description")}
            </p>
          </div>

        <form className="app-auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="app-label" htmlFor="email">
              {t("common.labels.email")}
            </label>
            <input
              id="email"
              type="email"
              className="app-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

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
            disabled={isSubmitting}
            className="app-button-primary w-full"
          >
            {isSubmitting ? t("pages.forgotPassword.sending") : t("pages.forgotPassword.sendLink")}
          </button>

          <div className="text-center text-sm text-[var(--ip-text-soft)]">
            {t("pages.forgotPassword.remembered")}{" "}
            <Link to="/login" className="font-semibold text-[var(--ip-primary)] underline">
              {t("pages.forgotPassword.backToSignIn")}
            </Link>
          </div>
        </form>
          </section>
        </div>
      </div>
    </div>
  );
}
