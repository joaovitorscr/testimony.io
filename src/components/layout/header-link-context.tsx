"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

interface HeaderLinkContextValue {
  registerLink: (href: string, ref: RefObject<HTMLElement>) => void;
  unregisterLink: (href: string) => void;
  animateToLink: (href: string) => void;
  lineRef: RefObject<HTMLDivElement>;
}

export const HeaderLinkContext = createContext<HeaderLinkContextValue | null>(
  null,
);

export function useHeaderLinkContext() {
  const context = useContext(HeaderLinkContext);
  if (!context) {
    throw new Error(
      "useHeaderLinkContext must be used within HeaderLinkProvider",
    );
  }
  return context;
}

