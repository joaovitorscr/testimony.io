import {
  SearchIcon,
  SlidersHorizontalIcon,
  StarIcon,
  VideoIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const testimonies = [
  {
    id: 1,
    name: "Michael Chen",
    role: "Product Designer at Stripe",
    avatarInitials: "MC",
    rating: 5,
    date: "Oct 24",
    quote:
      "The implementation was incredibly smooth. We managed to collect over 50 video testimonies in just two days. The widget customization is exactly what we needed.",
    tags: ["Video", "Product Launch"],
    type: "Video",
  },
  {
    id: 2,
    name: "Alice Lewis",
    role: "Founder at Bloom",
    avatarInitials: "AL",
    rating: 4,
    date: "Oct 22",
    quote:
      "VOX has transformed how we build social proof. A few minor bugs on mobile, but the team fixed them instantly.",
    tags: ["Text"],
    type: "Text",
  },
  {
    id: 3,
    name: "David Ross",
    role: "CTO at Vercel",
    avatarInitials: "DR",
    rating: 5,
    date: "Oct 20",
    quote:
      "Simply the best tool for gathering feedback in our current stack. Love the dark mode!",
    tags: ["Import"],
    type: "Import",
  },
];

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

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        variant === "default"
          ? "bg-secondary/60 border-transparent text-secondary-foreground"
          : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function FakeSwitch({ on = true }: { on?: boolean }) {
  return (
    <div
      className={`inline-flex h-5 w-9 items-center rounded-full border transition-colors ${
        on
          ? "bg-emerald-500/80 border-emerald-500"
          : "bg-muted border-border opacity-70"
      }`}
    >
      <div
        className={`mx-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
          on ? "translate-x-4" : ""
        }`}
      />
    </div>
  );
}

export default function TestimoniesPage() {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-background/60">
      <header className="flex h-16 items-center justify-between border-b px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Testimonies</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            142 Total
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

      <main className="flex flex-1 gap-6 px-8 py-6">
        <section className="flex-1 space-y-4">
          {testimonies.map((testimony) => (
            <Card
              key={testimony.id}
              className="border-border/80 bg-card/80 shadow-sm"
            >
              <CardHeader className="flex flex-row items-start gap-4 px-6 pb-4">
                <div className="flex flex-1 items-start gap-3">
                  <Avatar className="mt-0.5 size-10">
                    <AvatarImage alt={testimony.name} />
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
                  <FakeSwitch on />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  “{testimony.quote}”
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {testimony.type === "Video" && (
                    <Badge>
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
        </section>

        <aside className="flex w-[320px] flex-col gap-4">
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-sm font-semibold">
                Collect Link
              </CardTitle>
              <CardDescription className="text-xs">
                Share this link to gather new testimonies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-mono text-muted-foreground">
                  vox.app/c/acme-corp
                </div>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="border-border bg-background/60"
                >
                  <SearchIcon className="size-3.5" />
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
              <Separator className="bg-border/60" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Accepting responses
                </span>
                <FakeSwitch on />
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-1 flex-col border-border/80 bg-card/80">
            <CardHeader className="flex items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Widget Editor
                </CardTitle>
                <CardDescription className="text-xs">
                  Preview how your widget looks on your site.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Edit
              </Button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4 pb-4">
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4">
                <div className="space-y-2">
                  <div className="h-2.5 w-24 rounded-full bg-muted" />
                  <div className="h-2 w-40 rounded-full bg-muted/80" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full rounded-full bg-muted/60" />
                  <div className="h-2 w-5/6 rounded-full bg-muted/40" />
                  <div className="h-2 w-2/3 rounded-full bg-muted/40" />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dark Mode</span>
                  <FakeSwitch on />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Show Avatars</span>
                  <FakeSwitch on />
                </div>
                <Button className="mt-1 w-full rounded-full text-xs font-medium">
                  Publish Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
