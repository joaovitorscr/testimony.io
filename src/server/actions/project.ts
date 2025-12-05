"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

const createProjectSchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(50),
});

export async function createProject(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
  };

  const validatedData = createProjectSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { name, slug } = validatedData.data;

  try {
    // Check if slug exists
    const existingProject = await db.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return {
        success: false,
        message: "Slug already exists",
      };
    }

    const organizationId = formData.get("organizationId") as string | null;

    const project = await db.project.create({
      data: {
        name,
        slug,
        userId: organizationId ? null : session.user.id,
        organizationId: organizationId || null,
      },
    });

    await db.testimonialLink.create({
      data: {
        slug: project.slug,
        projectId: project.id,
        thankYouMessage: "Thank you for sharing your experience",
        isActive: false,
      },
    });

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      success: false,
      message: "Failed to create project",
    };
  }
}
