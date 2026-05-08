type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      ) : null}
    </div>
  );
}
