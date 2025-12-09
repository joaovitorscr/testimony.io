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
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-foreground font-bold text-background text-xl tracking-tight">
            T
          </div>
          <h1 className="font-semibold text-lg text-sidebar-foreground tracking-tight">
            Testimony.io
          </h1>
        </div>
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
                    className="text-base [&>svg]:size-4"
                    isActive={isActive}
                    onClick={() => router.push(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>

                  {isActive && (
                    <div className="-translate-y-1/2 absolute top-1/2 right-0 h-full w-2 rounded-r-md bg-primary" />
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
