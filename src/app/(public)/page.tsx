import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { TechStrip } from "@/components/sections/tech-strip";
import { ProblemSection } from "@/components/sections/problem-section";
import { ServicesOverview } from "@/components/sections/services-overview";
import { TrustStrip } from "@/components/sections/trust-strip";
import { ProcessSection } from "@/components/sections/process-section";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq-section";
import { WhatsAppCta } from "@/components/sections/whatsapp-cta";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "ROYAL-ASAD AI & Digital Solutions — Websites & AI Automation",
  description:
    "We build professional business websites, AI automation systems, e-commerce stores, and WhatsApp workflows for businesses worldwide. Get a free quote today.",
  openGraph: {
    title: "ROYAL-ASAD AI & Digital Solutions",
    description: "Professional websites, AI automation, and business systems. Real results for real businesses.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechStrip />
      <ProblemSection />
      <ServicesOverview />
      <TrustStrip />
      <ProcessSection />
      <PortfolioPreview />
      <Testimonials />
      <FaqSection />
      <WhatsAppCta />
      <CtaBanner />
    </>
  );
}
