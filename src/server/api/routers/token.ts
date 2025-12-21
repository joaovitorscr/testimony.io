import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tokenRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projectId = ctx.session.user.activeProjectId;

    if (!projectId) {
      return [];
    }

    const tokens = await ctx.db.testimonialToken.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            slug: true,
          },
        },
      },
    });

    return tokens;
  }),
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const projectId = ctx.session.user.activeProjectId;

    if (!projectId) {
      return {
        total: 0,
        active: 0,
        used: 0,
        cancelled: 0,
      };
    }

    const tokens = await ctx.db.testimonialToken.findMany({
      where: { projectId },
      select: {
        used: true,
        cancelled: true,
      },
    });

    return {
      total: tokens.length,
      active: tokens.filter((t) => !t.used && !t.cancelled).length,
      used: tokens.filter((t) => t.used).length,
      cancelled: tokens.filter((t) => t.cancelled).length,
    };
  }),

  create: protectedProcedure
    .input(
      z.object({
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const projectId = ctx.session.user.activeProjectId;

      if (!projectId) {
        throw new Error("No active project selected");
      }

      const token = await ctx.db.testimonialToken.create({
        data: {
          projectId,
          description: input.description,
          createdBy: ctx.session.user.name || ctx.session.user.email,
          token:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
        },
        include: {
          project: {
            select: {
              slug: true,
            },
          },
        },
      });

      return token;
    }),
  cancel: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Token ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const projectId = ctx.session.user.activeProjectId;

      if (!projectId) {
        throw new Error("No active project selected");
      }

      const token = await ctx.db.testimonialToken.findUnique({
        where: { id: input.id },
      });

      if (!token) {
        throw new Error("Token not found");
      }

      if (token.projectId !== projectId) {
        throw new Error("Unauthorized");
      }

      await ctx.db.testimonialToken.update({
        where: { id: input.id },
        data: { cancelled: true },
      });

      return { success: true };
    }),
});
