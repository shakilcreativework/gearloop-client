/**
 * Idempotent seed script — creates the demo account used by the
 * "Try Demo Account" button on the login page.
 *
 * Uses Better Auth's server-side signUp API so the password is
 * properly hashed (bcrypt) and the user row lives in the correct
 * auth database.
 *
 * Usage (from client/):
 *   npm run seed:demo
 *
 * Safe to run multiple times — skips if demo@gearloop.com already exists.
 */

import { auth } from "../lib/auth";
import { betterAuthDb } from "../lib/mongodb-client";

const DEMO_EMAIL = "demo@gearloop.com";
const DEMO_PASSWORD = "Demo1234!";
const DEMO_NAME = "Demo User";

async function main() {
  const existing = await betterAuthDb
    .collection("user")
    .findOne({ email: DEMO_EMAIL });

  if (existing) {
    console.log(`✓ Demo user (${DEMO_EMAIL}) already exists — nothing to do.`);
    process.exit(0);
  }

  const result = await auth.api.signUpEmail({
    body: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      name: DEMO_NAME,
    },
  });

  if (!result.token) {
    console.error("Failed to create demo user — signUpEmail returned no token.");
    process.exit(1);
  }

  console.log(`✓ Demo user created: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Unexpected error seeding demo user:", err);
  process.exit(1);
});
