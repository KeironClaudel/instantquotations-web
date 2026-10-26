import { useTranslation } from "react-i18next";
import { Skeleton, SkeletonRows } from "@/components/ui/Skeleton";

type LoaderVariant = "workspace" | "clients" | "details" | "settings";

function Fields({ count = 6 }: { count?: number }) {
  return <div className="skeleton-fields">{Array.from({ length: count }, (_, index) => <div className="skeleton-stack" key={index}><Skeleton width="48%" height={12} /><Skeleton height={40} /></div>)}</div>;
}

export function PageLoader({ message, variant = "workspace" }: { message?: string; variant?: LoaderVariant }) {
  const { t } = useTranslation();
  return (
    <div className={`page-skeleton page-skeleton-${variant}`}>
      <span role="status" className="sr-only">{message || t("components.pageLoader.loading")}</span>
      <div aria-hidden="true" aria-busy="true">
        {variant === "workspace" ? <div className="skeleton-workspace-header"><Skeleton width={40} height={40} /><Skeleton width={170} height={20} /><Skeleton width={44} height={44} className="skeleton-avatar" /></div> : null}
        <div className="skeleton-page-heading"><div className="skeleton-stack"><Skeleton width={180} height={30} /><Skeleton width="85%" height={14} /></div><Skeleton width={120} height={44} /></div>
        {variant === "details" ? <>
          <div className="skeleton-actions">{[0, 1, 2].map(key => <Skeleton key={key} height={80} />)}</div>
          <div className="skeleton-tabs">{[0, 1, 2, 3].map(key => <Skeleton key={key} height={40} />)}</div>
          <div className="skeleton-detail-grid">
            <div className="app-card skeleton-card"><Skeleton width="70%" height={22} /><Fields /></div>
            <div className="app-card skeleton-card"><Skeleton width="65%" height={22} /><SkeletonRows count={3} /></div>
            <div className="app-card skeleton-card"><Skeleton width="50%" height={22} /><div className="skeleton-stack"><Skeleton /><Skeleton width="90%" /><Skeleton width="75%" /></div></div>
          </div>
        </> : variant === "clients" ? <div className="app-card skeleton-card"><Skeleton width={140} height={20} /><Skeleton height={50} /><SkeletonRows count={5} /></div>
          : variant === "settings" ? <div className="skeleton-detail-grid"><div className="app-card skeleton-card"><Skeleton width="60%" height={22} /><Fields count={8} /></div><div className="app-card skeleton-card"><Skeleton width="55%" height={22} /><Skeleton height={240} /></div></div>
          : <><div className="dashboard-stats">{[0, 1, 2].map(key => <div key={key} className="app-card skeleton-stat"><Skeleton width={58} height={58} className="skeleton-avatar" /><div className="skeleton-stack"><Skeleton width={60} height={28} /><Skeleton width={110} /></div></div>)}</div><div className="app-card skeleton-card"><Skeleton width={200} height={22} /><SkeletonRows count={5} /></div></>}
      </div>
    </div>
  );
}
