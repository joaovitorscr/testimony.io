"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/server/better-auth";
import { db } from "@/server/db";

const inviteUserSchema = z.object({
  email: z.email(),
  projectId: z.string(),
  role: z.string().default("member"),
});

export async function inviteUser(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    email: formData.get("email"),
    projectId: formData.get("projectId"),
    role: formData.get("role") || "member",
  };

  const validatedData = inviteUserSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { email, projectId, role } = validatedData.data;

  try {
    // Check permissions (must be member of project)
    const membership = await db.member.findFirst({
      where: {
        userId: session.user.id,
        projectId: projectId,
      },
    });

    // Also check if owner
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    const isOwner = project?.userId === session.user.id;

    if (!membership && !isOwner) {
      return { success: false, message: "Unauthorized to invite" };
    }

    // Check if user is already a member
    const existingMember = await db.member.findFirst({
      where: {
        project: { id: projectId },
        user: { email: email },
      },
    });

    if (existingMember) {
      return { success: false, message: "User is already a member" };
    }

    // Check if invitation already exists
    const existingInvitation = await db.invitation.findFirst({
      where: {
        projectId,
        email,
        status: "pending",
      },
    });

    if (existingInvitation) {
      return { success: false, message: "Invitation already pending" };
    }

    // Create invitation
    // Expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.invitation.create({
      data: {
        projectId,
        email,
        role,
        expiresAt,
        inviterId: session.user.id,
      },
    });

    // TODO: Send email

    revalidatePath(`/project/${projectId}/settings`);
    return { success: true, message: "Invitation sent" };
  } catch (error) {
    console.error("Failed to invite user:", error);
    return { success: false, message: "Failed to invite user" };
  }
}

export async function cancelInvitation(invitationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.invitation.delete({
      where: { id: invitationId },
    });
    return { success: true };
  } catch (e) {
    return { success: false, message: "Failed to cancel" };
  }
}

export async function acceptInvitation(invitationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.status !== "pending") {
      return { success: false, message: "Invalid invitation" };
    }

    if (invitation.email !== session.user.email) {
      return { success: false, message: "This invitation is not for you" };
    }

    if (new Date() > invitation.expiresAt) {
      return { success: false, message: "Invitation expired" };
    }

    // Add member
    await db.member.create({
      data: {
        userId: session.user.id,
        projectId: invitation.projectId,
        role: invitation.role,
      },
    });

    // Update invitation status
    await db.invitation.update({
      where: { id: invitationId },
      data: { status: "accepted" },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    return { success: false, message: "Failed to accept invitation" };
  }
}
