"use server";

import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";

export async function checkSlugAvailability(slug: string) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const existingProject = await db.project.findUnique({
      where: {
        slug,
      },
    });

    return {
      success: true,
      available: !existingProject,
    };
  } catch (error) {
    console.error("Failed to check slug availability:", error);
    return {
      success: false,
      message: "Failed to check slug availability",
    };
  }
}
