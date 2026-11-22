import type { Id } from "@convex/_generated/dataModel";

function isStorageResponse(value: unknown): value is { storageId: Id<"_storage"> } {
  return (
    typeof value === "object" &&
    value !== null &&
    "storageId" in value &&
    typeof value.storageId === "string"
  );
}

/** Uploads a cropped data URL to a Convex upload URL and returns its storage id. */
export async function uploadAvatar(uploadUrl: string, dataUrl: string) {
  const image = await fetch(dataUrl);
  const blob = await image.blob();
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": blob.type === "" ? "image/png" : blob.type },
    body: blob,
  });
  const body: unknown = await response.json();
  if (!response.ok || !isStorageResponse(body)) {
    throw new Error("Avatar upload failed");
  }
  return body.storageId;
}
