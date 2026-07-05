import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Palette, BarChart3, Smartphone, Globe, PenTool } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Manage Services",
  description: "View and manage service offerings.",
};

const mockServices: { id: string; title: string; category: string; description: string; icon: LucideIcon; activeProjects: number; published: boolean }[] = [
  {
    id: "1",
    title: "Web Development",
    category: "Development",
    description: "Custom websites and web applications built with modern technologies.",
    icon: Code,
    activeProjects: 3,
    published: true,
  },
  {
    id: "2",
    title: "Graphic Design",
    category: "Design",
    description: "Brand identity, logos, marketing materials, and visual design.",
    icon: Palette,
    activeProjects: 2,
    published: true,
  },
  {
    id: "3",
    title: "Digital Marketing",
    category: "Marketing",
    description: "SEO, social media management, PPC, and content marketing.",
    icon: BarChart3,
    activeProjects: 1,
    published: true,
  },
  {
    id: "4",
    title: "Mobile App Development",
    category: "Development",
    description: "Native and cross-platform mobile applications.",
    icon: Smartphone,
    activeProjects: 1,
    published: true,
  },
  {
    id: "5",
    title: "E-commerce Solutions",
    category: "Development",
    description: "Online stores with payment processing and inventory management.",
    icon: Globe,
    activeProjects: 1,
    published: true,
  },
  {
    id: "6",
    title: "UI/UX Design",
    category: "Design",
    description: "User research, wireframing, prototyping, and user testing.",
    icon: PenTool,
    activeProjects: 0,
    published: false,
  },
];

export default function AdminServicesPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Services" description="Manage your service offerings." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                  <service.icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <Badge variant={service.published ? "success" : "secondary"}>
                  {service.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <CardTitle className="text-base">{service.title}</CardTitle>
              <CardDescription>{service.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">{service.description}</p>
              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                {service.activeProjects} active {service.activeProjects === 1 ? "project" : "projects"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
