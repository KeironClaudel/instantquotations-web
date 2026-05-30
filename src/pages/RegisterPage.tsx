import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRegisterPage } from "@/hooks/pages/auth/useRegisterPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

type RegisterPageProps = {
  mode?: "public" | "admin";
};

export function RegisterPage({ mode = "public" }: RegisterPageProps) {
  const { t } = useTranslation();
  const isAdminMode = mode === "admin";
  const { feedback, form, handleLogoChange, handleSubmit, isSubmitting, logoFile, preview, updateField } =
    useRegisterPage({ mode });

  const inputClassName =
    "app-input";

  const textareaClassName =
    "app-textarea min-h-32";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="app-page-head text-center">
        {!isAdminMode ? (
          <div className="mb-4 flex justify-end gap-2">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>
        ) : null}

        <div className="app-page-badge">
          {isAdminMode ? t("pages.adminCompanyRegistration.badge") : t("pages.register.badge")}
        </div>

        <h1 className="app-page-title mt-3">
          {isAdminMode ? t("pages.adminCompanyRegistration.title") : t("pages.register.title")}
        </h1>

        <p className="app-page-copy mx-auto">
          {isAdminMode ? t("pages.adminCompanyRegistration.description") : t("pages.register.description")}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("common.labels.companyInformation")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("pages.register.companyName")}</label>
                <input
                  className={inputClassName}
                  value={form.companyName}
                  onChange={(event) => updateField("companyName", event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.register.companySlug")}</label>
                <input
                  className={inputClassName}
                  value={form.companySlug}
                  onChange={(event) => updateField("companySlug", event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("common.labels.displayName")}</label>
                <input
                  className={inputClassName}
                  value={form.displayName}
                  onChange={(event) => updateField("displayName", event.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("common.labels.legalName")}</label>
                <input
                  className={inputClassName}
                  value={form.legalName}
                  onChange={(event) => updateField("legalName", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.register.companyEmail")}</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={form.companyEmail}
                  onChange={(event) => updateField("companyEmail", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("common.labels.phone")}</label>
                <input
                  className={inputClassName}
                  value={form.companyPhone}
                  onChange={(event) => updateField("companyPhone", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("common.labels.website")}</label>
                <input
                  className={inputClassName}
                  value={form.companyWebsite}
                  onChange={(event) => updateField("companyWebsite", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("common.labels.address")}</label>
                <input
                  className={inputClassName}
                  value={form.companyAddress}
                  onChange={(event) => updateField("companyAddress", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.register.ownerAccount")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("pages.register.ownerFullName")}</label>
                <input
                  className={inputClassName}
                  value={form.ownerFullName}
                  onChange={(event) => updateField("ownerFullName", event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.register.ownerEmail")}</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={form.ownerEmail}
                  onChange={(event) => updateField("ownerEmail", event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.login.password")}</label>
                <input
                  type="password"
                  className={inputClassName}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("pages.resetPassword.confirmNewPassword")}</label>
                <input
                  type="password"
                  className={inputClassName}
                  value={form.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.register.brandingAndTax")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.primaryColor")}</label>
                <input
                  type="color"
                  className="app-swatch"
                  value={form.primaryColor}
                  onChange={(event) => updateField("primaryColor", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.secondaryColor")}</label>
                <input
                  type="color"
                  className="app-swatch"
                  value={form.secondaryColor}
                  onChange={(event) => updateField("secondaryColor", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.accentColor")}</label>
                <input
                  type="color"
                  className="app-swatch"
                  value={form.accentColor}
                  onChange={(event) => updateField("accentColor", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.register.proformPrefix")}</label>
                <input
                  className={inputClassName}
                  value={form.proformPrefix}
                  onChange={(event) => updateField("proformPrefix", event.target.value.toUpperCase())}
                  maxLength={5}
                  required
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t("pages.register.proformPrefixHelp")}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.onboardingCompany.taxPercentage")}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className={inputClassName}
                  value={form.taxPercentage}
                  onChange={(event) => updateField("taxPercentage", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.onboardingCompany.currencySymbol")}</label>
                <input
                  className={inputClassName}
                  value={form.currencySymbol}
                  onChange={(event) => updateField("currencySymbol", event.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("pages.onboardingCompany.taxLabel")}</label>
                <input
                  className={inputClassName}
                  value={form.taxLabel}
                  onChange={(event) => updateField("taxLabel", event.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("pages.register.companyLogoOptional")}</label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  className={inputClassName}
                  onChange={handleLogoChange}
                />
              </div>
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("common.labels.termsAndConditions")}
            </h2>

            <textarea
              className={textareaClassName}
              value={form.termsAndConditions}
              onChange={(event) => updateField("termsAndConditions", event.target.value)}
            />
          </section>

        {feedback ? (
          <div
            className={`rounded-2xl px-4 py-3.5 text-sm shadow-sm ${
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
            {isSubmitting ? t("pages.register.creatingWorkspace") : t("pages.register.createWorkspace")}
          </button>

          {!isAdminMode ? (
            <div className="text-center text-sm text-[var(--ip-text-soft)]">
              {t("pages.register.alreadyHaveAccount")}{" "}
              <Link to="/login" className="font-semibold text-[var(--ip-primary)] underline">
                {t("pages.register.signIn")}
              </Link>
            </div>
          ) : null}
        </form>

        <section className="app-card p-5 sm:p-6">
          <h2 className="app-section-heading">
            {t("pages.register.livePreview")}
          </h2>

          <p className="app-section-copy">
            {t("pages.register.livePreviewDescription")}
          </p>

          <div className="mt-5 rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
            <div
              className="rounded-3xl p-5 text-white"
              style={{ backgroundColor: preview.primaryColor }}
            >
                  <div className="text-xs uppercase tracking-wide text-white/70">
                {preview.numberPreview}
              </div>

              <div className="mt-2 text-2xl font-semibold">{preview.displayName}</div>

              <div className="mt-5 grid gap-3">
                <div
                  className="rounded-2xl p-3 text-slate-900"
                  style={{ backgroundColor: preview.secondaryColor }}
                >
                  <div className="text-xs uppercase tracking-wide text-slate-600">
                    {t("common.finance.tax")}
                  </div>
                  <div className="mt-1 font-semibold">
                    {preview.taxLabel} ({preview.taxPercentage}%)
                  </div>
                </div>

                <div
                  className="rounded-2xl p-3 text-slate-900"
                  style={{ backgroundColor: preview.accentColor }}
                >
                  <div className="text-xs uppercase tracking-wide text-slate-600">
                    {t("common.finance.currency")}
                  </div>
                  <div className="mt-1 font-semibold">{preview.currencySymbol}</div>
                </div>

                <div className="rounded-2xl border border-dashed border-white/30 px-4 py-3 text-sm text-white/80">
                  {logoFile
                    ? t("pages.register.logoSelected", { name: logoFile.name })
                    : t("pages.register.logoNotSelected")}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
