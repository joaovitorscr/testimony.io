import Image from "next/image";

import { RatingStars } from "@/components/rating-stars";

/** Cursory painted-wash panel holding a floating product window for onboarding. */
export function OnboardingCover() {
  return (
    <div className="flex min-h-56 flex-col justify-between gap-6 border-b border-border cursory-wash p-7 md:border-r md:border-b-0">
      <div>
        <Image
          className="h-5 w-auto dark:hidden"
          src="/branding_black.svg"
          alt="Testimony.io"
          width={120}
          height={20}
          priority
        />
        <Image
          className="hidden h-5 w-auto dark:block"
          src="/branding_white.svg"
          alt="Testimony.io"
          width={120}
          height={20}
          priority
        />
      </div>

      <figure className="hidden flex-col overflow-hidden rounded-[10px] bg-chrome shadow-window md:flex">
        <div className="flex h-[34px] items-center justify-between border-b border-border px-3">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="size-[9px] rounded-full bg-foreground/20" />
            <span className="size-[9px] rounded-full bg-foreground/20" />
            <span className="size-[9px] rounded-full bg-foreground/20" />
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">review queue</span>
          <span className="size-3" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-3 bg-panel p-5">
          <RatingStars value={5} />
          <blockquote className="font-serif text-[20px] leading-[1.3] tracking-[-0.01em] text-foreground">
            &ldquo;We replaced a spreadsheet and three reminder emails with one link.&rdquo;
          </blockquote>
          <figcaption className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
            Sarah Chen · Product Manager
          </figcaption>
        </div>
      </figure>

      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-normal tracking-[-0.01em] text-foreground">
          Collect feedback effortlessly.
        </p>
        <p className="text-[13px] text-foreground/70">
          One link to collect, one widget to show what you approve.
        </p>
      </div>
    </div>
  );
}
