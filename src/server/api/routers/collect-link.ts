import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const collectLinkRouter = createTRPCRouter({
  currentProject: protectedProcedure.query(async ({ ctx }) => {
    const projectId = ctx.session.user.activeProjectId;

    if (!projectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active project selected",
      });
    }

    const link = await ctx.db.collectLink.findUnique({
      where: {
        projectId,
      },
    });

    if (!link) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Collect link not found",
      });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Collect link not found",
        });
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
