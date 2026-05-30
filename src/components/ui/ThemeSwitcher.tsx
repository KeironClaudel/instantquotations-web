import { useTranslation } from "react-i18next";
import { useTheme } from "@/app/providers/useTheme";

type ThemeSwitcherProps = {
  compact?: boolean;
  showLabelWhenCompact?: boolean;
};

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23L5.46 5.46" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.2 15.6A8.75 8.75 0 0 1 8.4 3.8a9 9 0 1 0 11.8 11.8Z"
      />
    </svg>
  );
}

export function ThemeSwitcher({
  compact = false,
  showLabelWhenCompact = false,
}: ThemeSwitcherProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const shouldShowLabel = !compact || showLabelWhenCompact;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        "inline-flex shrink-0 items-center gap-2 rounded-2xl border p-1 transition-all duration-300 ease-out backdrop-blur",
        "border-[var(--ip-border)] bg-[var(--ip-surface-strong)] text-[var(--ip-text)] hover:bg-[var(--ip-primary-soft)]",
        compact ? "justify-center px-2.5 py-1.5" : "px-3 py-2",
      ].join(" ")}
      title={isDark ? t("components.themeSwitcher.switchToLight") : t("components.themeSwitcher.switchToDark")}
      aria-label={isDark ? t("components.themeSwitcher.switchToLight") : t("components.themeSwitcher.switchToDark")}
    >
      <span
        className={[
          "inline-flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ease-out",
          isDark
            ? "bg-white text-slate-950 shadow-sm"
            : "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950",
        ].join(" ")}
      >
        <span
          className={[
            "inline-flex transition-all duration-300 ease-out",
            isDark ? "translate-x-0 rotate-0 scale-100 opacity-100" : "translate-x-0 rotate-180 scale-95 opacity-100",
          ].join(" ")}
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </span>
      </span>

      {shouldShowLabel ? (
        <span
          className={[
            "text-sm font-medium transition-all duration-300 ease-out",
            isDark ? "translate-x-0 opacity-100" : "translate-x-0 opacity-100",
          ].join(" ")}
        >
          {isDark ? t("components.themeSwitcher.dark") : t("components.themeSwitcher.light")}
        </span>
      ) : null}
    </button>
  );
}
