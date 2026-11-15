import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { createContext, useContext } from "react";

export type ProjectSummary = NonNullable<FunctionReturnType<typeof api.projects.current>>;

type ProjectContextValue = {
  project: ProjectSummary;
  projects: ProjectSummary[];
};

export const ProjectContext = createContext<ProjectContextValue | null>(null);

/** The project the dashboard works on. Use inside the private layout only. */
export function useProject() {
  const value = useContext(ProjectContext);
  if (value === null) {
    throw new Error("useProject must be used inside <ProjectProvider>");
  }
  return value;
}
