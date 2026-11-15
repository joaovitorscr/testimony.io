"use client";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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

/** A code block with a copy button. */
function CodeBlock({ code, label }: { code: string; label: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="relative rounded-lg bg-muted">
      {/* Ends before the copy button, so long lines never scroll under it. */}
      <pre className="mr-12 overflow-x-auto p-4 font-mono text-sm">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2"
        aria-label={`Copy ${label}`}
        onClick={() => {
          void copy(code, `${label.charAt(0).toUpperCase()}${label.slice(1)} copied`);
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}

export function InstallSnippet({ widgetId }: { widgetId: string }) {
  const appUrl = env.NEXT_PUBLIC_APP_URL;

  return (
    <section className="flex max-w-3xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="type-title text-fg-2">Add it to your site</h2>
        <p className="text-sm text-muted-foreground">
          Paste this where the testimonials should appear. It works on any site and resizes to fit
          its content. Changes reach your site on the next page load, within about a minute.
        </p>
      </div>
      <CodeBlock code={embedSnippet(appUrl, widgetId)} label="embed code" />
      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
        <li>
          In React or another framework, render the iframe in your component and load the script
          once. The script finds every widget on the page, including ones added later.
        </li>
        <li>
          If your site doesn&apos;t allow scripts, keep only the iframe. It stays at the height in
          its style and scrolls.
        </li>
      </ul>

      <div className="mt-8 flex flex-col gap-1">
        <h3 className="font-medium text-fg-2">Or render them yourself</h3>
        <p className="text-sm text-muted-foreground">
          Fetch your approved testimonials as JSON and use your own components. Fetching on your
          server puts the quotes in your page&apos;s HTML, where search engines see them. Up to 100,
          in the order set above. Changes show within a few minutes.
        </p>
      </div>
      <CodeBlock code={apiSnippet(appUrl, widgetId)} label="API example" />
    </section>
  );
}
