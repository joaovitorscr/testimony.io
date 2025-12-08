"use client";

import {
  LayoutIcon,
  LinkIcon,
  MessageCircleIcon,
  SettingsIcon,
} from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { NavUser } from "@/components/sidebar/nav-user";
import { OrganizationSwitcher } from "@/components/sidebar/organization-switcher";
import { ProjectSwitcher } from "@/components/sidebar/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const navMainItems: {
  title: string;
  url: Route;
  icon: React.ComponentType;
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
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
];

type Project = {
  id: string;
  name: string;
  slug: string;
};

export function AppSidebar({
  projects,
  activeProjectId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projects: Project[];
  activeProjectId?: string;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible={isMobile ? "icon" : "none"} {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 py-4 px-2">
          <div className="size-10 rounded-xl flex items-center justify-center font-bold tracking-tight text-xl bg-foreground text-background">
            T
          </div>
          <h1 className="font-semibold text-lg tracking-tight text-sidebar-foreground">
            Testimony.io
          </h1>
        </div>
        <OrganizationSwitcher />
        <ProjectSwitcher
          projects={projects}
          activeProjectId={activeProjectId}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMainItems.map((item) => {
              const isActive = pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="[&>svg]:size-4 text-base"
                    isActive={isActive}
                    onClick={() => router.push(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>

                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-md h-full w-2 bg-primary" />
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
