import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { isCompanySetupComplete } from "@/lib/utils/companySetup";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Icon } from "@/components/ui/Icon";

export function AppShell() {
  const { t } = useTranslation();
  const { companySettings, companySettingsSource, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const setupComplete = companySettingsSource === "remote" && isCompanySetupComplete(companySettings);
  const links = [
    { to: "/app", key: "dashboard", icon: "dashboard" as const, end: true },
    { to: "/app/proforms", key: "proforms", icon: "document" as const, end: false },
    { to: "/app/clients", key: "clients", icon: "clients" as const, end: false },
    { to: "/app/settings", key: "settings", icon: "settings" as const, end: false },
  ];
  return (
    <div className="app-shell">
      <header className="app-topbar workspace-header">
        <div className="workspace-header-inner">
          <Link to="/app" className="brand-lockup">
            <span className="brand-mark">{companySettings.logoUrl ? <img src={companySettings.logoUrl} alt="" /> : <Icon name="document" />}</span>
            <span>InstantQuotations</span>
          </Link>
          <nav className="desktop-navigation" aria-label={t("components.appShell.workspace")}>
            {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `workspace-nav-link ${isActive ? "is-active" : ""}`}>{t(`components.appShell.${link.key}`)}</NavLink>)}
          </nav>
          <div className="workspace-tools">
            <div className="desktop-utilities"><LanguageSwitcher compact /><ThemeSwitcher compact /></div>
            <button type="button" className="profile-button" aria-label={t("components.appShell.settings")} aria-expanded={menuOpen} aria-controls="workspace-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <Icon name="close" /> : (user?.fullName?.slice(0, 1).toUpperCase() || <Icon name="clients" />)}</button>
          </div>
        </div>
        {menuOpen ? <div id="workspace-menu" className="workspace-menu app-card" onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}>
          <strong>{user?.fullName}</strong><p className="app-section-copy">{companySettings.displayName}</p>
          <div className="flex gap-2 my-4"><LanguageSwitcher compact /><ThemeSwitcher compact /></div>
          {!setupComplete ? <Link className="app-button-secondary" to="/app/onboarding/company" onClick={() => setMenuOpen(false)}>{t("components.appShell.completeSetup")}</Link> : null}
          {user?.isPlatformAdmin ? <Link className="app-button-secondary" to="/app/admin/companies/new" onClick={() => setMenuOpen(false)}>{t("components.appShell.registerCompany")}</Link> : null}
          <button className="app-button-secondary" onClick={() => void logout()}>{t("components.appShell.logout")}</button>
        </div> : null}
      </header>
      <main className="app-main"><Outlet /></main>
      <nav className="mobile-navigation" aria-label={t("components.appShell.workspace")}>
        {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? "is-active" : ""}`}><Icon name={link.icon} /><span>{t(`components.appShell.${link.key}`)}</span></NavLink>)}
      </nav>
    </div>
  );
}
