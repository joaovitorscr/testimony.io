import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { auth } from "@/server/better-auth";

export const projectRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        OR: [
          { userId: ctx.session.user.id },
          { members: { some: { userId: ctx.session.user.id } } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        slug: z.string().min(3).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, slug } = input;

      const existingProject = await ctx.db.project.findUnique({
        where: {
          slug,
        },
      });

      if (existingProject) {
        return {
          success: false,
          message: "Project with this slug already exists",
        };
      }

      const newProject = await ctx.db.project.create({
        data: {
          userId: ctx.session.user.id,
          name,
          slug,
        },
      });

      // We create the owner role for the user creating the project
      await ctx.db.member.create({
        data: {
          userId: ctx.session.user.id,
          projectId: newProject.id,
          role: "owner",
        },
      });

      // By default, we create a collect link for the project
      const testimonialLink = await ctx.db.testimonialLink.create({
        data: {
          slug,
          projectId: newProject.id,
          thankYouMessage: "Thank you for sharing your experience",
          isActive: false,
        },
      });

      // We update the active project id for the user
      await auth.api.updateUser({
        body: {
          activeProjectId: newProject.id,
        },
        headers: ctx.headers,
      });

      return {
        success: true,
        project: newProject,
        testimonialLink,
      };
    }),
  getCollectLink: protectedProcedure.query(async ({ ctx }) => {
    const testimonialLink = await ctx.db.testimonialLink.findUnique({
      where: {
        projectId: ctx.session.user.activeProjectId,
      },
    });

    if (!testimonialLink) {
      return {
        success: false,
        message: "No collect link found",
      };
    }

    return {
      success: true,
      testimonialLink,
      message: "Collect link fetched successfully",
    };
  }),
});
