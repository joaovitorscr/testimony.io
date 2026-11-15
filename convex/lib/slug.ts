// Pure helpers shared by Convex functions and the Next.js client.

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/** The URL slug for a project name, e.g. "Acme Inc." -> "acme-inc". */
export function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "");
}
