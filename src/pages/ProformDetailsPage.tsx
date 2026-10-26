import { useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/PageLoader";
import { formatMoneyAmount } from "@/lib/utils/numberFormat";
import { getClientIdentificationTypeLabel } from "@/lib/utils/proformCurrency";
import { getProformStatusBadgeClassName, getProformStatusLabel } from "@/lib/utils/proformStatus";
import { useProformDetailsPage } from "@/hooks/pages/proforms/useProformDetailsPage";

type DetailTab = "information" | "products" | "service" | "conditions";

function TextCard({ title, value }: { title: string; value: string | null | undefined }) {
  const { t } = useTranslation();
  return <section className="quote-card app-card">
    <h2 className="quote-card-title"><span className="quote-card-icon"><Icon name="document" /></span>{title}</h2>
    <div className="quote-prose">{value || t("common.defaults.notProvided")}</div>
  </section>;
}

export function ProformDetailsPage() {
  const { i18n, t } = useTranslation();
  const es = i18n.resolvedLanguage?.startsWith("es");
  const [activeTab, setActiveTab] = useState<DetailTab>("information");
  const tabs: { id: DetailTab; label: string }[] = [
    { id: "information", label: es ? "Información" : "Information" },
    { id: "products", label: es ? "Productos" : "Products" },
    { id: "service", label: es ? "Servicio" : "Service" },
    { id: "conditions", label: es ? "Condiciones" : "Conditions" },
  ];
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
      : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length
      : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    const tab = tabs[next];
    if (tab) {
      setActiveTab(tab.id);
      document.getElementById(`quote-tab-${tab.id}`)?.focus();
    }
  }
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
    return <PageLoader variant="details" message={t("pages.proformDetails.loading")} />;
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

  const badge = <span className={`quote-status ${getProformStatusBadgeClassName(proform.status)}`}>{getProformStatusLabel(proform.status, t)}</span>;

  return (
    <div className="quote-detail">
      <header className="quote-heading">
        <Link to="/app/proforms" className="quote-back" aria-label={t("common.actions.back")}>←</Link>
        <div><div className="quote-heading-title"><h1>{proform.number}</h1>{badge}</div>
          <p>{t("pages.proformDetails.createdOn", { clientName: proform.clientName, date: issuedAtLabel })}</p>
        </div>
      </header>
      <div className="quote-actions">
        <button type="button" onClick={() => void handleDownloadPdf()} disabled={isDownloading} aria-label={t("pages.proformDetails.downloadPdf")}><Icon name="document" /><span>{isDownloading ? t("pages.proformDetails.downloading") : "PDF"}</span></button>
        <button type="button" onClick={() => void handleShare()} disabled={isSharing}><Icon name="share" /><span>{isSharing ? t("pages.proformDetails.sharing") : t("pages.proformDetails.share")}</span></button>
        <button type="button" onClick={() => void handleSendToClientEmail()} disabled={isSendingToClientEmail || !proform.clientEmail} title={!proform.clientEmail ? t("pages.proformDetails.feedback.missingClientEmail") : undefined}><Icon name="send" /><span>{isSendingToClientEmail ? t("pages.proformDetails.sending") : es ? "Enviar al cliente" : "Send to client"}</span></button>
      </div>
      {feedback ? <div role="status" className={feedback.type === "success" ? "app-feedback-success mb-4" : "app-feedback-error mb-4"}>{feedback.message}</div> : null}
      <div className="quote-tabs" role="tablist" aria-label={es ? "Detalle de cotización" : "Quotation details"}>
        {tabs.map((tab, index) => <button key={tab.id} id={`quote-tab-${tab.id}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`quote-panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)} onKeyDown={event => navigateTabs(event, index)}>{tab.label}</button>)}
      </div>
      <div id="quote-panel-information" role="tabpanel" aria-labelledby="quote-tab-information" hidden={activeTab !== "information"} tabIndex={0}>
        <div className="quote-overview">
          <section className="quote-card app-card quote-client">
            <h2 className="quote-card-title"><span className="quote-card-icon"><Icon name="clients" /></span>{t("pages.proformDetails.clientInformation")}</h2>
            <dl className="quote-client-fields">
              <div><dt>{t("common.labels.client")}</dt><dd>{proform.clientName}</dd></div>
              <div><dt>{t("common.labels.status")}</dt><dd>{badge}</dd></div>
              <div><dt>{t("common.labels.email")}</dt><dd>{proform.clientEmail || t("common.defaults.notProvided")}</dd></div>
              <div><dt>{t("common.labels.phone")}</dt><dd>{proform.clientPhone || t("common.defaults.notProvided")}</dd></div>
              <div><dt>{t("pages.proformDetails.identification")}</dt><dd>{proform.clientIdentificationNumber ? `${getClientIdentificationTypeLabel(proform.clientIdentificationType, es ? "es" : "en")} · ${proform.clientIdentificationNumber}` : t("common.defaults.notProvided")}</dd></div>
              <div><dt>{t("pages.proformDetails.location")}</dt><dd>{proform.location || proform.notes || t("common.defaults.notProvided")}</dd></div>
            </dl>
          </section>
          <section className="quote-card app-card quote-financial">
            <h2 className="quote-card-title"><span className="quote-card-icon"><Icon name="wallet" /></span>{t("pages.proformDetails.financialSummary")}</h2>
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
          <div className="quote-notes"><TextCard title={t("pages.proformDetails.internalNotes")} value={proform.internalNotes} /></div>
          <details className="app-card detail-disclosure quote-status-editor">
            <summary className="filters-toggle"><span>{t("pages.proformDetails.updateStatus")}</span><span className="filters-chevron" aria-hidden="true">⌄</span></summary>
            <div className="p-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <label htmlFor="quotation-status" className="app-label">{t("common.labels.status")}</label>
                <select id="quotation-status"
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
            </div>
          </details>
        </div>
      </div>
      <div id="quote-panel-products" role="tabpanel" aria-labelledby="quote-tab-products" hidden={activeTab !== "products"} tabIndex={0}>
        <section className="quote-card app-card">
          <h2 className="quote-card-title"><span className="quote-card-icon"><Icon name="document" /></span>{t("pages.proformDetails.items")} <span className="quote-item-count">{proform.items.length}</span></h2>
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
      <div id="quote-panel-service" role="tabpanel" aria-labelledby="quote-tab-service" hidden={activeTab !== "service"} tabIndex={0}>
        <div className="quote-text-grid"><TextCard title={t("pages.newProform.serviceDescription")} value={proform.serviceDescription} /><TextCard title={t("pages.newProform.scopeOfWork")} value={proform.scopeOfWork} /></div>
      </div>
      <div id="quote-panel-conditions" role="tabpanel" aria-labelledby="quote-tab-conditions" hidden={activeTab !== "conditions"} tabIndex={0}>
        <div className="quote-text-grid"><TextCard title={t("pages.newProform.serviceConditions")} value={proform.serviceConditions} /><TextCard title={t("pages.newProform.paymentConditions")} value={proform.paymentConditions} /></div>
      </div>
    </div>
  );
}
