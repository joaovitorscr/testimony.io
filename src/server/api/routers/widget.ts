import { TRPCError } from "@trpc/server";
import z from "zod";
import { widgetConfigFormSchema } from "@/lib/schemas/widget";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const widgetRouter = createTRPCRouter({
  registerWidgetDomains: protectedProcedure
    .input(
      z.object({
        widgetId: z.uuid(),
        domains: z.array(z.url("Invalid URL format")),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.activeProjectId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active project selected",
        });
      }

      const updatedWidget = await ctx.db.widgetConfig.update({
        where: {
          id: input.widgetId,
          projectId: ctx.session.user.activeProjectId,
        },
        data: {
          allowedDomains: {
            set: input.domains,
          },
        },
      });

      return updatedWidget;
    }),
  getWidgetConfig: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.activeProjectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active project selected",
      });
    }

    const widgetConfig = await ctx.db.widgetConfig.findUnique({
      where: {
        projectId: ctx.session.user.activeProjectId,
      },
    });

    return widgetConfig;
  }),
  updateWidgetConfig: protectedProcedure
    .input(
      z.object({
        config: widgetConfigFormSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.activeProjectId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active project selected",
        });
      }

      const { config } = input;

      const updatedWidgetConfig = await ctx.db.widgetConfig
        .update({
          where: {
            projectId: ctx.session.user.activeProjectId,
          },
          data: {
            ...config,
            speedMs: config.speedMs[0],
          },
        })
        .catch((error) => {
          console.error(error);
        });

      return updatedWidgetConfig;
    }),
  getWidgetContent: publicProcedure
    .input(
      z.object({
        widgetId: z.uuid(),
        domain: z.url().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { widgetId, domain: embedDomain } = input;

      const widget = await ctx.db.widgetConfig.findUnique({
        where: {
          id: widgetId,
        },
        select: {
          id: true,
          allowedDomains: true,
          project: {
            select: {
              testimonials: true,
              id: true,
            },
          },
        },
      });

      if (!widget) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Widget not found",
        });
      }

      // --- Domain Validation ---
      let isDomainAllowed = false;

      const normalizedEmbedDomain = embedDomain
        ? new URL(embedDomain).hostname.replace(/^www\./, "")
        : null;

      if (widget.allowedDomains && widget.allowedDomains.length > 0) {
        // Check against registered domains
        isDomainAllowed = widget.allowedDomains.some((allowed) => {
          const normalizedAllowed = new URL(allowed).hostname.replace(
            /^www\./,
            ""
          );

          return normalizedAllowed === normalizedEmbedDomain;
        });
      } else {
        // Default error for a widget that has no allowed domains

        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No allowed domains registered for this widget.",
        });
      }

      // Domain is not allowed, throw an error
      if (!isDomainAllowed) {
        console.warn(
          `Widget ${widgetId} blocked for unauthorized domain: ${embedDomain}`
        );

        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Widget is not authorized for this domain.",
        });
      }

      const widgetConfig = await ctx.db.widgetConfig.findUnique({
        where: {
          projectId: widget.project.id,
        },
      });

      // --- Render Widget HTML (Server-Side) ---
      const React = require("react");
      const ReactDOMServer = require("react-dom/server");
      const TestimonialWidget =
        require("../../../components/widgets/testimonie-widget").default;

      const widgetHtml = ReactDOMServer.renderToString(
        React.createElement(TestimonialWidget, {
          testimonies: widget.project.testimonials,
          widgetConfig: widgetConfig,
        })
      );

      return { html: widgetHtml };
    }),
});
