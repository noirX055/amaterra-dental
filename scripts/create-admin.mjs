#!/usr/bin/env node
/**
 * Register an admin user in Supabase Auth.
 *
 * Usage:
 *   node scripts/create-admin.mjs <email> <password>
 *
 * Example:
 *   node scripts/create-admin.mjs info@amaterra.md amaterra2026.md
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Parse .env.local ──────────────────────────────────────────
const envPath = resolve(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");

function envGet(key) {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, "m"));
  return match ? match[1].trim() : undefined;
}

const supabaseUrl = envGet("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = envGet("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "\n❌  Missing environment variables.\n" +
      "   Make sure .env.local contains:\n" +
      "     NEXT_PUBLIC_SUPABASE_URL=...\n" +
      "     SUPABASE_SERVICE_ROLE_KEY=...\n\n" +
      "   Find the service role key at:\n" +
      "   https://supabase.com/dashboard/project/nqscykqhubvfgvtfhqpr/settings/api\n"
  );
  process.exit(1);
}

// ── Read CLI args ─────────────────────────────────────────────
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error(
    "\n❌  Usage: node scripts/create-admin.mjs <email> <password>\n" +
      "   Example: node scripts/create-admin.mjs info@amaterra.md amaterra2026.md\n"
  );
  process.exit(1);
}

// ── Create admin user ─────────────────────────────────────────
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`\n📡  Creating admin user: ${email}...`);

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // Skip email verification
  user_metadata: { role: "admin" },
});

if (error) {
  console.error(`\n❌  Failed to create user: ${error.message}\n`);
  process.exit(1);
}

console.log(`\n✅  Admin user created successfully!`);
console.log(`   ID:    ${data.user.id}`);
console.log(`   Email: ${data.user.email}\n`);
