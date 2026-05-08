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
  const className =
    variant === "highlight"
      ? "rounded-3xl border border-slate-300 bg-slate-100 p-5 text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      : "rounded-3xl border border-slate-200 bg-white p-5 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80";

  return (
    <Link to={to} className={className}>
      <div className={`text-base font-semibold ${variant === "highlight" ? "text-slate-900 dark:text-slate-100" : "text-slate-900 dark:text-slate-100"}`}>
        {title}
      </div>
      <div className={`mt-2 text-sm leading-6 ${variant === "highlight" ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-400"}`}>
        {description}
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { companyName, isSetupComplete, userFirstName } = useDashboardPage();

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {t("pages.dashboard.badge")}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t("pages.dashboard.welcome", { name: userFirstName })}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          {t("pages.dashboard.description")}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {companyName}
          </span>

          <span
            className={`rounded-full px-3 py-1 font-medium ${
              isSetupComplete
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isSetupComplete
              ? t("components.appShell.setupComplete")
              : t("components.appShell.setupNeedsAttention")}
          </span>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {t("pages.dashboard.quickActions")}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
