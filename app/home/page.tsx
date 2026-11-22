import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "../page";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

async function AuthenticatedHome() {
  await connection();

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Could not verify the Supabase session for /home:", error.message);
  }
  if (!user) redirect("/auth");

  const metadataName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  const profileName = typeof metadataName === "string" && metadataName.trim()
    ? metadataName
    : user.email?.split("@")[0] ?? "SquadUp member";
  const currency = user.user_metadata?.default_currency;
  const notifications = user.user_metadata?.notification_preference;

  return (
    <AppShell
      initialProfileName={profileName}
      initialProfileEmail={user.email ?? ""}
      initialCurrency={typeof currency === "string" ? currency : "INR"}
      initialNotifications={typeof notifications === "string" ? notifications : "Email & push"}
    />
  );
}

export default function HomePage() {
  if (!getSupabaseConfig()) redirect("/auth?setup=1");

  return (
    <Suspense fallback={<main className="public-route" aria-busy="true"><p>Loading your workspace...</p></main>}>
      <AuthenticatedHome />
    </Suspense>
  );
}
