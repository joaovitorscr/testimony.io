"use server";

import { z } from "zod";
import { db } from "@/server/db";

const submitTestimonialSchema = z.object({
  token: z.string(),
  customerName: z.string().min(1, "Name is required"),
  customerCompany: z.string().optional(),
  customerTitle: z.string().optional(),
  rating: z.number().min(1, "Rating is required").max(5),
  text: z.string().min(10, "Testimonial must be at least 10 characters"),
});

export async function submitTestimonial(
  input: z.infer<typeof submitTestimonialSchema>
) {
  const validatedData = submitTestimonialSchema.safeParse(input);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { token, customerName, customerCompany, customerTitle, rating, text } =
    validatedData.data;

  try {
    const tokenRecord = await db.testimonialToken.findUnique({
      where: { token },
      include: { project: true },
    });

    if (!tokenRecord) {
      return { success: false, message: "Invalid token" };
    }

    if (tokenRecord.cancelled) {
      return { success: false, message: "This link has been cancelled" };
    }

    if (tokenRecord.used) {
      return { success: false, message: "This link has already been used" };
    }

    if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
      return { success: false, message: "This link has expired" };
    }

    // Create testimonial
    await db.testimonial.create({
      data: {
        projectId: tokenRecord.projectId,
        customerName,
        customerCompany,
        customerTitle,
        rating,
        text,
      },
    });

    // Mark token as used
    await db.testimonialToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit testimonial:", error);
    return { success: false, message: "Failed to submit testimonial" };
  }
}
