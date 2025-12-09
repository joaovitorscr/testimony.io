"use server";

import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function checkSlugAvailability(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const existingProject = await db.project.findUnique({
      where: { slug },
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

