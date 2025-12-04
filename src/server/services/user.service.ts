import type { CreateUserPayload } from "@/types/user";
import { db } from "../db";

export function userService() {
  async function createUser(payload: CreateUserPayload) {
    const user = await db.user.create({
      data: {
        clerkUserId: payload.id,
        email: payload.email_address,
        name: payload.first_name
          ? `${payload.first_name} ${payload.last_name}`
          : undefined,
        avatarUrl: payload.image_url,
      },
    });

    return user;
  }

  return { createUser };
}
