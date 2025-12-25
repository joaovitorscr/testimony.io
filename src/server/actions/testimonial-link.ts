"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";

export async function updateTestimonialLinkStatus(
  testimonialLinkId: string,
  isActive: boolean
) {
  await db.collectLink.update({
    where: {
      id: testimonialLinkId,
    },
    data: {
      isActive,
    },
  });
  revalidatePath("/testimonies");
}
