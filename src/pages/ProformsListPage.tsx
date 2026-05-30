import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatMoneyAmount } from "@/lib/utils/numberFormat";
import { getProformCurrencySymbol } from "@/lib/utils/proformCurrency";
import { getProformStatusBadgeClassName, getProformStatusLabel } from "@/lib/utils/proformStatus";
import { useProformsListPage } from "@/hooks/pages/proforms/useProformsListPage";

function formatDate(value: string, locale: string): string {
  const date = new Date(value);

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatPercent(value: number | null | undefined): string {
  return `${value ?? 0}%`;
}

export function ProformsListPage() {
  const { i18n, t } = useTranslation();
  const {
    clearFilters,
    clientFilter,
    currentPage,
    companySettings,
    endItem,
    feedback,
    filteredProforms,
    fromDateFilter,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
    isLoading,
    isOnFirstPage,
    isOnLastPage,
    proforms,
    pageSize,
    pageSizeOptions,
    setClientFilter,
    setFromDateFilter,
    setPageSize,
    setStatusFilter,
    setToDateFilter,
    startItem,
    statusFilter,
    statusOptions,
    toDateFilter,
    todayDateValue,
    totalCount,
    totalPages,
  } = useProformsListPage();

  if (isLoading) {
    return <PageLoader message={t("pages.proformsList.loading")} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-1 sm:px-0">
      <div className="app-page-head">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="app-page-badge">{t("pages.newProform.badge")}</div>
            <div className="mt-3">
              <SectionHeader
                title={t("pages.proformsList.title")}
                description={t("pages.proformsList.description")}
              />
            </div>
          </div>

          <Link to="/app/proforms/new" className="app-button-primary">
            {t("pages.dashboard.createNewProform")}
          </Link>
        </div>
      </div>

      {feedback ? <div className="app-feedback-error mb-6">{feedback.message}</div> : null}

      <section className="app-card mb-6 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="app-section-heading">{t("pages.proformsList.filterTitle")}</h2>
              <p className="app-section-copy">{t("pages.proformsList.filterDescription")}</p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="app-button-secondary"
            >
              {t("common.actions.clearFilters")}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <label className="app-label">{t("pages.proformsList.clientName")}</label>
              <input
                type="text"
                value={clientFilter}
                onChange={(event) => setClientFilter(event.target.value)}
                placeholder={t("pages.proformsList.searchByClient")}
                className="app-input"
              />
            </div>

            <div>
              <label className="app-label">{t("common.labels.status")}</label>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as (typeof statusOptions)[number])
                }
                className="app-input"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getProformStatusLabel(status, t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:col-span-1 xl:grid-cols-2">
              <div>
                <label className="app-label">{t("pages.proformsList.from")}</label>
                <input
                  type="date"
                  value={fromDateFilter}
                  max={toDateFilter || undefined}
                  onChange={(event) => setFromDateFilter(event.target.value)}
                  className="app-input"
                />
              </div>

              <div>
                <label className="app-label">{t("pages.proformsList.to")}</label>
                <input
                  type="date"
                  value={toDateFilter}
                  min={fromDateFilter || undefined}
                  max={todayDateValue}
                  onChange={(event) => setToDateFilter(event.target.value)}
                  className="app-input"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="app-chip app-chip-strong">
              {t("pages.proformsList.pageOf", { page: currentPage, totalPages })}
            </span>
            <span className="app-chip">
              {t("pages.proformsList.paginationSummary", {
                start: startItem,
                end: endItem,
                total: totalCount,
              })}
            </span>
          </div>
        </div>
      </section>

      {!hasActiveFilters && proforms.length === 0 ? (
        <EmptyState
          title={t("pages.proformsList.noProformsTitle")}
          description={t("pages.proformsList.noProformsDescription")}
          action={
            <Link to="/app/proforms/new" className="app-button-primary">
              {t("common.actions.createFirst")}
            </Link>
          }
        />
      ) : filteredProforms.length === 0 ? (
        <EmptyState
          title={t("pages.proformsList.noMatchesTitle")}
          description={t("pages.proformsList.noMatchesDescription")}
          action={
            <button type="button" onClick={clearFilters} className="app-button-primary">
              {t("common.actions.resetFilters")}
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          <section className="app-card flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--ip-text-soft)]">
              {t("pages.proformsList.paginationSummary", {
                start: startItem,
                end: endItem,
                total: totalCount,
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm text-[var(--ip-text-soft)]">
                <span>{t("pages.proformsList.perPage")}</span>
                <select
                  value={pageSize}
                  onChange={(event) =>
                    setPageSize(Number(event.target.value) as (typeof pageSizeOptions)[number])
                  }
                  className="app-input min-h-0 py-2"
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={isOnFirstPage}
                  className="app-button-secondary"
                >
                  {t("pages.proformsList.previous")}
                </button>

                <span className="min-w-[110px] text-center text-sm text-[var(--ip-text-soft)]">
                  {t("pages.proformsList.pageOf", { page: currentPage, totalPages })}
                </span>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={isOnLastPage}
                  className="app-button-secondary"
                >
                  {t("pages.proformsList.next")}
                </button>
              </div>
            </div>
          </section>

          {filteredProforms.map((proform) => {
            const currencySymbol = getProformCurrencySymbol(proform.currency);

            return (
              <Link
                key={proform.id}
                to={`/app/proforms/${proform.id}`}
                className="app-card block p-5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(23,59,122,0.16)] sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="app-kicker">{t("pages.proformsList.title")}</div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        {proform.number}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getProformStatusBadgeClassName(proform.status)}`}
                      >
                        {getProformStatusLabel(proform.status, t)}
                      </span>

                      <span className="app-chip">
                        {formatDate(
                          proform.issuedAtUtc,
                          i18n.resolvedLanguage?.startsWith("es") ? "es-CR" : "en-US",
                        )}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      {t("pages.proformsList.clientPrefix")}{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {proform.clientName}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>{proform.clientEmail || t("common.defaults.noEmail")}</span>
                      <span>{proform.clientPhone || t("common.defaults.noPhone")}</span>
                    </div>
                  </div>

                  <div className="app-card-inset grid min-w-[220px] gap-2 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("common.finance.subtotal")}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {currencySymbol}
                        {formatMoneyAmount(proform.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        {companySettings?.taxLabel ?? t("common.defaults.taxLabel")} (
                        {formatPercent(proform.taxPercentage)})
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {currencySymbol}
                        {formatMoneyAmount(proform.taxAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-300 pt-2 text-base font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                      <span>{t("common.finance.total")}</span>
                      <span>
                        {currencySymbol}
                        {formatMoneyAmount(proform.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
