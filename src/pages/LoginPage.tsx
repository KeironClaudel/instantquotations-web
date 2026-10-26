import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoginPage } from "@/hooks/pages/auth/useLoginPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Icon } from "@/components/ui/Icon";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const es = i18n.resolvedLanguage?.startsWith("es");
  const [showWelcome, setShowWelcome] = useState(false);
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
    <div className={`app-auth-shell login-shell ${showWelcome ? "show-welcome" : ""}`}>
      <div className="app-auth-frame">
        <header className="auth-header"><Link to="/login" className="brand-lockup"><span className="brand-mark"><Icon name="document" /></span><span>InstantQuotations</span></Link><div className="flex items-center gap-2"><LanguageSwitcher compact /><ThemeSwitcher compact /></div></header>
        <div className="app-auth-split">
          <section className="app-auth-hero">
            <div className="app-page-badge border-white/20 bg-white/10 text-white">
              InstantQuotations
            </div>

            <h1 className="app-auth-title mt-5">{es ? "Crea y gestiona cotizaciones de forma" : "Create and manage quotations"} <span className="hero-highlight">{es ? "rápida y profesional" : "quickly and professionally"}</span></h1>
            <p className="app-auth-copy">{es ? "Todo lo que necesitas para tus clientes, productos y cotizaciones, en un solo lugar." : "Everything you need for your clients, products and quotations, in one place."}</p>

            <div className="hero-benefits">
              {[ ["clock", es ? "Cotizaciones más rápidas" : "Faster quotations", es ? "Crea y envía cotizaciones en minutos." : "Create and send quotations in minutes."], ["clients", es ? "Gestión de clientes" : "Client management", es ? "Mantén toda tu información organizada." : "Keep all your information organized."], ["document", es ? "Todo en un solo lugar" : "Everything in one place", es ? "Tu negocio, más eficiente." : "A more efficient business."] ].map(([icon, title, copy]) => <div className="hero-benefit" key={title}><span className="brand-mark"><Icon name={icon as "clock" | "clients" | "document"} /></span><div><h3>{title}</h3><p>{copy}</p></div></div>)}
            </div>
            <div className="product-preview" aria-hidden="true"><div className="preview-brand"><Icon name="document" /> InstantQuotations</div><div className="preview-layout"><div className="preview-sidebar"><span>▦ Dashboard</span><span>＋ {t("components.appShell.newProform")}</span><span>▤ {t("components.appShell.proforms")}</span><span>♧ {t("components.appShell.clients")}</span></div><div className="preview-content"><h3>Dashboard</h3><p>{es ? "Resumen de tu negocio" : "Your business at a glance"}</p><div className="preview-stats"><div><Icon name="document" /><strong>24</strong><small>{t("components.appShell.proforms")}</small></div><div><Icon name="clients" /><strong>16</strong><small>{t("components.appShell.clients")}</small></div></div><h4>{es ? "Cotizaciones recientes" : "Recent quotations"}</h4>{["John Doe", "María López", "Constructora R."].map(name => <div className="preview-row" key={name}><span>{name[0]}</span>{name}<i /></div>)}</div></div></div>
            <button className="app-button-primary welcome-start" type="button" onClick={() => setShowWelcome(false)}>{es ? "Comenzar" : "Get started"} →</button>
          </section>

          <section className="app-auth-card">
            <div className="mb-6">
              <div className="app-page-badge login-badge">{es ? "Bienvenido" : "Welcome"}</div>
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
                  placeholder={es ? "tu@correo.com" : "you@example.com"}
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
                    placeholder={es ? "Ingresa tu contraseña" : "Enter your password"}
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

              <label className="flex items-center gap-3 py-3 text-sm text-[var(--ip-text-soft)]">
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
                {isSubmitting ? t("pages.login.signingIn") : t("pages.login.signIn")} <span aria-hidden="true">→</span>
              </button>

              <div className="mt-2 text-center text-sm text-[var(--ip-text-soft)]">
                {t("pages.login.accessManagedByAdmin")}
              </div>
            </form>
            <button type="button" className="welcome-link" onClick={() => setShowWelcome(true)}>{es ? "Conoce InstantQuotations" : "Discover InstantQuotations"} →</button>
          </section>
        </div>
      </div>
    </div>
  );
}
