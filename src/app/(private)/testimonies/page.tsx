import {
  SearchIcon,
  SlidersHorizontalIcon,
  StarIcon,
  VideoIcon,
} from "lucide-react";
import { headers } from "next/headers";
import { CollectLink } from "@/components/collect-link";
import { MinimalWidgetEditor } from "@/components/minimal-widget-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getActiveProjectId } from "@/server/actions/active-project";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {["one", "two", "three", "four", "five"].map((label, index) => (
        <StarIcon
          key={label}
          className={`size-3.5 ${
            index < value ? "fill-current" : "text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}

export default async function TestimoniesPage() {
  const [session, activeProjectId] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    getActiveProjectId(),
  ]);

  if (!session) return null;

  if (!activeProjectId) {
    return (
      <div className="flex flex-col items-center justify-center h-svh flex-1">
        <p className="text-muted-foreground">
          Please select a project to view testimonies.
        </p>
      </div>
    );
  }

  const rawTestimonies = await db.testimonial.findMany({
    where: { projectId: activeProjectId },
    orderBy: { createdAt: "desc" },
  });

  const testimonies = rawTestimonies.map((t) => ({
    id: t.id,
    name: t.customerName,
    role:
      [t.customerTitle, t.customerCompany].filter(Boolean).join(" at ") ||
      "Customer",
    avatarInitials: t.customerName.slice(0, 2).toUpperCase(),
    rating: t.rating || 0,
    date: t.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    quote: t.text,
    tags: ["Text"],
    type: "Text",
    avatarUrl: t.customerAvatarUrl,
  }));

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-background/60">
      {/* Page Header */}
      <header className="flex h-16 items-center justify-between border-b px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Testimonies</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {testimonies.length} Total
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="h-9 rounded-full border-border bg-muted/40 pl-8 pr-3 text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-border bg-muted/40 text-xs font-medium text-muted-foreground"
          >
            <SlidersHorizontalIcon className="mr-1.5 size-3.5" />
            Filters
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 gap-6 px-8 py-6">
        {/* Testimonies List */}
        <section className="flex-1 space-y-4">
          {testimonies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <p className="text-lg text-muted-foreground">
                No testimonies found
              </p>

              <Button type="button" size="sm">
                Start Collecting Testimonies
              </Button>
            </div>
          ) : (
            <div>
              {testimonies.map((testimony) => (
                <Card
                  key={testimony.id}
                  className="border-border/80 bg-card/80 shadow-sm"
                >
                  <CardHeader className="flex flex-row items-start gap-4 px-6 pb-4">
                    <div className="flex flex-1 items-start gap-3">
                      <Avatar className="mt-0.5 size-10">
                        <AvatarImage
                          src={testimony.avatarUrl || undefined}
                          alt={testimony.name}
                        />
                        <AvatarFallback className="text-xs font-medium">
                          {testimony.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-semibold">
                          {testimony.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {testimony.role}
                        </CardDescription>
                        <RatingStars value={testimony.rating} />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                      <span>{testimony.date}</span>
                      <Switch checked={true} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      “{testimony.quote}”
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {testimony.type === "Video" && (
                        <Badge variant="outline">
                          <VideoIcon className="mr-1 size-3" />
                          Video
                        </Badge>
                      )}
                      {testimony.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Right Side Widgets */}
        <aside className="flex w-[320px] flex-col gap-4">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <CollectLink />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <MinimalWidgetEditor />
          </Suspense>
        </aside>
      </main>
    </div>
  );
}
