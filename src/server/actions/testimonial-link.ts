"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";

export async function updateTestimonialLinkStatus(
  testimonialLinkId: string,
  isActive: boolean,
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
