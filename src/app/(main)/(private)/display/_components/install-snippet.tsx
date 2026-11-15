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

/** A code block with a copy button. */
function CodeBlock({ code, label }: { code: string; label: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 pr-14 font-mono text-sm">
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
    </section>
  );
}
