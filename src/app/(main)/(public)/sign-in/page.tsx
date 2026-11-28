import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import { env } from "@/env";

import { LoginForm } from "./_components/login-form";

const QUEUE = [
  { name: "Maya R.", role: "Founder, Tidepool", status: "Approved", live: true },
  { name: "Daniel K.", role: "Staff engineer", status: "Pending", live: false },
  { name: "Priya S.", role: "Head of Support", status: "Approved", live: true },
];

export default function LoginPage() {
  return (
    <main className="flex min-h-svh w-full flex-col bg-background">
      <header className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-4 py-5 sm:px-8">
        <Image
          src="/branding_black.svg"
          alt="Testimony.io"
          width={148}
          height={24}
          priority
          className="h-5 w-auto dark:hidden"
        />
        <Image
          src="/branding_white.svg"
          alt="Testimony.io"
          width={148}
          height={24}
          priority
          className="hidden h-5 w-auto dark:block"
        />
        <a
          href="https://github.com/joaovitorscr/testimony.io"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Open source
          <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
        </a>
      </header>

      <div className="mx-auto grid w-full max-w-[1300px] flex-1 items-center gap-10 px-4 pb-10 sm:px-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
        <LoginForm devPassword={env.NODE_ENV === "development"} />

        <section
          aria-label="Product preview"
          className="flex items-center justify-center rounded-[4px] cursory-wash p-5 sm:p-12"
        >
          <div className="w-full max-w-[640px] overflow-hidden rounded-[10px] bg-chrome shadow-window">
            <div className="flex h-[34px] items-center gap-3 border-b border-border px-3">
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="size-[9px] rounded-full bg-foreground/20" />
                <span className="size-[9px] rounded-full bg-foreground/20" />
                <span className="size-[9px] rounded-full bg-foreground/20" />
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                testimony.io/testimonials
              </span>
            </div>

            <div className="flex flex-col gap-6 bg-panel p-5 sm:p-8">
              <figure className="flex flex-col gap-3">
                <blockquote className="font-serif text-[21px] leading-[1.3] tracking-[-0.01em] text-balance text-foreground">
                  “We pasted one link into our onboarding email. A week later the landing page had
                  twelve real quotes on it.”
                </blockquote>
                <figcaption className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                  Maya R. — Tidepool
                </figcaption>
              </figure>

              <div className="flex flex-col">
                <p className="border-b border-border pb-2 font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  Review queue
                </p>
                <ul>
                  {QUEUE.map(({ name, role, status, live }) => (
                    <li
                      key={name}
                      className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0"
                    >
                      <span className="min-w-0 truncate text-sm text-foreground">
                        {name} <span className="text-muted-foreground">· {role}</span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[2px] bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        <span
                          aria-hidden="true"
                          className={
                            live
                              ? "size-1.5 rounded-full bg-success"
                              : "size-1.5 rounded-full bg-muted-foreground/40"
                          }
                        />
                        {status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
