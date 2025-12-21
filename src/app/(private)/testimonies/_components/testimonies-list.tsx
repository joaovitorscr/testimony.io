"use client";

import { format } from "date-fns";
import { StarIcon } from "lucide-react";
import Link from "next/link";
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
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";
import type { Testimonial } from "../../../../../generated/prisma/client";

export function TestimoniesList() {
  const [testimonies] = api.testimonie.all.useSuspenseQuery();

  if (testimonies.length === 0) {
    return (
      <section className="flex h-full flex-1 flex-col items-center justify-center space-y-4">
        <div className="space-y-1 text-center">
          <h2 className="font-medium text-lg text-muted-foreground">
            No Testimonies Found
          </h2>
          <p className="text-muted-foreground text-sm">
            No testimonies have been collected yet.
          </p>
        </div>
        <Button>
          <Link href="/collect-link">Start Collecting Testimonies</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="flex-1 space-y-4">
      {testimonies.map((testimony) => (
        <TestimonieCard key={testimony.id} testimony={testimony} />
      ))}
    </section>
  );
}

export function TestimonieCard({ testimony }: { testimony: Testimonial }) {
  return (
    <Card className="border-border/80 bg-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-start gap-4 px-6 pb-4">
        <div className="flex flex-1 items-start gap-3">
          <Avatar className="mt-0.5 size-10">
            <AvatarImage
              src={testimony.customerAvatarUrl || undefined}
              alt={testimony.customerName}
            />
            <AvatarFallback className="font-medium text-xs">
              {testimony.customerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="font-semibold text-sm">
              {testimony.customerName}
            </CardTitle>
            <CardDescription className="text-xs">
              {testimony.customerTitle}
            </CardDescription>
            <RatingStars value={testimony.rating || 0} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-muted-foreground text-xs">
          <span>{format(testimony.createdAt, "MMM d, yyyy")}</span>
          <Switch checked={true} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        <p className="text-muted-foreground text-sm leading-relaxed">
          “{testimony.text}”
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {testimony.customerCompany && (
            <Badge variant="outline">{testimony.customerCompany}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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
