import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Protects the product details and profile pages.
// (On Next.js 15 or older, rename this file to middleware.js
// and rename the function to `middleware`.)
export function proxy(req) {
  if (!getSessionCookie(req)) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("redirected", "1");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
