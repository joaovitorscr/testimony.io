"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { Loader2Icon } from "lucide-react";
import { createContext, type ReactNode, useContext } from "react";
import { OnboardingDialog } from "@/components/onboarding-dialog";

export type ProjectSummary = NonNullable<
  FunctionReturnType<typeof api.projects.current>
>;

type ProjectContextValue = {
  project: ProjectSummary;
  projects: ProjectSummary[];
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProject() {
  const value = useContext(ProjectContext);
  if (value === null) {
    throw new Error("useProject must be used inside <ProjectProvider>");
  }
  return value;
}

export function FullPageSpinner() {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center">
      <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
    </main>
  );
}

/**
 * Resolves the project the dashboard works on. Users without a project get
 * the onboarding dialog instead of the dashboard.
 */
export function ProjectProvider({ children }: { children: ReactNode }) {
  const project = useQuery(api.projects.current);
  const projects = useQuery(api.projects.list);

  if (project === undefined || projects === undefined) {
    return <FullPageSpinner />;
  }

  if (project === null) {
    return (
      <main className="min-h-svh flex-1 bg-linear-to-br from-primary/30 via-primary/10 to-primary/5">
        <OnboardingDialog open={true} />
      </main>
    );
  }

  return (
    <ProjectContext.Provider value={{ project, projects }}>
      {children}
    </ProjectContext.Provider>
  );
}
