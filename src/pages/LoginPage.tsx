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
    <div className="app-auth-shell">
      <div className="app-auth-frame">
        <div className="app-auth-split">
          <section className="app-auth-hero">
            <div className="app-page-badge border-white/20 bg-white/10 text-white">
              InstantProforms
            </div>

            <h1 className="app-auth-title mt-5">{t("pages.login.title")}</h1>
            <p className="app-auth-copy">{t("pages.login.description")}</p>

            <div className="app-auth-visual hidden min-[900px]:flex" aria-hidden="true">
              <div className="app-auth-visual-sheet">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="app-kicker text-white/68">Proform</div>
                    <div className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-white">
                      Instant Quote
                    </div>
                  </div>

                  <div className="app-auth-visual-badge">PDF</div>
                </div>

                <div className="app-auth-visual-lines">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="app-auth-visual-row">
                  <span>Client</span>
                  <strong>John Doe</strong>
                </div>

                <div className="app-auth-visual-row">
                  <span>Status</span>
                  <strong>Ready to Send</strong>
                </div>

                <div className="app-auth-visual-row">
                  <span>Total</span>
                  <strong className="app-auth-visual-amount">$1,250.00</strong>
                </div>
              </div>

              <div className="app-auth-visual-orb" />
              <div className="app-auth-visual-dot" />
              <div className="app-auth-visual-dot-delayed" />
            </div>
          </section>

          <section className="app-auth-card">
            <div className="app-auth-utility">
              <ThemeSwitcher compact />
              <LanguageSwitcher compact />
            </div>

            <div className="mb-6">
              <div className="app-page-badge">{t("components.appShell.workspace")}</div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] text-[var(--ip-text)]">
                {t("pages.login.title")}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--ip-text-soft)]">
                {t("pages.login.description")}
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

              <div>
                <label className="app-label" htmlFor="password">
                  {t("pages.login.password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    className="app-input pr-11"
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
                    className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-[var(--ip-text-soft)] transition hover:text-[var(--ip-text)] focus:text-[var(--ip-text)] focus:outline-none"
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
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-[var(--ip-primary)] underline"
                  >
                    {t("pages.login.forgotPassword")}
                  </Link>
                </div>
              </div>

              <label className="app-card-soft flex items-center gap-3 px-4 py-3 text-sm text-[var(--ip-text-soft)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                <span>{t("pages.login.rememberMe")}</span>
              </label>

              {errorMessage ? <div className="app-feedback-error">{errorMessage}</div> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="app-button-primary w-full"
              >
                {isSubmitting ? t("pages.login.signingIn") : t("pages.login.signIn")}
              </button>

              <div className="mt-2 text-center text-sm text-[var(--ip-text-soft)]">
                {t("pages.login.accessManagedByAdmin")}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
