"use client";

import { useEffect } from "react";

/**
 * Reports the widget's height to the embedding page, where `public/embed.js`
 * resizes the iframe to fit. Posts once on load, on every size change, and
 * when the script asks (it may load after the iframe).
 */
export function EmbedResize() {
  useEffect(() => {
    const root = document.documentElement;
    const post = () => {
      const height = Math.ceil(root.getBoundingClientRect().height);
      globalThis.parent.postMessage({ type: "testimony:height", height }, "*");
    };
    const onMessage = (event: MessageEvent<unknown>) => {
      const { data } = event;
      if (
        event.source === globalThis.parent &&
        typeof data === "object" &&
        data !== null &&
        "type" in data &&
        data.type === "testimony:ping"
      ) {
        post();
      }
    };
    const observer = new ResizeObserver(post);
    observer.observe(root);
    globalThis.addEventListener("message", onMessage);
    return () => {
      observer.disconnect();
      globalThis.removeEventListener("message", onMessage);
    };
  }, []);

  return null;
}
