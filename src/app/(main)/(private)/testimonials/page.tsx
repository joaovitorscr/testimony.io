import { PageHeading } from "@/components/page-heading";

import { TestimonialList } from "./_components/testimonial-list";

export default function TestimonialsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 lg:px-10">
        <PageHeading
          title="Testimonials"
          description="Review what your customers sent. Only approved testimonials appear on your site."
        />
        <TestimonialList />
      </div>
    </div>
  );
}
