import { db } from "@/server/db";
import { LinkStatusCard } from "./_components/link-status-card";
import { TestimonialForm } from "./_components/testimonial-form";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectName: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { projectName } = await params;
  const { token } = await searchParams;

  if (!token) {
    return <LinkStatusCard status="invalid" />;
  }

  const tokenRecord = await db.testimonialToken.findUnique({
    where: { token },
    include: { project: true },
  });

  if (!tokenRecord) {
    return <LinkStatusCard status="not-found" />;
  }

  if (tokenRecord.cancelled) {
    return <LinkStatusCard status="cancelled" />;
  }

  if (tokenRecord.used) {
    return <LinkStatusCard status="used" />;
  }

  if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
    return <LinkStatusCard status="expired" />;
  }

  // Validate that the token belongs to the project in the URL
  if (tokenRecord.project.slug !== projectName) {
    return <LinkStatusCard status="mismatch" />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-muted/30 via-background to-muted/50 p-4">
      <div className="fade-in-0 slide-in-from-bottom-4 w-full max-w-xl animate-in duration-500">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
              role="img"
              aria-label="Testimonial message icon"
            >
              <title>Testimonial</title>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="mb-2 font-bold text-3xl tracking-tight">
            {tokenRecord.project.name}
          </h1>
          <p className="text-muted-foreground">
            We&apos;d love to hear about your experience. Your feedback helps us
            improve!
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
          <TestimonialForm token={token} />
        </div>

        <p className="mt-4 text-center text-muted-foreground text-xs">
          Your testimonial may be featured on our website. By submitting, you
          agree to our terms of use.
        </p>
      </div>
    </main>
  );
}
