import type { Metadata } from "next";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getNavigation, getSiteSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: settings.seo.defaultTitle || `${settings.siteName} | ${settings.tagline}`,
    description: settings.seo.defaultDescription || settings.mission,
    icons: {
      icon: settings.branding.logo,
      shortcut: settings.branding.logo,
      apple: settings.branding.logo,
    },
    openGraph: {
      title: settings.seo.defaultTitle || `${settings.siteName} | ${settings.tagline}`,
      description: settings.seo.defaultDescription || settings.mission,
      siteName: settings.siteName,
      type: "website",
      images: settings.seo.defaultImage ? [settings.seo.defaultImage] : undefined,
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [siteSettings, navigation] = await Promise.all([getSiteSettings(), getNavigation()]);

  return (
    <html lang="en">
      <body>
        <Header navigation={navigation} siteSettings={siteSettings} />
        {children}
        <Footer navigation={navigation} siteSettings={siteSettings} />
        <WhatsAppFloat whatsappUrl={siteSettings.whatsappUrl} />
      </body>
    </html>
  );
}
