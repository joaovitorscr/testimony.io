"use client";

import { MenuIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

export function PageHeader() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <header className="flex h-12 w-full items-center justify-between border-b px-3">
      <Button variant="ghost" size="sm" onClick={toggleSidebar}>
        <MenuIcon data-icon="inline-start" />
        Menu
      </Button>
      <span className="px-2 text-lg type-wordmark text-foreground">testimony.io</span>
    </header>
  );
}
