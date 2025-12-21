import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { collectLinkRouter } from "./routers/collect-link";
import { projectRouter } from "./routers/project";
import { testimonieRouter } from "./routers/testimonie";
import { tokenRouter } from "./routers/token";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  testimonie: testimonieRouter,
  collectLink: collectLinkRouter,
  token: tokenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
