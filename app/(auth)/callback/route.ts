import { NextResponse } from "next/server";
import { routes } from "@/lib/routes";

/**
 * Legacy callback route - redirects to new /auth/callback route
 */
export async function GET(request: Request) {
  const { search, origin } = new URL(request.url);
  return NextResponse.redirect(new URL(`${routes.auth.callback}${search}`, origin));
}
