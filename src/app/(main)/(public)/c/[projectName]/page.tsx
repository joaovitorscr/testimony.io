import { api } from "@convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { MessageSquareIcon } from "lucide-react";

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
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-muted/30 via-background to-muted/50 p-4">
      <div className="w-full max-w-xl animate-in duration-500 fade-in-0 slide-in-from-bottom-4">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquareIcon className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{link.project.name}</h1>
          <p className="text-muted-foreground">
            We&apos;d love to hear about your experience. Your feedback helps us improve!
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
          <TestimonialForm token={token} />
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your testimonial may be featured on our website. By submitting, you agree to our terms of
          use.
        </p>
      </div>
    </main>
  );
}
