import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOnboardingCompanyPage } from "@/hooks/pages/company/useOnboardingCompanyPage";

export function OnboardingCompanyPage() {
  const { t } = useTranslation();
  const {
    currencySymbol,
    displayName,
    feedback,
    handleLogoChange,
    handleSubmit,
    isSubmitting,
    preview,
    setCurrencySymbol,
    setDisplayName,
    setTaxLabel,
    setTaxPercentage,
    shouldRedirect,
    taxLabel,
    taxPercentage,
  } = useOnboardingCompanyPage();

  const inputClassName =
    "app-input";

  if (shouldRedirect) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="app-page-head text-center">
        <div className="app-page-badge">
          {t("pages.onboardingCompany.badge")}
        </div>

        <h1 className="app-page-title mt-3">
          {t("pages.onboardingCompany.title")}
        </h1>

        <p className="app-page-copy mx-auto">
          {t("pages.onboardingCompany.description")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          className="app-card space-y-6 p-5 sm:p-6"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="app-section-heading">
              {t("pages.onboardingCompany.businessEssentials")}
            </h2>
            <p className="app-section-copy">
              {t("pages.onboardingCompany.businessEssentialsDescription")}
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="app-label">{t("common.labels.displayName")}</label>
              <input
                className={inputClassName}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Ecotech CR"
                required
              />
            </div>

            <div>
              <label className="app-label">{t("pages.onboardingCompany.taxPercentage")}</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                className={inputClassName}
                value={taxPercentage}
                onChange={(event) => setTaxPercentage(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="app-label">{t("pages.onboardingCompany.currencySymbol")}</label>
              <input
                className={inputClassName}
                value={currencySymbol}
                onChange={(event) => setCurrencySymbol(event.target.value)}
                placeholder="₡"
                required
              />
            </div>

            <div>
              <label className="app-label">{t("pages.onboardingCompany.taxLabel")}</label>
              <input
                className={inputClassName}
                value={taxLabel}
                onChange={(event) => setTaxLabel(event.target.value)}
                placeholder={t("common.defaults.taxLabel")}
              />
            </div>

            <div>
              <label className="app-label">{t("pages.onboardingCompany.logoOptional")}</label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                className={inputClassName}
                onChange={handleLogoChange}
              />
            </div>
          </div>

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
            {isSubmitting ? t("pages.onboardingCompany.savingSetup") : t("pages.onboardingCompany.continueToProforms")}
          </button>
        </form>

        <section className="app-card p-5 sm:p-6">
          <h2 className="app-section-heading">
            {t("pages.onboardingCompany.livePreview")}
          </h2>

          <p className="app-section-copy">
            {t("pages.onboardingCompany.livePreviewDescription")}
          </p>

          <div className="mt-5 rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
            <div className="rounded-3xl bg-slate-900 p-5 text-white">
              <div className="text-xs uppercase tracking-wide text-white/70">
                {preview.numberPreview}
              </div>

              <div className="mt-2 text-2xl font-semibold">{preview.displayName}</div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-white/70">
                    {t("common.finance.tax")}
                  </div>
                  <div className="mt-1 font-medium">
                    {preview.taxLabel} ({preview.tax}%)
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-white/70">
                    {t("common.finance.currency")}
                  </div>
                  <div className="mt-1 font-medium">{preview.currency}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
