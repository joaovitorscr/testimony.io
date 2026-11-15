"use client";

import Link from "next/link";

import { MediaFrame, type Still } from "@/components/media-frame";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkStatus = "invalid" | "not-found" | "cancelled" | "used" | "expired";

const statusConfig: Record<LinkStatus, { still: Still; title: string; description: string }> = {
  invalid: {
    still: "night",
    title: "Invalid link",
    description:
      "This link is missing a valid token. Please check that you have the complete URL or request a new invitation link.",
  },
  "not-found": {
    still: "night",
    title: "Link not found",
    description:
      "This invitation link doesn't exist or may have been removed. Please contact the sender for a new link.",
  },
  cancelled: {
    still: "moss",
    title: "Link cancelled",
    description:
      "This invitation link has been cancelled by the sender. If you believe this is an error, please reach out to them directly.",
  },
  used: {
    still: "dusk",
    title: "Already submitted",
    description:
      "A testimonial has already been submitted using this link. Each invitation link can only be used once.",
  },
  expired: {
    still: "sky",
    title: "Link expired",
    description:
      "This invitation link has passed its expiration date. Please request a new invitation link from the sender.",
  },
};

/** Full-page message for a collection link that can't take a testimonial. */
export function LinkStatusCard({ status, className }: { status: LinkStatus; className?: string }) {
  const config = statusConfig[status];

  return (
    <main
      className={cn(
        "mx-auto flex min-h-svh w-full max-w-120 flex-col justify-center gap-8 px-5 py-16",
        className,
      )}
    >
      <MediaFrame still={config.still} className="aspect-video" aria-hidden="true" />

      <div className="flex flex-col gap-3">
        <h1 className="type-hero">{config.title}</h1>
        <p className="text-fg-2">{config.description}</p>
        <p className="text-sm text-muted-foreground">
          Need help? Contact the person who sent you this invitation link.
        </p>
      </div>

      <Button variant="secondary" size="sm" className="self-start" asChild>
        <Link href="/">Go to homepage</Link>
      </Button>
    </main>
  );
}
