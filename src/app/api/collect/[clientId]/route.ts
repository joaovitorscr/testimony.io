import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/collect/[clientId]">
) {
  const { clientId } = await ctx.params;

  return Response.json({ clientId });
}
