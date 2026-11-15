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
import { type ComponentProps, useState } from "react";

import { ProjectSettings } from "@/components/project-settings";
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

import { NavMain } from "./nav-main";

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
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="gap-6 pt-4">
          <SidebarMenu>
            <SidebarMenuItem className="flex h-8 items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <span className="text-xl type-wordmark text-foreground group-data-[collapsible=icon]:hidden">
                testimony.io
              </span>
              <Image
                className="hidden size-6 group-data-[collapsible=icon]:block"
                src="/logo_black.svg"
                alt="Testimony.io"
                width={24}
                height={24}
                priority
              />
            </SidebarMenuItem>
          </SidebarMenu>

          <ProjectSwitcher />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <NavMain items={navMainItems} />
          <SidebarGroup>
            <SidebarGroupLabel>Project Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Settings"
                  className="text-muted-foreground transition-[width,height,padding,color,background-color]"
                  onClick={() => {
                    setProjectSettingsOpen(true);
                  }}
                >
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
      {projectSettingsOpen && <ProjectSettings onOpenChange={setProjectSettingsOpen} />}
    </>
  );
}
