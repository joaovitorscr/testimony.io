import { db } from "../db";

export function organizationService() {
  async function createOrganization(payload: {
    id: string;
    name: string;
    image_url: string;
  }) {
    const organization = await db.organization.create({
      data: {
        clerkOrgId: payload.id,
        name: payload.name,
        logoUrl: payload.image_url,
      },
    });

    return organization;
  }

  return { createOrganization };
}
