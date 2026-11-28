import { PageHeading } from "@/components/page-heading";

import { CollectSettings } from "./_components/collect-settings";

export default function CollectPage() {
  return (
    <div className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-6 lg:px-10">
        <PageHeading
          title="Collect"
          description="One link for every customer. Share it in emails, your app, or anywhere people already talk to you."
        />
        <CollectSettings />
      </div>
    </div>
  );
}
