import { MediaFrame } from "@/components/media-frame";
import { RatingStars } from "@/components/rating-stars";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-svh w-full gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
      <MediaFrame
        still="ink"
        className="flex min-h-64 flex-col justify-end gap-10 p-6 sm:justify-between md:p-11"
      >
        <figure className="hidden max-w-md flex-col gap-5 rounded-lg border border-border bg-card p-6 sm:flex md:self-end">
          <RatingStars value={5} />
          <blockquote className="type-lede text-pretty text-card-foreground">
            Sent the link on Monday, had three testimonials on our pricing page by Friday.
          </blockquote>
          <figcaption className="type-caption text-muted-foreground">
            Example of a collected testimonial
          </figcaption>
        </figure>

        <div className="flex max-w-145 flex-col gap-4">
          <p className="type-display">Collect the words your customers already say about you.</p>
          <p className="hidden text-lg text-fg-2 sm:block">
            Send a link, get a testimonial back, and show it on your site with a single embed.
          </p>
        </div>
      </MediaFrame>
      <LoginForm className="md:px-6 md:py-2" />
    </main>
  );
}
