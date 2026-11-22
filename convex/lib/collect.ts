// Pure values shared by Convex functions and the Next.js client.

/** Field lengths the collection form accepts, after trimming. */
export const COLLECT_LIMITS = {
  name: { max: 100 },
  detail: { max: 100 },
  text: { min: 10, max: 5000 },
  prompt: { max: 200 },
} as const;

/** The question on the collection page when the project sets none. */
export const DEFAULT_PROMPT = "What has your experience been like?";
