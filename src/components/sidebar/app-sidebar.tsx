"use client";

import { LayoutIcon, LinkIcon, type LucideIcon, MessageCircleIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import { type ComponentProps, useState } from "react";

import { ProjectSettings } from "@/components/project-settings";
import { NavUser } from "@/components/sidebar/nav-user";
import { ProjectSwitcher } from "@/components/sidebar/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { NavMain, NavProject } from "./nav-main";

const navMainItems: {
  title: string;
  url: Route;
  icon: LucideIcon;
}[] = [
  { title: "Testimonials", url: "/testimonials", icon: MessageCircleIcon },
  { title: "Collect", url: "/collect", icon: LinkIcon },
  { title: "Display", url: "/display", icon: LayoutIcon },
];

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-border" {...props}>
        <SidebarHeader className="gap-3 pt-3">
          <SidebarMenu>
            <SidebarMenuItem className="flex h-9 items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <Image
                className="h-5 w-auto group-data-[collapsible=icon]:hidden dark:hidden"
                src="/branding_black.svg"
                alt="Testimony.io"
                width={118}
                height={20}
                priority
              />
              <Image
                className="hidden h-5 w-auto dark:block dark:group-data-[collapsible=icon]:hidden"
                src="/branding_white.svg"
                alt="Testimony.io"
                width={118}
                height={20}
                priority
              />
              <Image
                className="hidden size-5 group-data-[collapsible=icon]:block dark:group-data-[collapsible=icon]:hidden"
                src="/logo_black.svg"
                alt="Testimony.io"
                width={20}
                height={20}
                priority
              />
              <Image
                className="hidden size-5 dark:group-data-[collapsible=icon]:block"
                src="/logo_white.svg"
                alt="Testimony.io"
                width={20}
                height={20}
                priority
              />
            </SidebarMenuItem>
          </SidebarMenu>

          <ProjectSwitcher />
        </SidebarHeader>
        <SidebarSeparator className="mx-0" />
        <SidebarContent className="gap-0 py-1">
          <NavMain items={navMainItems} />
          <NavProject
            onOpenSettings={() => {
              setProjectSettingsOpen(true);
            }}
          />
        </SidebarContent>
        <SidebarSeparator className="mx-0" />
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {projectSettingsOpen && <ProjectSettings onOpenChange={setProjectSettingsOpen} />}
    </>
  );
}
