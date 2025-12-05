"use client";

import { updateTestimonialLinkStatus } from "@/server/actions/testimonial-link";
import { Switch } from "./ui/switch";

interface ToggleCollectLinkProps {
  currentValue: boolean;
  testimonialLinkId: string;
}

export function ToggleCollectLink({
  currentValue,
  testimonialLinkId,
}: ToggleCollectLinkProps) {
  return (
    <Switch
      checked={currentValue}
      onCheckedChange={(checked) =>
        updateTestimonialLinkStatus(testimonialLinkId, checked)
      }
    />
  );
}
