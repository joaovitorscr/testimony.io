import type { OrganizationJSON, UserJSON } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { organizationService } from "@/server/services/organization.service";
import { userService } from "@/server/services/user.service";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const { id, image_url, email_addresses, first_name, last_name } =
        evt.data as UserJSON;

      const { createUser } = userService();

      await createUser({
        id,
        image_url,
        email_address: email_addresses[0].email_address,
        first_name,
        last_name,
      });
    }

    if (evt.type === "organization.created") {
      const { id, name, image_url } = evt.data as OrganizationJSON;

      const { createOrganization } = organizationService();

      await createOrganization({
        id,
        name,
        image_url: image_url ?? "",
      });
    }

    // Always return success response to avoid retries
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
