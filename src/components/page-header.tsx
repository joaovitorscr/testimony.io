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
    <header className="flex h-10 w-full items-center justify-between bg-sidebar px-5 shadow-sm">
      <Button variant="ghost" size="sm" onClick={toggleSidebar}>
        <MenuIcon />
        <p>Open Menu</p>
      </Button>
    </header>
  );
}
