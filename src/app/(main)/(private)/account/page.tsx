"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountForm } from "./_components/account-form";

export default function AccountPage() {
  const user = useQuery(api.users.me);

  return (
    <main className="flex flex-col">
      <header className="px-8 py-4">
        <h1 className="font-bold text-3xl tracking-tight">Account Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </header>

      <section className="flex flex-1 flex-col gap-6 px-8 py-3">
        {user === undefined ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : user === null ? null : (
          <AccountForm user={user} />
        )}
      </section>
    </main>
  );
}
