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
    "w-full rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800";

  const textareaClassName =
    "min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        {!isAdminMode ? (
          <div className="mb-4 flex justify-end gap-2">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>
        ) : null}

        <div className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {isAdminMode ? t("pages.adminCompanyRegistration.badge") : t("pages.register.badge")}
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {isAdminMode ? t("pages.adminCompanyRegistration.title") : t("pages.register.title")}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {isAdminMode ? t("pages.adminCompanyRegistration.description") : t("pages.register.description")}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
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

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
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

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {t("pages.register.brandingAndTax")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.primaryColor")}</label>
                <input
                  type="color"
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"
                  value={form.primaryColor}
                  onChange={(event) => updateField("primaryColor", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.secondaryColor")}</label>
                <input
                  type="color"
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"
                  value={form.secondaryColor}
                  onChange={(event) => updateField("secondaryColor", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("pages.settings.accentColor")}</label>
                <input
                  type="color"
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"
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

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
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
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {isSubmitting ? t("pages.register.creatingWorkspace") : t("pages.register.createWorkspace")}
          </button>

          {!isAdminMode ? (
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              {t("pages.register.alreadyHaveAccount")}{" "}
              <Link to="/login" className="font-medium text-slate-900 underline dark:text-slate-100">
                {t("pages.register.signIn")}
              </Link>
            </div>
          ) : null}
        </form>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {t("pages.register.livePreview")}
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
