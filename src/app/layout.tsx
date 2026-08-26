import type { Metadata } from "next";

import "@/app/globals.css";

import { ConsultationPopup } from "@/components/layout/ConsultationPopup";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AnalyticsScripts } from "@/components/shared/AnalyticsScripts";
import { FloatingContactBar } from "@/components/shared/FloatingContactBar";
import { FloatingWhatsAppButton } from "@/components/shared/FloatingWhatsAppButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE } from "@/data/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { defaultOpenGraph, defaultTwitter } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Bizfylr | Business Growth, Websites, E-commerce & Digital Infrastructure",
    template: `%s | ${SITE.name}`
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: {
    canonical: SITE.url
  },
  openGraph: {
    ...defaultOpenGraph,
    title: SITE.name,
    description: SITE.description,
    url: SITE.url
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION
      }
    : undefined,
  twitter: {
    ...defaultTwitter,
    title: SITE.name,
    description: SITE.description
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <AnalyticsScripts />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ConsultationPopup />
        <Header />
        <main className="pb-24 lg:pb-0" id="main-content">
          {children}
        </main>
        <FloatingWhatsAppButton />
        <FloatingContactBar />
        <Footer />
      </body>
    </html>
  );
}
