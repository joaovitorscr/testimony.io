"use server";

import { cookies } from "next/headers";

const PROJECT_COOKIE_NAME = "testimony_active_project";

export async function setActiveProject(projectId: string) {
  (await cookies()).set(PROJECT_COOKIE_NAME, projectId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getActiveProjectId() {
  const cookieStore = await cookies();
  return cookieStore.get(PROJECT_COOKIE_NAME)?.value;
}

