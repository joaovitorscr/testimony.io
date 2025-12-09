"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cancelToken } from "@/server/actions/token";

export type Token = {
  id: string;
  token: string;
  used: boolean;
  cancelled: boolean;
  createdAt: Date;
  createdBy: string | null;
  description: string | null;
  project: {
    slug: string;
  };
};

function ActionCell({ token }: { token: Token }) {
  const [copied, setCopied] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const copyToClipboard = () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/c/${token.project.slug}?token=${token.token}`;

    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    const result = await cancelToken(token.id);
    setIsCancelling(false);

    if (result.success) {
      toast.success("Link cancelled successfully");
    } else {
      toast.error(result.message || "Failed to cancel link");
    }
  };

  const isActive = !token.used && !token.cancelled;

  return (
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              disabled={!isActive}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy Link</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isActive && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                disabled={isCancelling}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive/90"
              >
                <Ban className="h-4 w-4" />
                <span className="sr-only">Cancel Link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cancel Link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export const columns: ColumnDef<Token>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return (
        <span className="font-medium">
          {description || (
            <span className="text-muted-foreground italic">No description</span>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => row.getValue("createdBy") || "-",
  },
  {
    accessorKey: "used",
    header: "Status",
    cell: ({ row }) => {
      const used = row.original.used;
      const cancelled = row.original.cancelled;

      if (cancelled) {
        return <Badge variant="destructive">Cancelled</Badge>;
      }

      return used ? (
        <Badge variant="secondary">Used</Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-green-500/20 bg-green-500/10 text-green-700 hover:bg-green-500/20"
        >
          Active
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell token={row.original} />,
    header: () => <div className="text-right">Actions</div>,
  },
];
