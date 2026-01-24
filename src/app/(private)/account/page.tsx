import type { Route } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { AccountForm } from "./_components/account-form";

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in" as Route);
  }

  return (
    <main className="flex flex-col">
      <header className="px-8 py-4">
        <h1 className="font-bold text-3xl tracking-tight">Account Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </header>

      <section className="flex flex-1 flex-col gap-6 px-8 py-3">
        <AccountForm user={session.user} />
      </section>
    </main>
  );
}
