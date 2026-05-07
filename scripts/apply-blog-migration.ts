import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '003_blog_posts.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Applying migration: 003_blog_posts.sql');

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('✅ Migration applied successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

runMigration();
