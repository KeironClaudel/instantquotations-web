import { PageLoader } from "@/components/ui/PageLoader";
import { useTranslation } from "react-i18next";
import { useSettingsPage } from "@/hooks/pages/company/useSettingsPage";

export function SettingsPage() {
  const { t } = useTranslation();
  const {
    companySettings,
    emailDeliveryStatus,
    feedback,
    form,
    handleLogoChange,
    handleSubmit,
    canEditRealCompanySettings,
    isLoading,
    isSaving,
    isUploadingLogo,
    previewStyles,
    updateField,
  } = useSettingsPage();

  const inputClassName =
    "app-input";

  const textareaClassName =
    "app-textarea min-h-32";

  const emailDeliveryStatusClassName = {
    ready:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200",
    incomplete:
      "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200",
    missing:
      "border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  }[emailDeliveryStatus];

  const emailDeliveryStatusLabel = t(`pages.settings.emailDeliveryStatus.${emailDeliveryStatus}.label`);
  const emailDeliveryStatusHelp = t(`pages.settings.emailDeliveryStatus.${emailDeliveryStatus}.help`);

  if (isLoading) {
    return <PageLoader message={t("pages.settings.loading")} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-1 sm:px-0">
      <div className="app-page-head">
        <div className="app-page-badge">
          {t("pages.settings.badge")}
        </div>

        <h1 className="app-page-title mt-3">
          {t("pages.settings.title")}
        </h1>

        <p className="app-page-copy max-w-2xl">
          {t("pages.settings.description")}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!canEditRealCompanySettings ? (
            <div className="app-feedback-warning">
              {t("pages.settings.feedback.realSettingsRequired")}
            </div>
          ) : null}

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("common.labels.companyInformation")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
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
                <label className="mb-1 block text-sm font-medium">{t("common.labels.website")}</label>
                <input
                  className={inputClassName}
                  value={form.website}
                  onChange={(event) => updateField("website", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("common.labels.phone")}</label>
                <input
                  className={inputClassName}
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("common.labels.email")}</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("common.labels.address")}</label>
                <input
                  className={inputClassName}
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("common.labels.termsAndConditions")}</label>
                <textarea
                  className={textareaClassName}
                  value={form.termsAndConditions}
                  onChange={(event) => updateField("termsAndConditions", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h2 className="app-section-heading">
                {t("pages.settings.emailDelivery")}
              </h2>

              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${emailDeliveryStatusClassName}`}>
                {emailDeliveryStatusLabel}
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t("pages.settings.emailDeliveryDescription")}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {emailDeliveryStatusHelp}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.resendApiKey")}</label>
                <input
                  type="password"
                  className={inputClassName}
                  value={form.resendApiKey}
                  onChange={(event) => updateField("resendApiKey", event.target.value)}
                  placeholder={companySettings?.hasResendApiKeyConfigured ? t("pages.settings.apiKeyConfiguredPlaceholder") : "re_..."}
                  autoComplete="new-password"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {companySettings?.hasResendApiKeyConfigured
                    ? t("pages.settings.apiKeyConfiguredHelp")
                    : t("pages.settings.apiKeyMissingHelp")}
                </p>
              </div>

              <div className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <input
                  id="clearResendApiKey"
                  type="checkbox"
                  checked={form.clearResendApiKey}
                  onChange={(event) => updateField("clearResendApiKey", event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
                <label htmlFor="clearResendApiKey" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("pages.settings.clearResendApiKey")}
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.resendSenderEmail")}</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={form.resendSenderEmail}
                  onChange={(event) => updateField("resendSenderEmail", event.target.value)}
                  placeholder="noreply@tu-dominio.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.resendSenderName")}</label>
                <input
                  className={inputClassName}
                  value={form.resendSenderName}
                  onChange={(event) => updateField("resendSenderName", event.target.value)}
                  placeholder={t("common.defaults.companyName")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.resendReplyToEmail")}</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={form.resendReplyToEmail}
                  onChange={(event) => updateField("resendReplyToEmail", event.target.value)}
                  placeholder="soporte@tu-dominio.com"
                />
              </div>
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.settings.brandingRules")}
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
            </div>
          </section>

          {feedback ? (
            <div className={feedback.type === "success" ? "app-feedback-success" : "app-feedback-error"}>
              {feedback.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSaving || !canEditRealCompanySettings}
            className="app-button-primary w-full"
          >
            {isSaving ? t("pages.settings.savingChanges") : t("pages.settings.saveSettings")}
          </button>
        </form>

        <div className="space-y-6">
          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.settings.logo")}
            </h2>

            <div className="flex flex-col items-center gap-4">
              {companySettings?.logoUrl ? (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
                  <img
                    src={companySettings.logoUrl}
                    alt={companySettings.displayName}
                    className="h-20 w-20 object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  {t("pages.settings.noLogo")}
                </div>
              )}

              <label className="app-button-secondary w-full cursor-pointer text-center">
                {isUploadingLogo ? t("pages.settings.uploading") : t("pages.settings.replaceLogo")}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(event) => void handleLogoChange(event)}
                  disabled={isUploadingLogo || !canEditRealCompanySettings}
                />
              </label>
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.settings.livePreview")}
            </h2>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div
                className="rounded-3xl p-4 text-white"
                style={{ backgroundColor: previewStyles.primaryColor }}
              >
                <div className="text-sm uppercase tracking-wide text-white/80">
                  {previewStyles.numberPreview}
                </div>

                <div className="mt-2 text-xl font-semibold">
                  {previewStyles.displayName}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div
                    className="rounded-2xl p-3 text-slate-900"
                    style={{ backgroundColor: previewStyles.secondaryColor }}
                  >
                    <div className="text-xs uppercase tracking-wide text-slate-600">
                      {t("common.finance.tax")}
                    </div>
                    <div className="mt-1 font-semibold">
                      {previewStyles.taxLabel} ({previewStyles.taxPercentage}%)
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-3 text-slate-900"
                    style={{ backgroundColor: previewStyles.accentColor }}
                  >
                    <div className="text-xs uppercase tracking-wide text-slate-600">
                      {t("common.finance.currency")}
                    </div>
                    <div className="mt-1 font-semibold">{previewStyles.currencySymbol}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
