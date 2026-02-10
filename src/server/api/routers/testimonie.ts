import { TRPCError } from "@trpc/server";
import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const filterSchema = z.enum(["all", "approved", "pending", "featured"]);

export type TestimonyFilter = z.infer<typeof filterSchema>;

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
  infinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().nullish(),
        filter: filterSchema.default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentProjectId = ctx.session.user.activeProjectId;

      if (!currentProjectId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active project selected",
        });
      }

      const { limit, cursor, filter } = input;

      // Build filter conditions
      const filterConditions = (() => {
        switch (filter) {
          case "approved":
            return { isApproved: true };
          case "pending":
            return { isApproved: false };
          case "featured":
            return { isFeatured: true };
          default:
            return {};
        }
      })();

      const testimonies = await ctx.db.testimonial.findMany({
        where: {
          projectId: currentProjectId,
          ...filterConditions,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor;
      if (testimonies.length > limit) {
        const nextItem = testimonies.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: testimonies,
        nextCursor,
      };
    }),
  submitTestimonie: publicProcedure
    .input(
      z.object({
        token: z.string().nonempty("Token is required"),
        testimonie: z.object({
          customerName: z.string().min(1, "Name is required"),
          customerCompany: z.string().optional(),
          customerTitle: z.string().optional(),
          avatarBase64: z.string().optional(),
          rating: z.number().min(1, "Rating is required").max(5),
          text: z
            .string()
            .min(10, "Testimonial must be at least 10 characters"),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const LOG_TAG = "[submitTestimonie]";
      const { token, testimonie } = input;

      try {
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

        try {
          await ctx.db.testimonial.create({
            data: {
              projectId: tokenRecord.projectId,
              customerName: testimonie.customerName,
              customerCompany: testimonie.customerCompany,
              customerTitle: testimonie.customerTitle,
              customerAvatarUrl: testimonie.avatarBase64,
              rating: testimonie.rating,
              text: testimonie.text,
            },
          });
        } catch (dbError) {
          const err = dbError as { code?: string; message?: string };
          console.error(LOG_TAG, "Failed to create testimonial", {
            projectId: tokenRecord.projectId,
            code: err.code,
            message: err.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              err.code === "P2003"
                ? "Invalid project reference. Please use a valid collect link."
                : err.code === "P2002"
                ? "A testimonial with this id already exists. Please try again."
                : "Failed to save testimonial. Please try again.",
            cause: dbError,
          });
        }

        try {
          await ctx.db.testimonialToken.update({
            where: { id: tokenRecord.id },
            data: { used: true },
          });
        } catch (dbError) {
          const err = dbError as { code?: string; message?: string };
          console.error(LOG_TAG, "Failed to mark token as used", {
            tokenId: tokenRecord.id,
            code: err.code,
            message: err.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Testimonial was saved but we could not finalize. Please contact support.",
            cause: dbError,
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        const err = error as Error;
        console.error(LOG_TAG, "Unexpected error", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message || "Something went wrong. Please try again.",
          cause: error,
        });
      }
    }),
  toggleFeatured: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Testimony ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const testimony = await ctx.db.testimonial.findUnique({
        where: { id },
      });

      if (!testimony) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Testimony not found",
        });
      }

      await ctx.db.testimonial.update({
        where: { id },
        data: { isFeatured: !testimony.isFeatured },
      });

      return { success: true };
    }),
  toggleApproved: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Testimony ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const testimony = await ctx.db.testimonial.findUnique({
        where: { id },
      });

      if (!testimony) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Testimony not found",
        });
      }

      await ctx.db.testimonial.update({
        where: { id },
        data: { isApproved: !testimony.isApproved },
      });
    }),
});
