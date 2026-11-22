import { MediaFrame, type Still } from "@/components/media-frame";

const STATUS = {
  "not-found": {
    still: "night",
    title: "Page not found",
    description: "There is no collection page at this address. Check the link you were sent.",
  },
  paused: {
    still: "moss",
    title: "Not collecting right now",
    description: "This project isn't accepting testimonials at the moment. Thanks for stopping by.",
  },
} satisfies Record<string, { still: Still; title: string; description: string }>;

/** Full-page message for a collection page that can't take a testimonial. */
export function CollectStatus({
  status,
  projectName,
}: {
  status: keyof typeof STATUS;
  projectName?: string;
}) {
  const config = STATUS[status];

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-120 flex-col justify-center gap-8 px-5 py-16">
      <MediaFrame still={config.still} className="aspect-video" aria-hidden="true" />
      <div className="flex flex-col gap-3">
        {projectName !== undefined && (
          <p className="text-sm text-muted-foreground">{projectName}</p>
        )}
        <h1 className="type-hero">{config.title}</h1>
        <p className="text-fg-2">{config.description}</p>
      </div>
    </main>
  );
}
