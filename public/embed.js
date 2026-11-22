// Testimony.io embed helper. Resizes every Testimony.io widget iframe on the
// page to fit its testimonials. Without this script the iframe keeps the
// height set in its style attribute and scrolls.
(() => {
  const script = document.currentScript;
  if (!(script instanceof HTMLScriptElement) || globalThis.testimonyEmbedLoaded === true) {
    return;
  }
  globalThis.testimonyEmbedLoaded = true;
  const { origin } = new URL(script.src);
  const MAX_HEIGHT = 20_000;

  const widgetFrames = () =>
    [...document.querySelectorAll("iframe")].filter((frame) => {
      try {
        const url = new URL(frame.src, globalThis.location.href);
        return url.origin === origin && url.pathname.startsWith("/embed/");
      } catch {
        return false;
      }
    });

  globalThis.addEventListener("message", (event) => {
    const { data } = event;
    if (
      event.origin !== origin ||
      typeof data !== "object" ||
      data === null ||
      data.type !== "testimony:height" ||
      !Number.isFinite(data.height)
    ) {
      return;
    }
    const frame = widgetFrames().find((candidate) => candidate.contentWindow === event.source);
    if (frame !== undefined) {
      frame.style.height = `${Math.min(Math.max(data.height, 0), MAX_HEIGHT)}px`;
    }
  });

  // Frames that loaded before this script already posted; ask them again.
  for (const frame of widgetFrames()) {
    frame.contentWindow?.postMessage({ type: "testimony:ping" }, origin);
  }
})();
