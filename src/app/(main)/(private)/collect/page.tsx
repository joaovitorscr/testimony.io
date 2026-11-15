import { PageHeading } from "@/components/page-heading";

import { CollectSettings } from "./_components/collect-settings";

export default function CollectPage() {
  return (
    <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <PageHeading
        title="Collect"
        description="One link for every customer. Share it in emails, your app, or anywhere people already talk to you."
      />
      <div className="flex flex-col gap-12 px-5 pb-16 md:px-8">
        <CollectSettings />
      </div>
    </main>
  );
}
