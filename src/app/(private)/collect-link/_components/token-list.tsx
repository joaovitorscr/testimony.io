"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, type Token } from "./columns";

export function TokenList({ tokens }: { tokens: Token[] }) {
  if (tokens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            You haven't created any collection links yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          View and manage your generated collection links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={tokens} />
      </CardContent>
    </Card>
  );
}
