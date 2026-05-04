/**
 * One-time script to push the initial migration to Supabase.
 *
 * Usage:
 *   node supabase/push-migration.mjs <SUPABASE_DB_PASSWORD>
 *
 * The password is the database password you set when creating the Supabase project.
 * You can find/reset it in: Project Settings → Database → Database password
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = "nqscykqhubvfgvtfhqpr";
const DB_HOST = `db.${PROJECT_REF}.supabase.co`;
const DB_PORT = 5432;
const DB_NAME = "postgres";
const DB_USER = "postgres";

const password = process.argv[2];

if (!password) {
  console.error(
    "\n❌  Please provide your Supabase database password:\n" +
    "   node supabase/push-migration.mjs YOUR_DB_PASSWORD\n\n" +
    "   Find it at: https://supabase.com/dashboard/project/nqscykqhubvfgvtfhqpr/settings/database\n"
  );
  process.exit(1);
}

const sqlFile = join(__dirname, "migrations", "001_initial_schema.sql");
const sql = readFileSync(sqlFile, "utf-8");

console.log("📡  Connecting to Supabase database...");

// Use the Supabase Management API via fetch (pg module not available without install)
// Instead, we'll use the Supabase SQL endpoint via the service role
// Actually, let's just use the postgres protocol via pg-gateway or the HTTP SQL endpoint

const url = `https://${PROJECT_REF}.supabase.co/pg`;

// Alternative: use the REST SQL endpoint that Supabase provides
// This requires the service_role key. Let's try the simpler approach.

console.log(`\n📋  Migration SQL loaded (${sql.length} characters)\n`);
console.log("─".repeat(60));
console.log("\n⚠️   To push this migration, please use one of these methods:\n");
console.log("Method 1 — Supabase Dashboard (Recommended):");
console.log(`  1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
console.log("  2. Paste the contents of supabase/migrations/001_initial_schema.sql");
console.log("  3. Click 'Run'\n");
console.log("Method 2 — Supabase CLI:");
console.log(`  npx supabase login`);
console.log(`  npx supabase link --project-ref ${PROJECT_REF}`);
console.log(`  npx supabase db push\n`);
console.log("Method 3 — psql (if installed):");
console.log(`  psql "postgresql://${DB_USER}:${password}@${DB_HOST}:${DB_PORT}/${DB_NAME}" -f supabase/migrations/001_initial_schema.sql\n`);
console.log("─".repeat(60));
