import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void) {
  const query = globalThis.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => {
    query.removeEventListener("change", onChange);
  };
}

/** True below the `md` breakpoint. Always false during server rendering. */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => globalThis.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}
