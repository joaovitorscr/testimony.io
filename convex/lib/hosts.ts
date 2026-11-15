// Pure helpers shared by Convex functions and the Next.js client.

/** Hostname without `www.`, or null when the input is not a URL/domain. */
export function normalizeHost(input: string): string | null {
  const value = input.trim();
  if (value.length === 0) {
    return null;
  }
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./u, "").toLowerCase();
    return host === "" ? null : host;
  } catch {
    return null;
  }
}
