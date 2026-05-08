import { useTranslation } from "react-i18next";

const languageOptions = [
  { code: "es", labelKey: "components.languageSwitcher.spanish", shortLabel: "ES" },
  { code: "en", labelKey: "components.languageSwitcher.english", shortLabel: "EN" },
] as const;

type LanguageSwitcherProps = {
  compact?: boolean;
};

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  return (
    <div className="inline-flex shrink-0 rounded-xl border border-slate-300 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {languageOptions.map((option) => {
        const isActive = i18n.resolvedLanguage?.startsWith(option.code) ?? i18n.language.startsWith(option.code);

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => void i18n.changeLanguage(option.code)}
            className={[
              compact
                ? "w-11 rounded-lg px-0 py-1.5 text-sm font-medium transition text-center"
                : "min-w-24 rounded-lg px-3 py-1.5 text-sm font-medium transition text-center",
              isActive
                ? "bg-slate-100 text-slate-900 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
            ].join(" ")}
            title={t(option.labelKey)}
            aria-label={t(option.labelKey)}
          >
            {compact ? option.shortLabel : t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
