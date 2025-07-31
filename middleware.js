import { NextResponse } from "next/server";

const protectedRoutes = ["/", "/dashboard", "/pre-recorded"];

export default function middleware(req) {
  const isAuthenticated = req.cookies.has("userToken");
  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ["/", "/dashboard", "/pre-recorded"],
};