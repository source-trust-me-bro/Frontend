import { NextResponse, type NextRequest } from "next/server";

import { hasSessionToken } from "@/features/news/server/api";
import { getArticleSourceUrl, recordClick } from "@/features/news/server/data";

/**
 * "Read the original": counts the click, then sends the reader to the publisher's own page.
 *
 *   <a href={`/go/${article.id}?c=${communityId}`}>Read the original</a>
 *
 * The browser cannot send the Clerk token to FastAPI on a plain link, so this server route does
 * it. If counting fails the reader is still redirected: a lost count never blocks a reader.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/go/[id]">) {
  const { id } = await ctx.params;
  const fallback = new URL(`/dashboard/articles/${encodeURIComponent(id)}`, request.url);

  if (!(await hasSessionToken())) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const target = await getArticleSourceUrl(id, 4000).catch(() => null);

  // Only real web pages. Newsroom-only stories have no outside page.
  if (!target || !/^https?:\/\//i.test(target)) {
    return NextResponse.redirect(fallback);
  }

  // Never block the reader on a count.
  await recordClick(id, "outbound", request.nextUrl.searchParams.get("c") || null, 1500).catch(
    () => null,
  );

  return NextResponse.redirect(target, 302);
}
