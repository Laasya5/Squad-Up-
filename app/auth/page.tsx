"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthScreen } from "../page";

export default function AuthPage() {
  const router = useRouter();
  const [signupInitially, setSignupInitially] = useState(true);
  const [returnTo, setReturnTo] = useState("/home");

  useEffect(() => {
    let active = true;
    if (isSupabaseConfigured()) {
      createClient().auth.getSession().then(({ data, error }) => {
        if (error) {
          if (active) console.error("Could not check the current Supabase session:", error.message);
        } else if (active && data.session?.user) {
          router.replace("/home");
        }
      }).catch((error: unknown) => {
        if (active) console.error("Could not check the current Supabase session:", error);
      });
    }
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setSignupInitially(params.get("mode") !== "login");
      if (params.get("next") === "/home") setReturnTo("/home");
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [router]);

  return <main className="public-route"><AuthScreen key={signupInitially ? "signup" : "login"} signupInitially={signupInitially} navigate={(screen) => router.push(screen === "Onboarding" ? "/welcome" : screen === "Landing Page" ? "/" : returnTo)} /></main>;
}
