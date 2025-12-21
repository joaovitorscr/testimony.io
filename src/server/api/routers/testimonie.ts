import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const testimonieRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const currentProjectId = ctx.session.user.activeProjectId;

    if (!currentProjectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active project selected",
      });
    }

    const testimonies = await ctx.db.testimonial.findMany({
      where: {
        projectId: currentProjectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return testimonies;
  }),
});
