export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <div className={`text-sm font-bold uppercase tracking-[0.25em] ${light ? "text-white/70" : "text-[var(--orange)]"}`}>{eyebrow}</div>
      <h2 className={`mt-4 text-3xl font-black md:text-5xl ${light ? "text-white" : "text-[var(--charcoal)]"}`}>{title}</h2>
      {description ? <p className={`mt-4 text-base leading-8 ${light ? "text-white/80" : "text-neutral-600"}`}>{description}</p> : null}
    </div>
  );
}
