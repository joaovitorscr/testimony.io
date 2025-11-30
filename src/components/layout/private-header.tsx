import type Link from "next/link";
import type { ComponentProps } from "react";
import UserMenuButton from "../user-menu-button";
import HeaderLink from "./header-link";

const headerLinks: Array<{
  href: ComponentProps<typeof Link>["href"];
  label: string;
}> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/manage-widget", label: "Manage Widget" },
];

export default function PrivateHeader() {
  return (
    <header className="bg-sidebar px-10 py-4 text-sidebar-foreground">
      <nav className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimony.io</h1>
        <ul className="flex items-center space-x-8 text-sm tracking-tight font-semibold">
          {headerLinks.map((link) => (
            <li key={link.label}>
              <HeaderLink href={link.href}>{link.label}</HeaderLink>
            </li>
          ))}
        </ul>
        <UserMenuButton />
      </nav>
    </header>
  );
}
