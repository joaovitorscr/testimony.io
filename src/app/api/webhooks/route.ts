import type { UserJSON } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id, image_url, email_addresses, first_name, last_name } =
      evt.data as UserJSON;

    // Create user on own database
    await db.user.create({
      data: {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        name: last_name ? `${first_name} ${last_name}` : first_name,
        avatarUrl: image_url,
      },
    });

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
