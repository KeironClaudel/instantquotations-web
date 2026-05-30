import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDashboardPage } from "@/hooks/pages/dashboard/useDashboardPage";

function QuickAction({
  to,
  title,
  description,
  variant = "default",
}: {
  to: string;
  title: string;
  description: string;
  variant?: "default" | "highlight";
}) {
  const { t } = useTranslation();
  const className =
    variant === "highlight"
      ? "app-card flex min-h-[184px] flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(23,59,122,0.18)] sm:p-6"
      : "app-card-soft flex min-h-[184px] flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:bg-white/80 sm:p-6";

  return (
    <Link to={to} className={className}>
      <div>
        <div className="app-kicker">
          {variant === "highlight" ? "PWA" : t("components.appShell.workspace")}
        </div>
        <div className="mt-6 text-lg font-extrabold tracking-[-0.02em] text-[var(--ip-text)]">
          {title}
        </div>
        <div className="mt-2 text-sm leading-7 text-[var(--ip-text-soft)]">
          {description}
        </div>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ip-primary)]">
        <span>{title}</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { companyName, isSetupComplete, userFirstName } = useDashboardPage();

  return (
    <div className="space-y-7">
      <section className="app-card-hero p-6 sm:p-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.9fr)] xl:items-start">
          <div>
            <div className="app-page-badge">{t("pages.dashboard.badge")}</div>

            <h1 className="app-page-title mt-4">
              {t("pages.dashboard.welcome", { name: userFirstName })}
            </h1>

            <p className="app-page-copy">{t("pages.dashboard.description")}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/app/proforms/new" className="app-button-primary">
                {t("pages.dashboard.createNewProform")}
              </Link>
              <Link to="/app/proforms" className="app-button-secondary">
                {t("pages.dashboard.showPreviousProforms")}
              </Link>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              <div className="app-stat">
                <div className="app-stat-label">{t("components.appShell.workspace")}</div>
                <div className="app-stat-value break-words text-[1.08rem]">{companyName}</div>
              </div>

              <div className="app-stat">
                <div className="app-stat-label">{t("common.labels.status")}</div>
                <div className="mt-3">
                  <span className={isSetupComplete ? "app-chip app-chip-success" : "app-chip app-chip-warning"}>
                    {isSetupComplete
                      ? t("components.appShell.setupComplete")
                      : t("components.appShell.setupNeedsAttention")}
                  </span>
                </div>
              </div>

              <div className="app-stat bg-[linear-gradient(135deg,var(--ip-primary-soft),transparent)]">
                <div className="app-stat-label">PWA</div>
                <div className="app-stat-value text-[1.08rem]">
                  {t("pages.dashboard.quickActions")}
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--ip-text-soft)]">
                  {t("pages.dashboard.quickActionsDescription")}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--ip-text-soft)]">
              <span className="app-chip">{companyName}</span>
              <span className="app-chip">{t("pages.dashboard.quickActions")}</span>
            </div>
          </div>

          <div className="app-card-inset p-5 sm:p-6">
            <div className="app-kicker">{t("components.appShell.workspace")}</div>
            <div className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[var(--ip-text)]">
              {companyName}
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--ip-text-soft)]">
              {t("pages.dashboard.quickActionsDescription")}
            </p>

            <div className="mt-5 space-y-3">
              <div className="app-card-soft p-4">
                <div className="app-kicker">{t("pages.dashboard.createNewProform")}</div>
                <div className="mt-2 text-sm leading-7 text-[var(--ip-text-soft)]">
                  {t("pages.dashboard.createNewProformDescription")}
                </div>
              </div>

              <div className="app-card-soft p-4">
                <div className="app-kicker">{t("pages.dashboard.showPreviousProforms")}</div>
                <div className="mt-2 text-sm leading-7 text-[var(--ip-text-soft)]">
                  {t("pages.dashboard.showPreviousProformsDescription")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-card p-6 sm:p-7">
        <div className="mb-5">
          <h2 className="app-section-heading">
            {t("pages.dashboard.quickActions")}
          </h2>
          <p className="app-section-copy">
            {t("pages.dashboard.quickActionsDescription")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <QuickAction
            to="/app/proforms/new"
            title={t("pages.dashboard.createNewProform")}
            description={t("pages.dashboard.createNewProformDescription")}
            variant="highlight"
          />

          <QuickAction
            to="/app/proforms"
            title={t("pages.dashboard.showPreviousProforms")}
            description={t("pages.dashboard.showPreviousProformsDescription")}
          />
        </div>
      </section>
    </div>
  );
}
