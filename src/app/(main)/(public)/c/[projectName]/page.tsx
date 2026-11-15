import { api } from "@convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

import { LinkStatusCard } from "./_components/link-status-card";
import { TestimonialForm } from "./_components/testimonial-form";

export default async function CollectionPage({
  searchParams,
}: {
  params: Promise<{ projectName: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  // The token identifies the link; the slug in the URL is cosmetic so links
  // keep working after a project is renamed.
  const { token } = await searchParams;

  if (token === undefined || token === "") {
    return <LinkStatusCard status="invalid" />;
  }

  const link = await fetchQuery(api.collect.getLink, { token });

  if (link.status !== "ok") {
    return <LinkStatusCard status={link.status} />;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-140 flex-col gap-10 px-5 py-16 md:py-24">
      <header className="flex flex-col gap-3">
        <h1 className="type-hero">{link.project.name}</h1>
        <p className="text-fg-2">
          We&apos;d love to hear about your experience. Your feedback helps us improve.
        </p>
      </header>

      <TestimonialForm token={token} />

      <p className="type-caption text-muted-foreground">
        Your testimonial may be featured on our website. By submitting, you agree to our terms of
        use.
      </p>
    </main>
  );
}
