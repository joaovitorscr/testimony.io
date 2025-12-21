import { TRPCError } from "@trpc/server";
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
      const testimonialLink = await ctx.db.collectLink.create({
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
    if (!ctx.session.user.activeProjectId) {
      return {
        success: false,
        message: "No active project selected",
      };
    }

    const testimonialLink = await ctx.db.collectLink.findUnique({
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
  currentProject: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.activeProjectId) {
      return null;
    }

    const project = await ctx.db.project.findUnique({
      where: {
        id: ctx.session.user.activeProjectId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        invitations: true,
      },
    });

    if (!project) {
      return null;
    }

    return project;
  }),
  inviteUser: protectedProcedure
    .input(
      z.object({
        email: z.email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.activeProjectId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active project selected",
        });
      }

      const email = input.email.toLowerCase().trim();

      if (ctx.session.user.email === email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot invite yourself",
        });
      }

      const existingUser = await ctx.db.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const existingInvitation = await ctx.db.invitation.findFirst({
        where: {
          email,
          projectId: ctx.session.user.activeProjectId,
        },
      });

      if (existingInvitation) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invitation already exists",
        });
      }

      const invitation = await ctx.db.invitation.create({
        data: {
          email,
          projectId: ctx.session.user.activeProjectId,
          role: "member",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          inviterId: ctx.session.user.id,
        },
      });

      return {
        success: true,
        invitation,
      };
    }),
});
