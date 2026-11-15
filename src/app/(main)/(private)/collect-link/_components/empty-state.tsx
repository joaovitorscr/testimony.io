"use client";

import { ArrowUpIcon, LinkIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 border-dashed bg-linear-to-b from-muted/20 to-muted/5 px-8 py-16">
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-6 rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
          <LinkIcon className="size-8 text-primary/80" />
        </div>

        <h3 className="mb-2 font-semibold text-lg">No collection links yet</h3>
        <p className="mb-6 max-w-sm text-muted-foreground text-sm">
          Create your first collection link above to start gathering
          testimonials from your customers.
        </p>

        <div className="flex animate-bounce items-center gap-1 text-primary/80">
          <ArrowUpIcon className="size-4" />
          <span className="font-medium text-sm">Create your first link</span>
        </div>
      </div>
    </div>
  );
}
