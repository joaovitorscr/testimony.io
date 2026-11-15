import { MediaFrame } from "@/components/media-frame";

/** Film still on the left of the onboarding dialog, wordmark anchored bottom-left. */
export function OnboardingCover() {
  return (
    <MediaFrame still="night" className="flex min-h-56 flex-col justify-end gap-1 p-8">
      <p className="text-2xl type-wordmark">testimony.io</p>
      <p className="type-caption text-muted-foreground">Collect feedback effortlessly.</p>
    </MediaFrame>
  );
}
