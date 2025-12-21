import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const collectLinkRouter = createTRPCRouter({
  currentProject: protectedProcedure.query(async ({ ctx }) => {
    const projectId = ctx.session.user.activeProjectId;

    if (!projectId) {
      return null;
    }

    const link = await ctx.db.collectLink.findUnique({
      where: {
        projectId,
      },
    });

    if (!link) {
      return null;
    }

    return link;
  }),
  toggleStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Collect Link ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const link = await ctx.db.collectLink.findUnique({
        where: {
          id,
        },
      });

      if (!link) {
        return { success: false, message: "Collect Link not found" };
      }

      await ctx.db.collectLink.update({
        where: {
          id,
        },
        data: {
          isActive: !link?.isActive,
        },
      });

      return { success: true };
    }),
});
