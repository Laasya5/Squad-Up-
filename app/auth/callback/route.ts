import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/auth?error=callback", request.url));
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error("Supabase OAuth callback failed:", exchangeError.message);
    return NextResponse.redirect(new URL("/auth?error=callback", request.url));
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    if (userError) console.error("Could not load the signed-in Supabase user:", userError.message);
    return NextResponse.redirect(new URL("/auth?error=callback", request.url));
  }

  const isOnboarded = user.user_metadata?.onboarding_complete === true;
  const destination = isOnboarded ? "/home" : "/welcome";

  return NextResponse.redirect(new URL(destination, request.url));
}
