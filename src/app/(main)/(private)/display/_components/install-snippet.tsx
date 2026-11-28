"use client";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { env } from "@/env";
import { useCopy } from "@/hooks/use-copy";

/** The HTML to paste into a site: the widget iframe plus the script that sizes it. */
function embedSnippet(appUrl: string, widgetId: string) {
  return `<iframe src="${appUrl}/embed/${widgetId}" title="Testimonials" loading="lazy" style="width:100%;height:480px;border:0"></iframe>
<script src="${appUrl}/embed.js" async></script>`;
}

/** A server-side fetch of the public API, for rendering with the site's own markup. */
function apiSnippet(appUrl: string, widgetId: string) {
  return `// On your server, e.g. in a Next.js Server Component
const res = await fetch("${appUrl}/api/v1/widgets/${widgetId}", {
  next: { revalidate: 60 },
});
if (!res.ok) throw new Error(\`Testimonials: \${res.status}\`);
const { testimonials } = await res.json();
// [{ id, text, name, title, company, rating, avatarUrl, createdAt }]`;
}

/** A recessed code block with a filename bar and a copy button. */
function CodeBlock({ code, label, filename }: { code: string; label: string; filename: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted/60">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-1.5">
        <span className="font-mono text-[11px] text-muted-foreground">{filename}</span>
        <Button
          type="button"
          variant={copied ? "mint" : "ghost"}
          size="sm"
          className="h-6.5 px-2 text-xs"
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
          onClick={() => {
            void copy(code, `${label.charAt(0).toUpperCase()}${label.slice(1)} copied`);
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function InstallSnippet({ widgetId }: { widgetId: string }) {
  const appUrl = env.NEXT_PUBLIC_APP_URL;

  return (
    <section className="rounded-lg border border-border bg-card shadow-2xs">
      <div className="flex flex-col gap-1 border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
          Add it to your site
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Embed the widget with one snippet, or fetch the quotes and render them yourself.
        </p>
      </div>

      <Tabs defaultValue="embed" className="gap-4 p-5">
        <TabsList>
          <TabsTrigger value="embed">Embed</TabsTrigger>
          <TabsTrigger value="api">Public API</TabsTrigger>
        </TabsList>

        <TabsContent value="embed" className="flex flex-col gap-4">
          <p className="max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
            Paste this where the testimonials should appear. It works on any site and resizes to fit
            its content. Changes reach your site on the next page load, within about a minute.
          </p>
          <CodeBlock
            code={embedSnippet(appUrl, widgetId)}
            label="embed code"
            filename="index.html"
          />
          <ul className="flex max-w-3xl list-disc flex-col gap-1 pl-5 text-[13px] text-muted-foreground">
            <li>
              In React or another framework, render the iframe in your component and load the script
              once. The script finds every widget on the page, including ones added later.
            </li>
            <li>
              If your site doesn&apos;t allow scripts, keep only the iframe. It stays at the height
              in its style and scrolls.
            </li>
          </ul>
        </TabsContent>

        <TabsContent value="api" className="flex flex-col gap-4">
          <p className="max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
            Fetch your approved testimonials as JSON and use your own components. Fetching on your
            server puts the quotes in your page&apos;s HTML, where search engines see them. Up to
            100, in the order set above. Changes show within a few minutes.
          </p>
          <CodeBlock code={apiSnippet(appUrl, widgetId)} label="API example" filename="page.tsx" />
        </TabsContent>
      </Tabs>
    </section>
  );
}
