"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { getActiveProjectId } from "./active-project";

const createTokenSchema = z.object({
  description: z.string().optional(),
});

export async function createToken(input: z.infer<typeof createTokenSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const activeProjectId = await getActiveProjectId();

  if (!activeProjectId) {
    return {
      success: false,
      message: "No active project selected",
    };
  }

  const validatedData = createTokenSchema.safeParse(input);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { description } = validatedData.data;

  try {
    const token = await db.testimonialToken.create({
      data: {
        projectId: activeProjectId,
        description,
        createdBy: session.user.name || session.user.email,
        token:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
      },
    });

    revalidatePath("/collect-link");

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error("Failed to create token:", error);
    return {
      success: false,
      message: "Failed to create token",
    };
  }
}

export async function cancelToken(tokenId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const activeProjectId = await getActiveProjectId();

  if (!activeProjectId) {
    return {
      success: false,
      message: "No active project selected",
    };
  }

  try {
    const token = await db.testimonialToken.findUnique({
      where: { id: tokenId },
    });

    if (!token) {
      return { success: false, message: "Token not found" };
    }

    if (token.projectId !== activeProjectId) {
      return { success: false, message: "Unauthorized" };
    }

    await db.testimonialToken.update({
      where: { id: tokenId },
      data: { cancelled: true },
    });

    revalidatePath("/collect-link");

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel token:", error);
    return { success: false, message: "Failed to cancel token" };
  }
}
