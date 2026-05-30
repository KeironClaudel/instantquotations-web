type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="app-section-heading">{title}</h2>
      {description ? (
        <p className="app-section-copy">{description}</p>
      ) : null}
    </div>
  );
}
