import Image from "next/image";
import Link from "next/link";

export function HeroBanner({
  image,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  compact = false,
}: {
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden ${compact ? "min-h-[320px]" : "min-h-[80vh]"}`}>
      <Image src={image} alt={title} fill priority className="object-cover" />
      <div className="hero-overlay absolute inset-0" />
      <div className="pattern-grid absolute inset-0 opacity-40" />
      <div className="container-shell relative flex min-h-[inherit] items-center py-24">
        <div className="max-w-3xl text-white">
          <div className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-[var(--orange-soft)]">Smyle Explores</div>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">{title}</h1>
          {subtitle ? <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">{subtitle}</p> : null}
          {ctaLabel && ctaHref ? (
            <Link href={ctaHref} className="mt-10 inline-flex rounded-full bg-[var(--orange)] px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[var(--forest)]">
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
