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
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        backgroundColor: "color-mix(in srgb, var(--tm-accent) 22%, var(--tm-bg))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {url === null || failed ? (
        <span aria-hidden="true" style={{ fontSize: "13px", fontWeight: 600 }}>
          {initials}
        </span>
      ) : (
        <Image
          src={url}
          alt=""
          width={40}
          height={40}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => {
            setFailed(true);
          }}
        />
      )}
    </div>
  );
}
