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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground">
                <Folder className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeProject.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {projects.map((project) => (
              <DropdownMenuItem
                key={project._id}
                disabled={project._id === activeProject._id}
                onClick={() => {
                  void handleSetActiveProject(project._id);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Folder className="size-3.5 shrink-0" />
                </div>
                {project.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                setShowNewProjectDialog(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                <Plus className="size-4" />
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
