import { MediaFrame } from "@/components/media-frame";

export function EmptyState() {
  return (
    <div className="flex max-w-sm flex-col gap-6">
      <MediaFrame still="sky" className="aspect-video w-full" />
      <div className="flex flex-col gap-2">
        <h2 className="type-title text-fg-2">No collection links yet</h2>
        <p className="text-sm text-muted-foreground">
          Create your first link above to start gathering testimonials from your customers.
        </p>
      </div>
    </div>
  );
}
