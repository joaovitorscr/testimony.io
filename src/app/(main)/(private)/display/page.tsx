import { PageHeading } from "@/components/page-heading";

import { DisplayEditor } from "./_components/display-editor";

export default function DisplayPage() {
  return (
    <div className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <PageHeading
        title="Display"
        description="Choose how approved testimonials look, then paste one snippet into your site."
      />
      <DisplayEditor />
    </div>
  );
}
