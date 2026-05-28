import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read .env.local file manually
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};

envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

// IDs of old posts to delete
const oldPostIds = [
  "a9d7c61a-aaee-4f5d-b551-61b8280ac212", // 354235
  "5ceb0959-385f-4d6e-a0e9-73c79f1dbd0a", // Чистка зубов советы по применению
];

async function deleteOldPosts() {
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  for (const id of oldPostIds) {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting post ${id}:`, error);
      } else {
        console.log(`✓ Deleted post: ${id}`);
      }
    } catch (err) {
      console.error(`Failed to delete post ${id}:`, err);
    }
  }

  console.log("\nDone!");
}

deleteOldPosts();
