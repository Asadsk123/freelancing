"use server";

import { createServiceSchema, updateServiceSchema } from "@/lib/validations/service";
import { hasDatabase } from "@/db";
import { serviceRepository } from "@/lib/repositories/service";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

function parseFeatures(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createService(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw = {
    categoryId: field("categoryId"),
    name: field("name"),
    slug: field("slug"),
    shortDescription: field("shortDescription"),
    fullDescription: field("fullDescription"),
    icon: field("icon"),
    features: field("features"),
    sortOrder: field("sortOrder") || "0",
  };

  const result = createServiceSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    await serviceRepository.create({
      categoryId: result.data.categoryId,
      name: result.data.name,
      slug: result.data.slug,
      shortDescription: result.data.shortDescription,
      fullDescription: result.data.fullDescription || null,
      icon: result.data.icon || null,
      features: parseFeatures(result.data.features ?? ""),
      sortOrder: result.data.sortOrder,
    });

    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (err) {
    console.error("Failed to create service:", err);
    const message = err instanceof Error && err.message.includes("unique")
      ? "A service with this slug already exists."
      : "Something went wrong. Please try again.";
    return { success: false, error: message };
  }
}

export async function updateService(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw: Record<string, string> = {
    serviceId: field("serviceId"),
  };

  if (formData.has("categoryId")) raw.categoryId = field("categoryId");
  if (formData.has("name")) raw.name = field("name");
  if (formData.has("slug")) raw.slug = field("slug");
  if (formData.has("shortDescription")) raw.shortDescription = field("shortDescription");
  if (formData.has("fullDescription")) raw.fullDescription = field("fullDescription");
  if (formData.has("icon")) raw.icon = field("icon");
  if (formData.has("features")) raw.features = field("features");
  if (formData.has("sortOrder")) raw.sortOrder = field("sortOrder") || "0";

  const result = updateServiceSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const { serviceId, features: featuresRaw, ...updateData } = result.data;
    const updatePayload: Record<string, unknown> = { ...updateData };
    if (featuresRaw !== undefined) {
      updatePayload.features = parseFeatures(featuresRaw);
    }

    const updated = await serviceRepository.update(serviceId, updatePayload);
    if (!updated) {
      return { success: false, error: "Service not found." };
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (err) {
    console.error("Failed to update service:", err);
    const message = err instanceof Error && err.message.includes("unique")
      ? "A service with this slug already exists."
      : "Something went wrong. Please try again.";
    return { success: false, error: message };
  }
}

export async function toggleServiceActive(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const serviceId = (formData.get("serviceId") ?? "") as string;
  if (!serviceId) {
    return { success: false, error: "Service ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const toggled = await serviceRepository.toggleActive(serviceId);
    if (!toggled) {
      return { success: false, error: "Service not found." };
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (err) {
    console.error("Failed to toggle service:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteService(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const serviceId = (formData.get("serviceId") ?? "") as string;
  if (!serviceId) {
    return { success: false, error: "Service ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const deleted = await serviceRepository.delete(serviceId);
    if (!deleted) {
      return { success: false, error: "Service not found." };
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete service:", err);
    const message = err instanceof Error && err.message.includes("restrict")
      ? "Cannot delete a service that has active projects."
      : "Something went wrong. Please try again.";
    return { success: false, error: message };
  }
}
