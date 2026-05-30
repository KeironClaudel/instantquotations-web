import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatMoneyAmount } from "@/lib/utils/numberFormat";
import { getClientIdentificationTypeLabel } from "@/lib/utils/proformCurrency";
import { getProformStatusBadgeClassName, getProformStatusLabel } from "@/lib/utils/proformStatus";
import { useProformDetailsPage } from "@/hooks/pages/proforms/useProformDetailsPage";

function DetailTextSection({
  title,
  value,
}: {
  title: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
        {value}
      </div>
    </div>
  );
}

export function ProformDetailsPage() {
  const { i18n, t } = useTranslation();
  const {
    companySettings,
    currencySymbol,
    editableStatuses,
    feedback,
    handleDownloadPdf,
    handleSendToClientEmail,
    handleShare,
    handleUpdateStatus,
    isDownloading,
    isLoading,
    isSendingToClientEmail,
    isSharing,
    isUpdatingStatus,
    issuedAtLabel,
    proform,
    selectedStatus,
    setSelectedStatus,
  } = useProformDetailsPage();

  if (isLoading) {
    return <PageLoader message={t("pages.proformDetails.loading")} />;
  }

  if (!proform) {
    return (
      <EmptyState
        title={t("pages.proformDetails.proformNotFoundTitle")}
        description={t("pages.proformDetails.proformNotFoundDescription")}
        action={
          <Link
            to="/app/proforms"
            className="inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {t("pages.proformDetails.backToProforms")}
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-1 sm:px-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="app-page-head mb-0">
          <div className="app-page-badge">{t("pages.proformsList.title")}</div>
          <div className="mt-3">
            <SectionHeader
              title={proform.number}
              description={t("pages.proformDetails.createdOn", {
                clientName: proform.clientName,
                date: issuedAtLabel,
              })}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/app/proforms"
            className="app-button-secondary"
          >
            {t("common.actions.back")}
          </Link>

          <button
            type="button"
            onClick={() => void handleDownloadPdf()}
            disabled={isDownloading}
            className="app-button-primary"
          >
            {isDownloading ? t("pages.proformDetails.downloading") : t("pages.proformDetails.downloadPdf")}
          </button>

          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={isSharing}
            className="app-button-secondary"
          >
            {isSharing ? t("pages.proformDetails.sharing") : t("pages.proformDetails.share")}
          </button>

          <button
            type="button"
            onClick={() => void handleSendToClientEmail()}
            disabled={isSendingToClientEmail || !proform.clientEmail}
            className="app-button-secondary"
          >
            {isSendingToClientEmail ? t("pages.proformDetails.sending") : t("pages.proformDetails.sendToClientEmail")}
          </button>
        </div>
      </div>

      {feedback ? (
        <div
          className={`mb-6 rounded-2xl px-4 py-3.5 text-sm shadow-sm ${
            feedback.type === "success"
              ? "app-feedback-success"
              : "app-feedback-error"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.proformDetails.clientInformation")}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("common.labels.client")}</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{proform.clientName}</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("common.labels.status")}</div>
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getProformStatusBadgeClassName(proform.status)}`}
                  >
                    {getProformStatusLabel(proform.status, t)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("common.labels.email")}</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {proform.clientEmail || t("common.defaults.notProvided")}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("common.labels.phone")}</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      {proform.clientPhone || t("common.defaults.notProvided")}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("pages.proformDetails.identification")}
                </div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {proform.clientIdentificationNumber
                    ? `${getClientIdentificationTypeLabel(proform.clientIdentificationType, i18n.resolvedLanguage?.startsWith("es") ? "es" : "en")} · ${proform.clientIdentificationNumber}`
                    : t("common.defaults.notProvided")}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <DetailTextSection title={t("pages.proformDetails.location")} value={proform.location || proform.notes} />
              <DetailTextSection title={t("pages.proformDetails.internalNotes")} value={proform.internalNotes} />
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.proformDetails.updateStatus")}
            </h2>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <label className="app-label">{t("common.labels.status")}</label>
                <select
                  className="app-input"
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  disabled={isUpdatingStatus}
                >
                  {editableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getProformStatusLabel(status, t)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => void handleUpdateStatus()}
                disabled={isUpdatingStatus || selectedStatus === proform.status}
                className="app-button-primary"
              >
                {isUpdatingStatus ? t("pages.proformDetails.saving") : t("pages.proformDetails.saveStatus")}
              </button>
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.proformDetails.documentSections")}
            </h2>

            <div className="grid gap-4">
              <DetailTextSection title={t("pages.newProform.serviceDescription")} value={proform.serviceDescription} />
              <DetailTextSection title={t("pages.newProform.scopeOfWork")} value={proform.scopeOfWork} />
              <DetailTextSection title={t("pages.newProform.serviceConditions")} value={proform.serviceConditions} />
              <DetailTextSection title={t("pages.newProform.paymentConditions")} value={proform.paymentConditions} />
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.proformDetails.items")}
            </h2>

            <div className="space-y-3">
              {proform.items
                .slice()
                .sort((left, right) => left.sortOrder - right.sortOrder)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="grid gap-3 lg:grid-cols-[1.8fr_0.6fr_0.8fr_0.8fr]">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {t("common.labels.description")}
                        </div>
                        <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                          {item.description}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {t("common.labels.quantity")}
                        </div>
                        <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{item.quantity}</div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {t("common.finance.unitPrice")}
                        </div>
                        <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                          {currencySymbol}
                          {formatMoneyAmount(item.unitPrice)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {t("common.finance.total")}
                        </div>
                        <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                          {currencySymbol}
                          {formatMoneyAmount(item.total)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="app-card p-5 sm:p-6">
            <h2 className="mb-5 app-section-heading">
              {t("pages.proformDetails.financialSummary")}
            </h2>

            <div className="app-card-inset space-y-3 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{t("common.finance.subtotal")}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {currencySymbol}
                  {formatMoneyAmount(proform.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  {companySettings?.taxLabel ?? t("common.defaults.taxLabel")} ({proform.taxPercentage}%)
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {currencySymbol}
                  {formatMoneyAmount(proform.taxAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-300 pt-4 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                <span>{t("common.finance.total")}</span>
                <span>
                  {currencySymbol}
                  {formatMoneyAmount(proform.total)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
