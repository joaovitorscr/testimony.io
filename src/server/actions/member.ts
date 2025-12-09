"use server";

import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function removeMember(memberId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const memberToRemove = await db.member.findUnique({
      where: { id: memberId },
      include: { project: true },
    });

    if (!memberToRemove) {
      return { success: false, message: "Member not found" };
    }

    // Check permissions:
    // 1. Project Owner can remove anyone
    // 2. User can remove themselves (leave project)
    const project = memberToRemove.project;
    const isProjectOwner = project.userId === session.user.id;
    const isSelf = memberToRemove.userId === session.user.id;

    if (!isProjectOwner && !isSelf) {
      return { success: false, message: "Unauthorized" };
    }

    await db.member.delete({
      where: { id: memberId },
    });

    revalidatePath(`/project/${project.id}/settings`); // Adjust path as needed
    return { success: true };
  } catch (error) {
    console.error("Failed to remove member:", error);
    return { success: false, message: "Failed to remove member" };
  }
}
