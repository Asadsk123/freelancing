import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getI18n } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/provider";
import { AssistantMount } from "@/components/assistant/assistant-mount";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: brand.name,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  description: brand.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: brand.contact.email,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dir, dict } = await getI18n();

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Apply theme + premium visuals before first paint to prevent FOUC. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),d=document.documentElement;if(t==='dark'||t==='light'){d.setAttribute('data-theme',t);}else{d.removeAttribute('data-theme');}if(localStorage.getItem('ra_premium')==='on'){d.setAttribute('data-premium','on');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <I18nProvider locale={locale} dir={dir} dict={dict}>
          <TooltipProvider delayDuration={200} skipDelayDuration={300}>
            <div id="main-content">{children}</div>
            <AssistantMount />
          </TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
