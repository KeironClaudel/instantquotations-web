import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProforms } from "@/lib/api/proformHistoryApi";
import { getClients } from "@/lib/api/clientApi";
import { getProformStatusBadgeClassName, getProformStatusLabel } from "@/lib/utils/proformStatus";
import { Skeleton, SkeletonRows } from "@/components/ui/Skeleton";
import { Icon } from "@/components/ui/Icon";
import type { ProformListItem } from "@/types/proformHistory";

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const es = i18n.resolvedLanguage?.startsWith("es");
  const [data, setData] = useState<{ recent: ProformListItem[]; total?: number; drafts?: number; clients?: number } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([getProforms({ page: 1, pageSize: 5 }), getProforms({ page: 1, pageSize: 1, status: "Draft" }), getClients()])
      .then(([recent, drafts, clients]) => { if (active) setData({ recent: recent.items, total: recent.totalCount, drafts: drafts.totalCount, clients: clients.length }); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);
  const stats = [
    { label: es ? "Total de cotizaciones" : "Total quotations", value: data?.total, icon: "document" as const, to: "/app/proforms" },
    { label: t("common.statuses.draft"), value: data?.drafts, icon: "clock" as const, to: "/app/proforms?status=Draft" },
    { label: t("components.appShell.clients"), value: data?.clients, icon: "clients" as const, to: "/app/clients" },
  ];
  return <div className="dashboard-page">
    <div className="dashboard-heading"><div><h1 className="app-page-title">Dashboard</h1><p className="app-page-copy">{es ? "Resumen de tu negocio" : "Your business at a glance"}</p></div><Link to="/app/proforms/new" className="app-button-primary"><Icon name="plus" />{t("components.appShell.newProform")}</Link></div>
    <div className="dashboard-stats" aria-busy={!data && !failed}>{stats.map(stat => <Link key={stat.to} to={stat.to} className="dashboard-stat app-card"><span className="stat-icon"><Icon name={stat.icon} /></span><div>{!data && !failed ? <Skeleton width={48} height={33} /> : <strong>{stat.value ?? "—"}</strong>}<span>{stat.label}</span></div><Icon name="arrow" /></Link>)}</div>
    <section className="app-card recent-card"><div className="recent-heading"><h2 className="app-section-heading">{es ? "Cotizaciones recientes" : "Recent quotations"}</h2><Link to="/app/proforms">{es ? "Ver todas" : "View all"}<Icon name="arrow" /></Link></div>
      {failed ? <p className="app-feedback-error" role="alert">{es ? "No se pudo cargar el resumen. Revisa las cotizaciones o vuelve a intentarlo recargando la página." : "Unable to load the overview. Open quotations or reload to try again."}</p> : !data ? <div><span className="sr-only" role="status">{t("components.pageLoader.loading")}</span><SkeletonRows count={5} /></div> : data.recent.length === 0 ? <div className="dashboard-empty"><Icon name="document" /><p>{es ? "Tus cotizaciones aparecerán aquí." : "Your quotations will appear here."}</p><Link className="app-button-secondary" to="/app/proforms/new">{t("components.appShell.newProform")}</Link></div> : data.recent.map(item => <Link className="recent-row" key={item.id} to={`/app/proforms/${item.id}`}><div><strong>{item.clientName}</strong><p>{item.number} · {new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: "medium" }).format(new Date(item.issuedAtUtc))}</p></div><span className={`status-pill ${getProformStatusBadgeClassName(item.status)}`}><i />{getProformStatusLabel(item.status, t)}</span><Icon name="arrow" /></Link>)}
    </section>
  </div>;
}
