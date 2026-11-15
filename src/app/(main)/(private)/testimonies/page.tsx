import { PageHeading } from "@/components/page-heading";

import { TestimoniesList } from "./_components/testimonies-list";

export default function TestimoniesPage() {
  return (
    <div className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <PageHeading
        title="Testimonies"
        description="Manage your testimonies and collect feedback from your customers."
      />

      <div className="flex flex-1 flex-col px-5 pb-16 md:px-8">
        <TestimoniesList />
      </div>
    </div>
  );
}
