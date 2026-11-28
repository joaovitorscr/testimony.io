import { CheckIcon, CodeIcon, LinkIcon } from "lucide-react";
import Image from "next/image";

import { env } from "@/env";

import { LoginForm } from "./_components/login-form";

const STEPS = [
  {
    Icon: LinkIcon,
    title: "Share one link",
    description: "Send it in an email or drop it in your app. Customers answer in about a minute.",
  },
  {
    Icon: CheckIcon,
    title: "Approve what you like",
    description: "Every testimonial waits in a review queue. Nothing goes public until you say so.",
  },
  {
    Icon: CodeIcon,
    title: "Embed anywhere",
    description: "Paste one snippet on your site, or read approved testimonials from the API.",
  },
];

export default function LoginPage() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <Image
          src="/branding_black.svg"
          alt="Testimony.io"
          width={148}
          height={24}
          priority
          className="h-6 w-auto dark:hidden"
        />
        <Image
          src="/branding_white.svg"
          alt="Testimony.io"
          width={148}
          height={24}
          priority
          className="hidden h-6 w-auto dark:block"
        />

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col rounded-[var(--radius)] border border-border/80 bg-card">
            <LoginForm devPassword={env.NODE_ENV === "development"} className="flex-1 p-6 sm:p-9" />
          </div>

          <section
            aria-labelledby="how-it-works"
            className="flex flex-col justify-center rounded-[var(--radius)] cursory-wash p-5 sm:p-8"
          >
            <div className="overflow-hidden rounded-[10px] bg-chrome shadow-window">
              <div className="flex h-[34px] items-center justify-between border-b border-border px-3">
                <span aria-hidden="true" className="flex items-center gap-1.5">
                  <span className="size-[9px] rounded-full bg-foreground/20" />
                  <span className="size-[9px] rounded-full bg-foreground/20" />
                  <span className="size-[9px] rounded-full bg-foreground/20" />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  testimony.io — workflow
                </span>
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              </div>

              <div className="flex flex-col gap-5 bg-panel p-5 sm:p-6">
                <div className="flex flex-col gap-1.5">
                  <h2
                    id="how-it-works"
                    className="font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase"
                  >
                    How it works
                  </h2>
                  <p className="font-display text-[20px] leading-[1.3] font-normal tracking-[-0.01em] text-balance text-foreground">
                    Collect the words your customers already say about you.
                  </p>
                </div>

                <ol className="flex flex-col border-t border-border">
                  {STEPS.map(({ Icon, title, description }, index) => (
                    <li
                      key={title}
                      className="flex items-start gap-3 border-b border-border py-3.5 last:border-b-0 last:pb-0"
                    >
                      <span className="mt-0.5 w-6 shrink-0 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="flex items-center gap-1.5 text-[13.5px] font-medium text-foreground">
                          <Icon
                            className="size-3.5 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          {title}
                        </p>
                        <p className="text-[12.5px]/relaxed text-muted-foreground">{description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
