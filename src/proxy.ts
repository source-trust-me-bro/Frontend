import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk session tokens live about a minute. A development machine whose clock
// has drifted (for example with Windows Time stopped) sees every fresh token as
// expired and loops through Clerk's handshake, so allow extra skew in dev only.
// Production keeps Clerk's default tolerance.
const DEV_CLOCK_SKEW_MS = 5 * 60 * 1000;

export default clerkMiddleware({
  ...(process.env.NODE_ENV === "development"
    ? { clockSkewInMs: DEV_CLOCK_SKEW_MS }
    : {}),
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
