import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { normalizeSlug } from "@convex/lib/slug";
import { useQuery } from "convex/react";
import { useDebounce } from "use-debounce";

export type SlugStatus = "idle" | "checking" | "available" | "taken";

/**
 * The slug derived from a project name and whether it is free. The Convex
 * query re-runs as the debounced name changes, so callers only render.
 */
export function useSlugAvailability(name: string, exceptProjectId?: Id<"projects">) {
  const [debouncedName] = useDebounce(name, 400);
  const slug = normalizeSlug(debouncedName);
  const isLongEnough = slug.length >= 3;
  const available = useQuery(
    api.projects.isSlugAvailable,
    isLongEnough ? { slug, exceptProjectId } : "skip",
  );

  const status = ((): SlugStatus => {
    if (!isLongEnough) {
      return "idle";
    }
    if (available === undefined || normalizeSlug(name) !== slug) {
      return "checking";
    }
    return available ? "available" : "taken";
  })();

  return { slug: normalizeSlug(name), status };
}
