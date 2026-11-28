"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { PageHeading } from "@/components/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

import { AccountForm } from "./_components/account-form";

export default function AccountPage() {
  const user = useQuery(api.users.me);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-6 lg:px-10">
      <PageHeading title="Account" description="Manage your account settings and preferences." />

      {user === undefined && <Skeleton className="h-56 w-full rounded-lg" />}
      {user !== undefined && user !== null && <AccountForm user={user} />}
    </main>
  );
}
