import Link from "next/link";
import { Suspense } from "react";

import { PageHeading } from "@/components/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

import { EmbedWidgetSection } from "./_components/embed-widget-section";

const inlineCode = "rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm";

export default function DocumentationPage() {
  return (
    <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <PageHeading
        title="Documentation"
        description="Learn how to use the Testimony.io embed widget to display your customer testimonials on your own website using an iframe."
      />

      <div className="flex max-w-3xl flex-col gap-12 px-5 pb-16 md:px-8">
        <section className="flex flex-col gap-4">
          <h2 className="type-title text-fg-2">Before you embed</h2>
          <p className="text-fg-2">
            Make sure you have completed these steps so the widget loads correctly on your site.
          </p>
          <h3 className="font-medium">Allow your domain</h3>
          <p className="text-fg-2">
            For security, the widget only loads on domains you have approved. In{" "}
            <Link href="/widget?t=domains" className="underline underline-offset-4">
              Widget → Domains
            </Link>
            , add the full URL of the site where you will embed the widget (e.g.{" "}
            <code className={inlineCode}>https://example.com</code>). If your domain is not in the
            list, visitors will see “Widget is not authorized for this domain.”
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="type-title text-fg-2">Add the widget to your site</h2>
          <p className="text-fg-2">
            Use an iframe to embed the testimonial widget. Paste the code below into your HTML where
            you want the testimonials to appear. You can change{" "}
            <code className={inlineCode}>width</code> and <code className={inlineCode}>height</code>{" "}
            to fit your layout.
          </p>
          <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
            <EmbedWidgetSection />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
