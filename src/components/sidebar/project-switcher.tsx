"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ChevronsUpDown, Folder, Plus } from "lucide-react";
import { useState } from "react";

import { OnboardingDialog } from "@/components/onboarding-dialog";
import { useProject } from "@/components/project-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function ProjectSwitcher() {
  const { isMobile } = useSidebar();
  const { project: activeProject, projects } = useProject();
  const setActive = useMutation(api.projects.setActive);

  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const handleSetActiveProject = async (projectId: Id<"projects">) => {
    await setActive({ projectId });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-11 border border-border bg-background shadow-2xs group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:shadow-none hover:bg-muted/70 data-[state=open]:bg-muted/70"
            >
              <div className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Folder className="size-3.5" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-[13px] font-medium">{activeProject.name}</span>
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {activeProject.slug}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-[11px] font-semibold tracking-[0.06em] text-muted-foreground/80 uppercase">
              Projects
            </DropdownMenuLabel>
            {projects.map((project) => (
              <DropdownMenuItem
                key={project._id}
                disabled={project._id === activeProject._id}
                onClick={() => {
                  void handleSetActiveProject(project._id);
                }}
                className="gap-2 p-2 text-[13px]"
              >
                <div className="flex size-6 items-center justify-center rounded-md border border-border bg-background">
                  <Folder className="size-3.5 shrink-0" />
                </div>
                {project.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 text-[13px]"
              onClick={() => {
                setShowNewProjectDialog(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border border-border bg-background">
                <Plus className="size-3.5" />
              </div>
              <span className="text-muted-foreground">Add project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <OnboardingDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog} />
    </SidebarMenu>
  );
}
