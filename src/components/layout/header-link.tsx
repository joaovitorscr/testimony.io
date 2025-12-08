"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface HeaderLinkProps {
  href: ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
}

export default function HeaderLink({ href, children }: HeaderLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <div className="relative">
      <Link data-active={isActive} href={href} className="data-[active=true]:">
        {children}
      </Link>
      <div
        className={cn(
          "min-w-full h-0.5 invisible bg-sidebar-primary",
          isActive && "visible",
        )}
      />
    </div>
  );
}
