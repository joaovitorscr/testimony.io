import { PauseIcon, SearchXIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const STATUS = {
  "not-found": {
    Icon: SearchXIcon,
    tile: "border-border bg-muted text-muted-foreground",
    badge: { variant: "secondary", label: "Not found" },
    title: "Page not found",
    description: "There is no collection page at this address. Check the link you were sent.",
  },
  paused: {
    Icon: PauseIcon,
    tile: "border-warning-border bg-warning-surface text-warning",
    badge: { variant: "warning", label: "Paused" },
    title: "Not collecting right now",
    description: "This project isn't accepting testimonials at the moment. Thanks for stopping by.",
  },
} as const;

/** Full-page message for a collection page that can't take a testimonial. */
export function CollectStatus({
  status,
  projectName,
}: {
  status: keyof typeof STATUS;
  projectName?: string;
}) {
  const { Icon, tile, badge, title, description } = STATUS[status];

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background px-4 py-16">
      <div className="flex w-full max-w-lg flex-col gap-5 rounded-[var(--radius)] border border-border/80 bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div
            className={`flex size-10 items-center justify-center rounded-[var(--radius)] border ${tile}`}
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <div className="flex flex-col gap-1.5">
          {projectName !== undefined && (
            <p className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
              {projectName}
            </p>
          )}
          <h1 className="font-display text-[26px] leading-[1.2] font-normal tracking-[-0.02em]">
            {title}
          </h1>
          <p className="text-sm/relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </main>
  );
}
