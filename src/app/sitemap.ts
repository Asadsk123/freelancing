import type { MetadataRoute } from "next";
import { hasDatabase } from "@/db";
import { blogPostRepository } from "@/lib/repositories/blog-post";
import { serviceRepository } from "@/lib/repositories/service";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/portfolio`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
  ];

  if (!hasDatabase()) return staticRoutes;

  try {
    const [posts, services] = await Promise.all([
      blogPostRepository.findPublished(),
      serviceRepository.findActive(),
    ]);
    const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    return [...staticRoutes, ...serviceRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
