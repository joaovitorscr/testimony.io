"use client";

import {
  CheckCircle2Icon,
  LinkIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react";
import { api } from "@/trpc/react";

export function StatsHeader() {
  const [stats] = api.token.getStats.useSuspenseQuery();

  return (
    <header className="border-border/60 border-b bg-linear-to-r from-card via-card to-accent/5">
      <div className="px-8 py-8">
        <div className="mb-6">
          <h1 className="font-bold text-3xl tracking-tight">
            Collection Links
          </h1>
          <p className="mt-1 text-muted-foreground">
            Generate unique links to collect testimonials from your customers
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Total Links"
            value={stats.total}
            icon={<LinkIcon className="size-4" />}
            variant="default"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={<SparklesIcon className="size-4" />}
            variant="success"
          />
          <StatCard
            label="Collected"
            value={stats.used}
            icon={<CheckCircle2Icon className="size-4" />}
            variant="info"
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            icon={<XCircleIcon className="size-4" />}
            variant="muted"
          />
        </div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: "default" | "success" | "info" | "muted";
}) {
  const variantStyles = {
    default: "border-border/60 bg-card/80",
    success: "border-emerald-500/20 bg-emerald-500/5",
    info: "border-primary/20 bg-primary/5",
    muted: "border-muted bg-muted/30",
  };

  const valueStyles = {
    default: "text-foreground",
    success: "text-emerald-600 dark:text-emerald-400",
    info: "text-primary",
    muted: "text-muted-foreground",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    success: "text-emerald-600 dark:text-emerald-400",
    info: "text-primary",
    muted: "text-muted-foreground",
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-sm ${variantStyles[variant]}`}
    >
      <div
        className={`rounded-lg bg-background/80 p-2.5 shadow-sm ${iconStyles[variant]}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {label}
        </p>
        <p
          className={`font-bold text-2xl tabular-nums ${valueStyles[variant]}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
