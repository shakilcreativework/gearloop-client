import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Server-side helper — the ONLY way Server Components / app/api/* routes
 * read the current user. Never call from a "use client" file.
 */
export async function getUserSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}
