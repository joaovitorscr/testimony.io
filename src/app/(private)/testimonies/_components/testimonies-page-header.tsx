"use client";

import { api } from "@/trpc/react";

export function TestimoniesPageHeader() {
  const [testimonies] = api.testimonie.all.useSuspenseQuery();

  return (
    <header className="flex h-16 items-center justify-between border-b px-8">
      <div className="flex flex-row items-center gap-3">
        <h2 className="font-semibold text-2xl tracking-tight">Testimonies</h2>
        {testimonies && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
            {testimonies.length} Total
          </span>
        )}
      </div>
      {/* <div className="flex items-center gap-3">
        <div className="relative w-72">
          <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="h-9 rounded-full border-border bg-muted/40 pr-3 pl-8 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-border bg-muted/40 font-medium text-muted-foreground text-xs"
        >
          <SlidersHorizontalIcon className="mr-1.5 size-3.5" />
          Filters
        </Button>
      </div> */}
    </header>
  );
}
