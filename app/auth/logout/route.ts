import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { routes } from "@/lib/routes";

/**
 * Logout Handler
 * 
 * Signs out the user and redirects to the homepage
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  return NextResponse.redirect(new URL(routes.home, origin));
}

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  return NextResponse.redirect(new URL(routes.home, origin));
}
