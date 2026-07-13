import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { TrustStrip } from "@/components/sections/trust-strip";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <TrustStrip />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
