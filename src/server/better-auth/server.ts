"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { api } from "@/trpc/server";
import { auth } from ".";

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);

export const getActiveProjectId = cache(async () => {
  const session = await getSession();

  return session?.user.activeProjectId;
});

export const setActiveProjectId = async (projectId: string) => {
  const userProjects = await api.project.all();

  if (!userProjects.some((project) => project.id === projectId)) {
    throw new Error("Project not found");
  }

  auth.api.updateUser({
    body: {
      activeProjectId: projectId,
    },
    headers: await headers(),
  });
};
