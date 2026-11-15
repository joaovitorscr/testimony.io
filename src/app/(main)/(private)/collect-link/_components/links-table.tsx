"use client";

import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { BanIcon, CheckIcon, CopyIcon, ExternalLinkIcon, MoreHorizontalIcon } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
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
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="type-title text-fg-2">Link history</h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {requests.length} {requests.length === 1 ? "link" : "links"}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-0 text-xs font-normal text-muted-foreground">
              Description
            </TableHead>
            <TableHead className="text-xs font-normal text-muted-foreground">Status</TableHead>
            <TableHead className="text-xs font-normal text-muted-foreground">Created</TableHead>
            <TableHead className="pr-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request._id} className="hover:bg-transparent">
              <TableCell className="py-3 pl-0">
                <DescriptionCell request={request} />
              </TableCell>
              <TableCell className="py-3">
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell className="py-3 text-muted-foreground tabular-nums">
                {dateFormat.format(request._creationTime)}
              </TableCell>
              <TableCell className="py-3 pr-0">
                {request.status === "active" && <ActiveLinkActions request={request} slug={slug} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function DescriptionCell({ request }: { request: Request }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate">
        {request.description ?? <span className="text-muted-foreground">No description</span>}
      </span>
      {request.createdBy !== undefined && (
        <span className="type-caption text-muted-foreground">by {request.createdBy}</span>
      )}
    </div>
  );
}

/** Ink for links still out in the world, pale once collected, outlined and muted once cancelled. */
function StatusBadge({ status }: { status: Request["status"] }) {
  if (status === "cancelled") {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Cancelled
      </Badge>
    );
  }

  if (status === "used") {
    return <Badge variant="secondary">Collected</Badge>;
  }

  return <Badge>Active</Badge>;
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
        size="icon-sm"
        onClick={() => {
          void copyToClipboard();
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className="sr-only">Copy link</span>
      </Button>

      <Button variant="ghost" size="icon-sm" asChild>
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLinkIcon />
          <span className="sr-only">Open link</span>
        </a>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            disabled={isCancelling}
            onClick={() => {
              void handleCancel();
            }}
          >
            {isCancelling ? <Spinner /> : <BanIcon />}
            Cancel link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
