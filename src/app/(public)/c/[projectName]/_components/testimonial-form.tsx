"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitTestimonial } from "@/server/actions/testimonial";

const testimonialSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerCompany: z.string().optional(),
  customerTitle: z.string().optional(),
  rating: z.number().min(1, "Please rate your experience").max(5),
  text: z.string().min(10, "Please provide more detail (at least 10 chars)"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export function TestimonialForm({ token }: { token: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      customerName: "",
      customerCompany: "",
      customerTitle: "",
      rating: 0,
      text: "",
    },
  });

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsSubmitting(true);
    const result = await submitTestimonial({ ...values, token });
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      toast.success("Testimonial submitted successfully!");
    } else {
      toast.error(result.message || "Failed to submit testimonial");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <h2 className="font-bold text-2xl">Thank You!</h2>
        <p className="text-muted-foreground">
          Your testimonial has been received.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      <FieldGroup>
        {/* Rating */}
        <Controller
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Rating</FieldLabel>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => field.onChange(star)}
                    className={`rounded-full p-1 transition-colors ${
                      field.value >= star
                        ? "text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    <StarIcon
                      className={`h-8 w-8 ${
                        field.value >= star ? "fill-primary" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text">Your Testimonial</FieldLabel>
              <Textarea
                {...field}
                id="text"
                placeholder="Share your experience..."
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="customerName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customerName">Your Name</FieldLabel>
              <Input {...field} id="customerName" placeholder="John Doe" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="customerTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerTitle">
                  Job Title (Optional)
                </FieldLabel>
                <Input {...field} id="customerTitle" placeholder="CEO" />
              </Field>
            )}
          />

          <Controller
            name="customerCompany"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerCompany">
                  Company (Optional)
                </FieldLabel>
                <Input
                  {...field}
                  id="customerCompany"
                  placeholder="Acme Inc."
                />
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Testimonial"}
      </Button>
    </form>
  );
}
