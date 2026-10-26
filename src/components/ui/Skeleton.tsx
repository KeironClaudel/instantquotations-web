import type { CSSProperties } from "react";

export function Skeleton({ width, height = 16, className = "" }: { width?: CSSProperties["width"]; height?: CSSProperties["height"]; className?: string }) {
  return <span aria-hidden="true" className={`skeleton ${className}`} style={{ width, height }} />;
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  return <div aria-hidden="true">{Array.from({ length: count }, (_, index) => (
    <div className="skeleton-row" key={index}>
      <div className="skeleton-stack"><Skeleton width={`${65 + (index % 3) * 10}%`} height={18} /><Skeleton width="55%" height={12} /></div>
      <Skeleton width={76} height={26} className="skeleton-pill" />
    </div>
  ))}</div>;
}
