"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Client-side hook — the ONLY way "use client" components read the current user.
 * Returns a stable shape so every component that needs auth uses the same path.
 */
export function useCurrentUser() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    user: session?.user ?? null,
    isPending,
    error,
  };
}
