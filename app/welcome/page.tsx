"use client";

import { useRouter } from "next/navigation";
import { OnboardingScreen } from "../page";

export default function WelcomePage() {
  const router = useRouter();
  return <main className="public-route"><OnboardingScreen navigate={(screen) => router.push(screen === "Login / Signup" ? "/auth" : "/home")} /></main>;
}
