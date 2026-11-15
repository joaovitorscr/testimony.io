import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmbedWidgetSection } from "./_components/embed-widget-section";

export default function DocumentationPage() {
  return (
    <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <header className="px-8 py-4">
        <h1 className="font-bold text-3xl tracking-tight">Documentation</h1>
        <p className="mt-1 text-muted-foreground">
          Learn how to use the Testimony.io embed widget to display your
          customer testimonials on your own website using an iframe.
        </p>
      </header>

      <div className="space-y-8 px-8 py-4">
        <section className="max-w-3xl space-y-4">
          <h2 className="font-bold text-2xl tracking-tight">
            Before you embed
          </h2>
          <p className="text-muted-foreground">
            Make sure you have completed these steps so the widget loads
            correctly on your site.
          </p>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allow your domain</CardTitle>
              <CardDescription>
                For security, the widget only loads on domains you have
                approved. In{" "}
                <Link
                  href="/widget?t=domains"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Widget → Domains
                </Link>
                , add the full URL of the site where you will embed the widget
                (e.g.{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                  https://example.com
                </code>
                ). If your domain is not in the list, visitors will see “Widget
                is not authorized for this domain.”
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="font-bold text-2xl tracking-tight">
            Add the widget to your site
          </h2>
          <p className="text-muted-foreground">
            Use an iframe to embed the testimonial widget. Paste the code below
            into your HTML where you want the testimonials to appear. You can
            change{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              width
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              height
            </code>{" "}
            to fit your layout.
          </p>
          <Suspense fallback={<Skeleton className="h-48 w-full rounded-xl" />}>
            <EmbedWidgetSection />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
