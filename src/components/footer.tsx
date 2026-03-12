import Link from "next/link";

import { Icon, LogoMark } from "@/components/icons";
import { navigation, siteSettings } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-[var(--forest-deep)] py-14 text-[var(--cream)]">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <div className="text-xl font-extrabold">{siteSettings.siteName}</div>
              <div className="text-sm text-white/70">{siteSettings.tagline}</div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/75">{siteSettings.mission}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">Navigation</h3>
          <div className="mt-4 flex flex-col gap-3">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm transition hover:text-[var(--orange)]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p>{siteSettings.address}</p>
            <p>{siteSettings.email}</p>
            <p>{siteSettings.phone}</p>
            <div className="flex gap-3 pt-2">
              <Link href={siteSettings.socialLinks.instagram} className="rounded-full border border-white/20 p-2 transition hover:border-[var(--orange)] hover:text-[var(--orange)]" aria-label="Instagram">
                <Icon name="instagram" className="h-4 w-4" />
              </Link>
              <Link href={siteSettings.socialLinks.facebook} className="rounded-full border border-white/20 p-2 transition hover:border-[var(--orange)] hover:text-[var(--orange)]" aria-label="Facebook">
                <Icon name="facebook" className="h-4 w-4" />
              </Link>
              <Link href={siteSettings.socialLinks.whatsapp} className="rounded-full border border-white/20 p-2 transition hover:border-[var(--orange)] hover:text-[var(--orange)]" aria-label="WhatsApp">
                <Icon name="whatsapp" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container-shell mt-10 border-t border-white/10 pt-6 text-sm text-white/55">© 2025 Smyle Explores. All Rights Reserved.</div>
    </footer>
  );
}
