import { NextResponse } from "next/server";

export default function middleware(req) {
  const token = req.cookies.get("userToken");
  const isAuthenticated = !!token;

  const { pathname, origin } = req.nextUrl;

  // If not authenticated, block protected routes
  if (!isAuthenticated && ["/dashboard","/contact-us","/my-courses","/notification","/paymentHistory","/profile"].includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", origin));
  }

  // If authenticated, block auth routes
  if (isAuthenticated && ["/signin", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/courses/pre-recorded", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/courses/pre-recorded", "/signin", "/signup","/contact-us","/my-courses","/notification","/paymentHistory","/profile"  ],
};
