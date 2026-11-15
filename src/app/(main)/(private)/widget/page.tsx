import { CopyWidgetId } from "@/components/copy-widget-id";
import { PageHeading } from "@/components/page-heading";

import { WidgetTabs } from "./_components/widget-tabs";

export default function WidgetPage() {
  return (
    <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <PageHeading
        title="Widget"
        description="Configure how your testimonies appear on your website."
        actions={<CopyWidgetId />}
      />

      <WidgetTabs />
    </main>
  );
}
