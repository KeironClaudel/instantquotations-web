import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="app-empty px-5 py-10 text-center sm:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[var(--ip-primary-soft)] text-[var(--ip-primary)] shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4.5" y="5.5" width="15" height="13" rx="2.5" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-extrabold tracking-[-0.02em] text-[var(--ip-text)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[var(--ip-text-soft)]">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
