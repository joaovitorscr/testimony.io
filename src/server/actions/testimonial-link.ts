"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function updateTestimonialLinkStatus(
  testimonialLinkId: string,
  isActive: boolean
) {
  await db.testimonialLink.update({
    where: {
      id: testimonialLinkId,
    },
    data: {
      isActive,
    },
  });
  revalidatePath("/testimonies");
}

