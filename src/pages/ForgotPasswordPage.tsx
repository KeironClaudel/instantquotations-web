import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForgotPasswordPage } from "@/hooks/pages/auth/useForgotPasswordPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { email, feedback, handleSubmit, isSubmitting, setEmail } = useForgotPasswordPage();

  return (
    <div className="app-auth-shell">
      <div className="app-auth-frame">
        <div className="app-auth-split">
          <section className="app-auth-hero">
            <div className="app-page-badge border-white/20 bg-white/10 text-white">
              InstantQuotations
            </div>

            <h1 className="app-auth-title mt-5">{t("pages.forgotPassword.title")}</h1>
            <p className="app-auth-copy">{t("pages.forgotPassword.description")}</p>
          </section>

          <section className="app-auth-card">
          <div className="app-auth-utility">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>

          <div className="mb-6">
            <div className="app-page-badge">{t("components.appShell.workspace")}</div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] text-[var(--ip-text)]">
              {t("pages.forgotPassword.title")}
            </h2>
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
