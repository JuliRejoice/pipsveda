import { NextResponse } from "next/server";

export default function middleware(req) {
  const token = req.cookies.get("userToken");
  const isAuthenticated = !!token;

  const { pathname, origin } = req.nextUrl;

  // Protected routes
  const protectedPaths = [
    "/dashboard",
    "/contact-us",
    "/my-courses",
    "/notification",
    "/paymentHistory",
    "/profile",
    "/telegram",
    "/algobot",
    "/course",
  ];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If not authenticated, block protected routes
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/signin", origin));
  }

  // If authenticated, block auth routes
  if (isAuthenticated && ["/signin", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/course", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/contact-us",
    "/my-courses",
    "/notification",
    "/paymentHistory",
    "/profile",
    "/signin",
    "/signup",

    // Courses routes (with dynamic segments)
    "/course/:path*",
    "/algobot/:path*",
    "/telegram/:path*",
  ],
};

