import type { ReactNode } from "react";

/** Title block at the top of every dashboard page; `actions` sit on the right. */
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
    <header className="flex flex-wrap items-end justify-between gap-4 px-5 pt-10 pb-8 md:px-8">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="type-hero">{title}</h1>
        {description !== undefined && <p className="text-fg-2">{description}</p>}
      </div>
      {actions !== undefined && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
