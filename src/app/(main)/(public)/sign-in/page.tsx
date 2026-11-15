import Image from "next/image";

import { MediaFrame } from "@/components/media-frame";
import { RatingStars } from "@/components/rating-stars";
import { env } from "@/env";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-svh w-full gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
      <MediaFrame className="relative flex min-h-80 flex-col justify-end p-6 pb-10 md:p-11">
        <Image
          src="/sign-in/paris-cafe.jpg"
          alt="Two people deep in conversation at a café table, seen through the window at night"
          fill
          priority
          sizes="(min-width: 768px) 70vw, 100vw"
          className="-z-20 object-cover object-[50%_70%]"
        />
        {/* Quiets the shop sign up top and gives the headline darkness to sit on. */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/75 via-black/30 via-35% to-transparent to-55%" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/40 via-40% to-transparent to-70%" />

        {/* The example sits beside the man who is talking, like what is being said. */}
        <figure className="absolute right-[5%] bottom-[52%] hidden max-w-80 flex-col gap-3 rounded-lg bg-black/45 p-5 outline outline-1 -outline-offset-1 outline-white/20 backdrop-blur-md lg:flex">
          <RatingStars value={5} />
          <blockquote className="text-lg/snug text-pretty text-white">
            &ldquo;Sent the link on Monday, had three testimonials on our pricing page by
            Friday.&rdquo;
          </blockquote>
          <figcaption className="type-caption text-white/60">
            Example of a collected testimonial
          </figcaption>
        </figure>

        <div className="flex max-w-145 flex-col gap-4">
          <p className="type-display text-white">
            Collect the words your customers already say about you.
          </p>
          <p className="hidden text-lg text-white/80 sm:block">
            Send a link, get a testimonial back, and show it on your site with a single embed.
          </p>
        </div>

        <p className="absolute right-4 bottom-3 type-caption text-white/50">
          Photo:{" "}
          <a
            href="https://unsplash.com/photos/two-people-talking-at-a-table-inside-a-cafe-iviG404TVG4"
            className="underline-offset-2 transition-colors hover:text-white/80 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Thomas Leblanc / Unsplash
          </a>
        </p>
      </MediaFrame>
      <LoginForm devPassword={env.NODE_ENV === "development"} className="md:px-6 md:py-2" />
    </main>
  );
}
