"use client";

import Image from "next/image";
import { useState } from "react";

/** Customer photo for a widget card, falling back to initials. */
export function WidgetAvatar({
  name,
  url,
  color,
}: {
  name: string;
  url: string | null;
  color: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
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
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {url === null || failed ? (
        <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{initials}</span>
      ) : (
        <Image
          src={url}
          alt={name}
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
