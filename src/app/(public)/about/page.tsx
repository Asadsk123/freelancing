import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Target, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Royal Asad — our mission, approach, and commitment to your success.",
};

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Every decision we make is measured by its impact on your business. We don't build for the sake of building — we build to solve real problems and deliver measurable outcomes.",
  },
  {
    icon: Users,
    title: "Client-First",
    description:
      "Your convenience matters more than our process. Fewer clicks, less waiting, less confusion. We design every interaction around what's easiest for you.",
  },
  {
    icon: Zap,
    title: "Quality Without Compromise",
    description:
      "We never cut corners on security, performance, or accessibility. Premium results come from premium standards applied to every line of code and every pixel.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="About Us"
          description="We're a digital agency that believes technology should make business easier, not harder."
        />

        <div className="mt-12 mx-auto max-w-3xl">
          <div className="prose-like space-y-6 text-[var(--muted-foreground)]">
            <p className="text-lg leading-relaxed">
              Royal Asad is a premium international digital agency. We partner with
              businesses worldwide to deliver web development, design, and digital
              marketing solutions that drive real growth.
            </p>
            <p className="leading-relaxed">
              We started with a simple observation: most agencies optimize for their
              own workflow instead of their clients&apos; experience. We do the opposite.
              Every feature, every process, every interaction is designed to be as
              convenient as possible for the people we serve.
            </p>
            <p className="leading-relaxed">
              Our client portal gives you full visibility into your project — real-time
              progress, file previews with watermark protection, a single conversation
              thread per project, and a tracking ID for every engagement. No chasing
              updates, no wondering where things stand.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)]">
            What We Stand For
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                    <value.icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)]">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
