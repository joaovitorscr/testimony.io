import type { ReactNode } from "react";

/**
 * Title block at the top of every dashboard page; `actions` sit on the right.
 * Place it inside the page container, which sets the width and side padding.
 */
export function PageHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div className="flex max-w-2xl flex-col gap-1.5">
        <h1 className="font-display text-[26px] leading-[1.2] font-normal tracking-[-0.02em] text-foreground sm:text-[32px]">
          {title}
        </h1>
        {description !== undefined && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actions !== undefined && <div className="flex items-center gap-2.5">{actions}</div>}
    </header>
  );
}
