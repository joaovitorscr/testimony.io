import { PageHeading } from "@/components/page-heading";

import { TestimonialList } from "./_components/testimonial-list";

export default function TestimonialsPage() {
  return (
    <div className="flex min-h-svh flex-1 flex-col overflow-y-auto">
      <PageHeading
        title="Testimonials"
        description="Review what your customers sent. Only approved testimonials appear on your site."
      />

      <div className="flex flex-1 flex-col px-5 pb-16 md:px-8">
        <TestimonialList />
      </div>
    </div>
  );
}
