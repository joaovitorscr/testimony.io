"use client";

import {
  LayoutIcon,
  LinkIcon,
  type LucideIcon,
  MessageCircleIcon,
  SettingsIcon,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import * as React from "react";
import { NavUser } from "@/components/sidebar/nav-user";
import { ProjectSwitcher } from "@/components/sidebar/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";
import type { Project } from "../../../generated/prisma/client";
import { ProjectSettings } from "../project-settings";
import { NavMain } from "./nav-main";

const navMainItems: {
  title: string;
  url: Route;
  icon: LucideIcon;
}[] = [
  {
    title: "Testimonies",
    url: "/testimonies",
    icon: MessageCircleIcon,
  },
  {
    title: "Widget",
    url: "/widget",
    icon: LayoutIcon,
  },
  {
    title: "Collect Link",
    url: "/collect-link",
    icon: LinkIcon,
  },
];

export function AppSidebar({
  projects,
  activeProjectId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projects: Pick<Project, "id" | "name" | "slug">[];
  activeProjectId?: string;
}) {
  const [projectSettingsOpen, setProjectSettingsOpen] = React.useState(false);
  const utils = api.useUtils();

  React.useEffect(() => {
    void utils.project.currentProject.prefetch();
  }, [utils.project.currentProject]);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="gap-8 pt-4">
          <SidebarMenu>
            <SidebarMenuItem className="grid place-items-center">
              <Image
                className="col-start-1 row-start-1 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0"
                src="/branding_white.svg"
                alt="Testimony.io"
                width={180}
                height={120}
                priority
              />
              <Image
                className="col-start-1 row-start-1 opacity-0 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-100"
                src="/logo_white.svg"
                alt="Testimony.io"
                width={32}
                height={32}
                priority
              />
            </SidebarMenuItem>
          </SidebarMenu>

          <ProjectSwitcher
            projects={projects}
            activeProjectId={activeProjectId}
          />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <NavMain items={navMainItems} />
          <SidebarGroup>
            <SidebarGroupLabel>Project Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setProjectSettingsOpen(true)}>
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <React.Suspense fallback={null}>
        {projectSettingsOpen && (
          <ProjectSettings
            open={projectSettingsOpen}
            onOpenChange={setProjectSettingsOpen}
          />
        )}
      </React.Suspense>
    </>
  );
}
