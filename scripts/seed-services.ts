/**
 * One-time script: deactivates all existing services and upserts the two
 * active service offerings. Run with:
 *   npx tsx scripts/seed-services.ts
 * Requires DATABASE_URL in .env.local.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { services, serviceCategories } from "../src/db/schema/index";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  // 1. Deactivate all existing services
  await db.update(services).set({ isActive: false, updatedAt: new Date() });
  console.log("All services deactivated.");

  // 2. Ensure a category exists
  let catId: string;
  const existingCats = await db.select().from(serviceCategories).limit(1);
  if (existingCats[0]) {
    catId = existingCats[0].id;
    // Make sure the category is active
    await db
      .update(serviceCategories)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(serviceCategories.id, catId));
  } else {
    const [cat] = await db
      .insert(serviceCategories)
      .values({
        name: "Digital Services",
        slug: "digital-services",
        description: "Premium digital services for modern businesses.",
        sortOrder: 0,
        isActive: true,
      })
      .returning();
    catId = cat!.id;
  }
  console.log(`Using category id: ${catId}`);

  // 3. Upsert Web Design & Development
  const webSlug = "web-design-development";
  const existing1 = await db
    .select()
    .from(services)
    .where(eq(services.slug, webSlug))
    .limit(1);

  if (existing1[0]) {
    await db
      .update(services)
      .set({
        name: "Web Design & Development",
        shortDescription:
          "Premium business websites and custom web applications built for performance, accessibility, and security.",
        fullDescription:
          "We design and build premium business websites and custom web applications using modern full-stack technology. Every project is tailored — no templates — with a focus on responsive UI/UX, production-grade security, performance optimisation, SEO, and accessibility. We handle everything from initial design through to CMS/admin integration, API connections, and production deployment.",
        features: [
          "Custom UI/UX design",
          "Next.js / React full-stack development",
          "Responsive across all devices",
          "Performance & Core Web Vitals optimisation",
          "SEO & accessibility built in",
          "CMS and admin dashboard integration",
          "Third-party API and service integrations",
          "Production deployment & ongoing support",
        ],
        isActive: true,
        sortOrder: 1,
        categoryId: catId,
        updatedAt: new Date(),
      })
      .where(eq(services.slug, webSlug));
    console.log("Updated: Web Design & Development");
  } else {
    await db.insert(services).values({
      categoryId: catId,
      name: "Web Design & Development",
      slug: webSlug,
      shortDescription:
        "Premium business websites and custom web applications built for performance, accessibility, and security.",
      fullDescription:
        "We design and build premium business websites and custom web applications using modern full-stack technology. Every project is tailored — no templates — with a focus on responsive UI/UX, production-grade security, performance optimisation, SEO, and accessibility. We handle everything from initial design through to CMS/admin integration, API connections, and production deployment.",
      features: [
        "Custom UI/UX design",
        "Next.js / React full-stack development",
        "Responsive across all devices",
        "Performance & Core Web Vitals optimisation",
        "SEO & accessibility built in",
        "CMS and admin dashboard integration",
        "Third-party API and service integrations",
        "Production deployment & ongoing support",
      ],
      isActive: true,
      sortOrder: 1,
    });
    console.log("Inserted: Web Design & Development");
  }

  // 4. Upsert AI Automation
  const aiSlug = "ai-automation";
  const existing2 = await db
    .select()
    .from(services)
    .where(eq(services.slug, aiSlug))
    .limit(1);

  if (existing2[0]) {
    await db
      .update(services)
      .set({
        name: "AI Automation",
        shortDescription:
          "AI-powered workflows, intelligent agents, and process automation custom-built for your business operations.",
        fullDescription:
          "We build AI-powered automation systems that replace repetitive manual work and scale your operations. Engagements range from internal workflow automation and document/data processing pipelines, to AI assistants and agents for customer support, lead qualification, and operational efficiency. Every solution is built around measurable outcomes and integrates with your existing tools and APIs.",
        features: [
          "AI-powered business workflow automation",
          "Intelligent agents & AI assistants",
          "Document and data processing pipelines",
          "Lead and customer support automation",
          "API and third-party integration automation",
          "Internal operations and approval workflows",
          "Custom AI software integrations",
          "Measurable efficiency and cost reduction",
        ],
        isActive: true,
        sortOrder: 2,
        categoryId: catId,
        updatedAt: new Date(),
      })
      .where(eq(services.slug, aiSlug));
    console.log("Updated: AI Automation");
  } else {
    await db.insert(services).values({
      categoryId: catId,
      name: "AI Automation",
      slug: aiSlug,
      shortDescription:
        "AI-powered workflows, intelligent agents, and process automation custom-built for your business operations.",
      fullDescription:
        "We build AI-powered automation systems that replace repetitive manual work and scale your operations. Engagements range from internal workflow automation and document/data processing pipelines, to AI assistants and agents for customer support, lead qualification, and operational efficiency. Every solution is built around measurable outcomes and integrates with your existing tools and APIs.",
      features: [
        "AI-powered business workflow automation",
        "Intelligent agents & AI assistants",
        "Document and data processing pipelines",
        "Lead and customer support automation",
        "API and third-party integration automation",
        "Internal operations and approval workflows",
        "Custom AI software integrations",
        "Measurable efficiency and cost reduction",
      ],
      isActive: true,
      sortOrder: 2,
    });
    console.log("Inserted: AI Automation");
  }

  // 5. Verify
  const active = await db
    .select({ name: services.name, slug: services.slug, isActive: services.isActive })
    .from(services)
    .where(eq(services.isActive, true));
  console.log("\nActive services after update:");
  active.forEach((s) => console.log(`  ✓ ${s.name} (${s.slug})`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
