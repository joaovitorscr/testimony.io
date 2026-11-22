import { api } from "@convex/_generated/api";
import { DEFAULT_PROMPT } from "@convex/lib/collect";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { cache } from "react";

import { CollectStatus } from "./_components/collect-status";
import { TestimonialForm } from "./_components/testimonial-form";

type Props = { params: Promise<{ slug: string }> };

// Shared by the metadata and the page, so one visit makes one query.
const getForm = cache(async (slug: string) => fetchQuery(api.collect.getForm, { slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const form = await getForm(slug);
  return form.status === "not-found"
    ? { title: "Page not found" }
    : { title: `Share your experience with ${form.project.name}` };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const form = await getForm(slug);

  if (form.status !== "ok") {
    return (
      <CollectStatus
        status={form.status}
        projectName={form.status === "paused" ? form.project.name : undefined}
      />
    );
  }

  const { name, prompt } = form.project;
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-140 flex-col gap-10 px-5 py-16 md:py-24">
      <header className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{name}</p>
        <h1 className="type-hero text-balance">{prompt ?? DEFAULT_PROMPT}</h1>
        <p className="text-fg-2">A few honest sentences are perfect. It takes about a minute.</p>
      </header>

      <TestimonialForm slug={slug} projectName={name} />
    </main>
  );
}
