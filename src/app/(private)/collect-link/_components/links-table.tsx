"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { api } from "@/trpc/react";
import { EmptyState } from "./empty-state";

type Token = {
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

export function LinksTable() {
  const [tokens] = api.token.getAll.useSuspenseQuery();

  if (tokens.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Link History</h2>
        <Badge className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
          {tokens.length} {tokens.length === 1 ? "link" : "links"}
        </Badge>
      </div>

      <LinksDataTable data={tokens} />
    </div>
  );
}

function LinksDataTable({ data }: { data: Token[] }) {
  const columns: ColumnDef<Token>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <DescriptionCell token={row.original} />,
    },
    {
      accessorKey: "used",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          used={row.original.used}
          cancelled={row.original.cancelled}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <ActionsCell token={row.original} />,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50">
      <Table>
        <TableHeader className="bg-muted/30">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-border/60 border-b hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-border/40 transition-colors hover:bg-muted/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function DescriptionCell({ token }: { token: Token }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <LinkIcon className="size-4 shrink-0 text-muted-foreground/60" />
        <span className="truncate font-medium">
          {token.description || (
            <span className="text-muted-foreground italic">No description</span>
          )}
        </span>
      </div>
      {token.createdBy && (
        <p className="mt-0.5 text-muted-foreground text-xs">
          by {token.createdBy}
        </p>
      )}
    </div>
  );
}

function StatusBadge({
  used,
  cancelled,
}: {
  used: boolean;
  cancelled: boolean;
}) {
  if (cancelled) {
    return (
      <Badge variant="destructive" className="font-medium">
        Cancelled
      </Badge>
    );
  }

  if (used) {
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

function ActionsCell({ token }: { token: Token }) {
  const [copied, setCopied] = useState(false);
  const utils = api.useUtils();

  const cancelMutation = api.token.cancel.useMutation({
    onSuccess: () => {
      toast.success("Link cancelled");
      void utils.token.getAll.invalidate();
      void utils.token.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel link");
    },
  });

  const isActive = !token.used && !token.cancelled;
  const linkUrl = `${env.NEXT_PUBLIC_APP_URL}/c/${token.project.slug}?token=${token.token}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    cancelMutation.mutate({ id: token.id });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {isActive && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="size-8"
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
        </>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isActive ? (
            <DropdownMenuItem
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="text-destructive focus:text-destructive"
            >
              {cancelMutation.isPending ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <BanIcon className="mr-2 size-4" />
              )}
              Cancel Link
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled className="text-muted-foreground">
              No actions available
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
