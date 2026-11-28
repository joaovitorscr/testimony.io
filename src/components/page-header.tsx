"use client";

import { usePathname } from "next/navigation";

import { useProject } from "@/components/project-context";
import { SidebarTrigger } from "@/components/ui/sidebar";

const SECTIONS: Partial<Record<string, string>> = {
  testimonials: "Testimonials",
  collect: "Collect",
  display: "Display",
  account: "Account",
};

/** Top context bar: the current section on the left, the active project on the right. */
export function PageHeader() {
  const pathname = usePathname();
  const { project } = useProject();
  const section = SECTIONS[pathname.split("/")[1] ?? ""];

  return (
    <header className="flex h-12 w-full shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 lg:px-4">
      <div className="flex min-w-0 items-center gap-2 text-[13px]">
        <SidebarTrigger className="text-muted-foreground md:hidden" />
        <span className="truncate text-muted-foreground">{project.name}</span>
        {section !== undefined && (
          <>
            <span aria-hidden="true" className="text-muted-foreground/60">
              /
            </span>
            <span className="truncate font-medium text-foreground">{section}</span>
          </>
        )}
      </div>
      <div className="flex min-w-0 items-center gap-2 rounded-[2px] border border-border bg-card px-2 py-1 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-success" />
        <span className="uppercase">Project</span>
        <span aria-hidden="true" className="opacity-40">
          /
        </span>
        <span className="truncate text-foreground">{project.slug}</span>
      </div>
    </header>
  );
}
