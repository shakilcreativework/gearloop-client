"use client";

import { authClient } from "@/lib/auth-client";
import type { AuthUser } from "@/types";

/**
 * Client-side hook — the ONLY way "use client" components read the current user.
 * Returns a stable shape so every component that needs auth uses the same path.
 *
 * The `role` field comes from Better Auth's `additionalFields` config
 * (lib/auth.ts) and is included in session responses. We cast to AuthUser
 * because Better Auth's built-in User type does not include custom fields.
 */
export function useCurrentUser() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    user: (session?.user as AuthUser | undefined) ?? null,
    sessionToken: session?.session?.token ?? null,
    isPending,
    error,
  };
}
