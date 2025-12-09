import { db } from "@/server/db";
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="font-bold text-2xl text-destructive">Invalid Link</h1>
        <p className="mt-2 text-muted-foreground">
          This link is missing a valid token.
        </p>
      </div>
    );
  }

  const tokenRecord = await db.testimonialToken.findUnique({
    where: { token },
    include: { project: true },
  });

  if (!tokenRecord) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="font-bold text-2xl text-destructive">Invalid Link</h1>
        <p className="mt-2 text-muted-foreground">
          This link is invalid or does not exist.
        </p>
      </div>
    );
  }

  if (tokenRecord.cancelled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="font-bold text-2xl text-destructive">Link Cancelled</h1>
        <p className="mt-2 text-muted-foreground">
          This invitation link has been cancelled by the sender.
        </p>
      </div>
    );
  }

  if (tokenRecord.used) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="font-bold text-2xl text-yellow-600">Link Used</h1>
        <p className="mt-2 text-muted-foreground">
          This invitation link has already been used.
        </p>
      </div>
    );
  }

  if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="font-bold text-2xl text-destructive">Link Expired</h1>
        <p className="mt-2 text-muted-foreground">
          This invitation link has expired.
        </p>
      </div>
    );
  }

  // Validate that the token belongs to the project in the URL
  if (tokenRecord.project.slug !== projectName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="font-bold text-2xl text-destructive">Link Mismatch</h1>
        <p className="mt-2 text-muted-foreground">
          This link does not belong to the requested project.
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-xl rounded-lg border bg-background p-6 shadow-sm md:p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl">
            {tokenRecord.project.name}
          </h1>
          <p className="text-muted-foreground">
            would like to collect a testimonial from you.
          </p>
        </div>

        <TestimonialForm token={token} />
      </div>
    </main>
  );
}
