import type { Metadata } from "next";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { siteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: `${siteSettings.siteName} | ${siteSettings.tagline}`,
  description: siteSettings.mission,
  openGraph: {
    title: `${siteSettings.siteName} | ${siteSettings.tagline}`,
    description: siteSettings.mission,
    siteName: siteSettings.siteName,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
