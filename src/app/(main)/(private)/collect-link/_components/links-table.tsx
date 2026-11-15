"use client";

import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
  BanIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LinkIcon,
  Loader2Icon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { env } from "@/env";

import { EmptyState } from "./empty-state";

type Request = Doc<"requests">;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** Every collection link of the project, newest first. */
export function LinksTable({ requests, slug }: { requests: Request[]; slug: string }) {
  if (requests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Link History</h2>
        <Badge className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {requests.length} {requests.length === 1 ? "link" : "links"}
        </Badge>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Description
              </TableHead>
              <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Created
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request._id}
                className="border-border/40 transition-colors hover:bg-muted/20"
              >
                <TableCell className="py-3">
                  <DescriptionCell request={request} />
                </TableCell>
                <TableCell className="py-3">
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="py-3 text-sm text-muted-foreground">
                  {dateFormat.format(request._creationTime)}
                </TableCell>
                <TableCell className="py-3">
                  {request.status === "active" && (
                    <ActiveLinkActions request={request} slug={slug} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DescriptionCell({ request }: { request: Request }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <LinkIcon className="size-4 shrink-0 text-muted-foreground/60" />
        <span className="truncate font-medium">
          {request.description ?? (
            <span className="text-muted-foreground italic">No description</span>
          )}
        </span>
      </div>
      {request.createdBy !== undefined && (
        <p className="mt-0.5 text-xs text-muted-foreground">by {request.createdBy}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Request["status"] }) {
  if (status === "cancelled") {
    return (
      <Badge variant="destructive" className="font-medium">
        Cancelled
      </Badge>
    );
  }

  if (status === "used") {
    return (
      <Badge variant="secondary" className="font-medium">
        Collected
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
    >
      Active
    </Badge>
  );
}

function ActiveLinkActions({ request, slug }: { request: Request; slug: string }) {
  const [copied, setCopied] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const cancelRequest = useMutation(api.requests.cancel);
  const linkUrl = `${env.NEXT_PUBLIC_APP_URL}/c/${slug}?token=${request.token}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelRequest({ id: request._id });
      toast.success("Link cancelled");
    } catch {
      toast.error("Failed to cancel link");
    }
    setIsCancelling(false);
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => {
          void copyToClipboard();
        }}
      >
        {copied ? (
          <CheckIcon className="size-4 text-emerald-500" />
        ) : (
          <CopyIcon className="size-4" />
        )}
        <span className="sr-only">Copy Link</span>
      </Button>

      <Button variant="ghost" size="icon" asChild className="size-8">
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLinkIcon className="size-4" />
          <span className="sr-only">Open Link</span>
        </a>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={isCancelling}
            className="text-destructive focus:text-destructive"
            onClick={() => {
              void handleCancel();
            }}
          >
            {isCancelling ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : (
              <BanIcon className="mr-2 size-4" />
            )}
            Cancel Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
