import { createTRPCRouter, protectedProcedure } from "../trpc";

export const testimonieRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const currentProjectId = ctx.session.user.activeProjectId;

    if (!currentProjectId) {
      return [];
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
