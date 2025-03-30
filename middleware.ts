import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Handle profile route protection
    const isProfileRoute = req.nextUrl.pathname.startsWith("/profile");
    const isAuthRoute = req.nextUrl.pathname.startsWith("/sign-in") || 
                       req.nextUrl.pathname.startsWith("/sign-up");
    const isAuthenticated = !!req.nextauth.token;

    if (isProfileRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/profile/" + req.nextauth.token?.name, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
