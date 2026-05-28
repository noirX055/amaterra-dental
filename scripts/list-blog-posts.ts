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

async function listPosts() {
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching posts:", error);
      process.exit(1);
    }

    console.log("\nAll blog posts:\n");
    data?.forEach((post, index) => {
      console.log(`${index + 1}. [${post.id}] ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Created: ${new Date(post.created_at).toLocaleString()}\n`);
    });

    console.log(`Total: ${data?.length || 0} posts`);
  } catch (err) {
    console.error("Failed to list posts:", err);
  }
}

listPosts();
