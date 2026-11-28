"use client";

import { type LucideIcon, SettingsIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/** 11px monospace tracked header for a sidebar group. */
const GROUP_LABEL =
  "h-7 font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase";

/** Pill nav row on warm surface, lifting to the active pill on selection. */
const NAV_ITEM =
  "h-8.5 rounded-full px-3 text-[13.5px] text-muted-foreground transition-[width,height,padding,color,background-color] hover:bg-sidebar-accent/70 hover:text-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: Route;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={GROUP_LABEL}>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname.startsWith(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={NAV_ITEM}
                asChild
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

/** The project group: opens the project settings dialog. */
export function NavProject({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className={GROUP_LABEL}>Project</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Settings" className={NAV_ITEM} onClick={onOpenSettings}>
            <SettingsIcon />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
