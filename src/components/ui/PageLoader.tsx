import { useTranslation } from "react-i18next";

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="app-card flex min-w-[220px] flex-col items-center gap-3 px-6 py-7 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-[var(--ip-primary-soft)]">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/35 border-t-[var(--ip-primary)] dark:border-slate-900/20 dark:border-t-white" />
        </div>
        <p className="text-sm font-medium text-[var(--ip-text-soft)]">
          {message === "Loading..." ? t("components.pageLoader.loading") : message}
        </p>
      </div>
    </div>
  );
}
