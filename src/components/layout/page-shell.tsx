type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <section className="mb-10 max-w-3xl">
        {eyebrow ? <p className="mb-3 text-xs uppercase tracking-[0.32em] text-clay">{eyebrow}</p> : null}
        <h1 className="font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">{title}</h1>
        {description ? <p className="mt-5 text-lg leading-8 text-muted-ink">{description}</p> : null}
      </section>
      {children}
    </main>
  );
}
