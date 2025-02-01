import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/"])

export default clerkMiddleware(async (auth, request) => {

  const url = new URL(request.url)
  const res = NextResponse.next()

  if (url.pathname.startsWith("/api/uploadthing")) return res;

  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  return res
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    "/api/:path"
  ],
};