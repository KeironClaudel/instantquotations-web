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
  const activeIndex = languageOptions.findIndex((option) =>
    i18n.resolvedLanguage?.startsWith(option.code) ?? i18n.language.startsWith(option.code),
  );

  return (
    <div
      className={[
        "relative inline-grid shrink-0 grid-cols-2 rounded-2xl border border-[var(--ip-border)] bg-[var(--ip-surface-strong)] p-1 shadow-sm backdrop-blur transition-all duration-300 ease-out",
        compact ? "w-[5.9rem]" : "w-[12.5rem]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-y-1 z-0 rounded-xl transition-all duration-300 ease-out",
          "bg-slate-950 shadow-sm dark:bg-white",
        ].join(" ")}
        style={{
          width: "calc(50% - 0.25rem)",
          left: "0.25rem",
          transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
        }}
      />

      {languageOptions.map((option) => {
        const isActive =
          i18n.resolvedLanguage?.startsWith(option.code) ?? i18n.language.startsWith(option.code);

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => void i18n.changeLanguage(option.code)}
            className={[
              "relative z-10",
              compact
                ? "rounded-xl px-0 py-1.5 text-sm font-bold text-center transition-all duration-300 ease-out"
                : "rounded-xl px-3 py-1.5 text-sm font-bold text-center transition-all duration-300 ease-out",
              isActive
                ? "translate-y-0 scale-100 text-white dark:text-slate-950"
                : "translate-y-0 scale-[0.98] text-[var(--ip-text-soft)] hover:bg-[var(--ip-primary-soft)] hover:text-[var(--ip-primary)] hover:scale-100 dark:hover:text-white",
            ].join(" ")}
            title={t(option.labelKey)}
            aria-label={t(option.labelKey)}
          >
            <span
              className={[
                "inline-flex transition-all duration-300 ease-out",
                isActive ? "opacity-100" : "opacity-88",
              ].join(" ")}
            >
              {compact ? option.shortLabel : t(option.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
