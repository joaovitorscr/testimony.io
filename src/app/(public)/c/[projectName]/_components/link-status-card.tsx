"use client";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  LinkIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LinkStatus =
  | "invalid"
  | "not-found"
  | "cancelled"
  | "used"
  | "expired"
  | "mismatch";

interface LinkStatusCardProps {
  status: LinkStatus;
  className?: string;
}

const statusConfig: Record<
  LinkStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    badge: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
    iconBg: string;
    iconColor: string;
    accentBorder: string;
  }
> = {
  invalid: {
    icon: LinkIcon,
    title: "Invalid Link",
    description:
      "This link is missing a valid token. Please check that you have the complete URL or request a new invitation link.",
    badge: "Invalid",
    badgeVariant: "destructive",
    iconBg: "bg-red-100 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
    accentBorder: "border-l-red-500",
  },
  "not-found": {
    icon: XCircleIcon,
    title: "Link Not Found",
    description:
      "This invitation link doesn't exist or may have been removed. Please contact the sender for a new link.",
    badge: "Not Found",
    badgeVariant: "destructive",
    iconBg: "bg-red-100 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
    accentBorder: "border-l-red-500",
  },
  cancelled: {
    icon: XCircleIcon,
    title: "Link Cancelled",
    description:
      "This invitation link has been cancelled by the sender. If you believe this is an error, please reach out to them directly.",
    badge: "Cancelled",
    badgeVariant: "secondary",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-600 dark:text-slate-400",
    accentBorder: "border-l-slate-400",
  },
  used: {
    icon: CheckCircle2Icon,
    title: "Already Submitted",
    description:
      "A testimonial has already been submitted using this link. Each invitation link can only be used once.",
    badge: "Used",
    badgeVariant: "default",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-l-emerald-500",
  },
  expired: {
    icon: ClockIcon,
    title: "Link Expired",
    description:
      "This invitation link has passed its expiration date. Please request a new invitation link from the sender.",
    badge: "Expired",
    badgeVariant: "secondary",
    iconBg: "bg-amber-100 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-l-amber-500",
  },
  mismatch: {
    icon: AlertTriangleIcon,
    title: "Link Mismatch",
    description:
      "This invitation link doesn't match the requested project. Please verify you're using the correct URL.",
    badge: "Error",
    badgeVariant: "destructive",
    iconBg: "bg-orange-100 dark:bg-orange-950/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    accentBorder: "border-l-orange-500",
  },
};

export function LinkStatusCard({ status, className }: LinkStatusCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-linear-to-br from-muted/30 via-background to-muted/50 p-4",
        className
      )}
    >
      <Card
        className={cn(
          "fade-in-0 slide-in-from-bottom-4 w-full max-w-md animate-in border-l-4 duration-500",
          config.accentBorder
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl",
                config.iconBg
              )}
            >
              <Icon className={cn("h-7 w-7", config.iconColor)} />
            </div>
            <Badge variant={config.badgeVariant} className="shrink-0">
              {config.badge}
            </Badge>
          </div>
          <CardTitle className="mt-4 text-xl">{config.title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {config.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground">Need help?</span>{" "}
              Contact the person who sent you this invitation link for
              assistance.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
