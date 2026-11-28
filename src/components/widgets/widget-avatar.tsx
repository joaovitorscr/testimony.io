"use client";

import Image from "next/image";
import { useState } from "react";

/** Customer photo for a widget card, falling back to initials. */
export function WidgetAvatar({ name, url }: { name: string; url: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/u)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        backgroundColor: "color-mix(in srgb, var(--tm-accent) 16%, var(--tm-bg))",
        color: "color-mix(in srgb, var(--tm-accent) 70%, var(--tm-fg))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {url === null || failed ? (
        <span
          aria-hidden="true"
          style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.02em" }}
        >
          {initials}
        </span>
      ) : (
        <Image
          src={url}
          alt=""
          width={32}
          height={32}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => {
            setFailed(true);
          }}
        />
      )}
    </div>
  );
}
