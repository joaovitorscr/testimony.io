import { TRPCError } from "@trpc/server";
import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

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
  submitTestimonie: publicProcedure
    .input(
      z.object({
        token: z.string().nonempty("Token is required"),
        testimonie: z.object({
          customerName: z.string().min(1, "Name is required"),
          customerCompany: z.string().optional(),
          customerTitle: z.string().optional(),
          rating: z.number().min(1, "Rating is required").max(5),
          text: z
            .string()
            .min(10, "Testimonial must be at least 10 characters"),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { token, testimonie } = input;

      const tokenRecord = await ctx.db.testimonialToken.findUnique({
        where: { token },
        include: { project: true },
      });

      if (!tokenRecord) {
        return { success: false, message: "Invalid token" };
      }

      if (tokenRecord.cancelled) {
        return { success: false, message: "This link has been cancelled" };
      }

      if (tokenRecord.used) {
        return { success: false, message: "This link has already been used" };
      }

      if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
        return { success: false, message: "This link has expired" };
      }

      // Create testimonial
      await ctx.db.testimonial.create({
        data: {
          projectId: tokenRecord.projectId,
          customerName: testimonie.customerName,
          customerCompany: testimonie.customerCompany,
          customerTitle: testimonie.customerTitle,
          rating: testimonie.rating,
          text: testimonie.text,
        },
      });

      // Mark token as used
      await ctx.db.testimonialToken.update({
        where: { id: tokenRecord.id },
        data: { used: true },
      });

      return { success: true };
    }),
});
