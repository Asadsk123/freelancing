import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { TooltipProvider } from "@/components/ui/tooltip";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Apply theme + premium visuals before first paint to prevent FOUC. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),d=document.documentElement;if(t==='dark'||t==='light'){d.setAttribute('data-theme',t);}else{d.removeAttribute('data-theme');}if(localStorage.getItem('ra_premium')==='on'){d.setAttribute('data-premium','on');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <TooltipProvider delayDuration={200} skipDelayDuration={300}>
          <div id="main-content">{children}</div>
        </TooltipProvider>
      </body>
    </html>
  );
}
