"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { navigation, siteSettings } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-edited.png"
            alt={`${siteSettings.siteName} logo`}
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
            priority
          />
          <div>
            <div className="text-lg font-extrabold text-[var(--forest)]">{siteSettings.siteName}</div>
            <div className="text-xs text-neutral-500">{siteSettings.tagline}</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-neutral-700 transition hover:text-[var(--forest)]">
              {item.label}
            </Link>
          ))}
          <Link href="/contact#quote" className="rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest)]">
            Request a Quote
          </Link>
        </nav>
        <button type="button" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold lg:hidden" onClick={() => setOpen((value) => !value)}>
          Menu
        </button>
      </div>
      {open ? (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <div className="container-shell flex flex-col gap-4 py-4">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-neutral-700" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact#quote" className="rounded-full bg-[var(--orange)] px-5 py-3 text-center text-sm font-bold text-white" onClick={() => setOpen(false)}>
              Request a Quote
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
