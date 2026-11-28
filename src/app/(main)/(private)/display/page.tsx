import { PageHeading } from "@/components/page-heading";

import { DisplayEditor } from "./_components/display-editor";

export default function DisplayPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-10">
        <PageHeading
          title="Display"
          description="Choose how approved testimonials look, then paste one snippet into your site."
        />
        <DisplayEditor />
      </div>
    </div>
  );
}
