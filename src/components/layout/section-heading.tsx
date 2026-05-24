type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-2 text-xs uppercase tracking-[0.26em] text-clay">{eyebrow}</p> : null}
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}
