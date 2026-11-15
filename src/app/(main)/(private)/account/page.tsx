"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { PageHeading } from "@/components/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

import { AccountForm } from "./_components/account-form";

export default function AccountPage() {
  const user = useQuery(api.users.me);

  return (
    <main className="flex flex-col">
      <PageHeading title="Account" description="Manage your account settings and preferences." />

      <section className="flex max-w-2xl flex-col px-5 pb-16 md:px-8">
        {user === undefined && <Skeleton className="h-48 w-full rounded-lg" />}
        {user !== undefined && user !== null && <AccountForm user={user} />}
      </section>
    </main>
  );
}
