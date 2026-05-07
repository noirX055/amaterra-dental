-- Migration: Change blog_posts to store single language + translate on-the-fly
-- This migration changes the structure from storing 3 language versions to storing only original content

-- Step 1: Add new columns for single-language storage
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS source_lang TEXT DEFAULT 'ru',
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT;

-- Step 2: Migrate existing data (copy ru version as default)
UPDATE public.blog_posts
SET
  title = title_ru,
  excerpt = excerpt_ru,
  content = content_ru,
  source_lang = 'ru'
WHERE title IS NULL;

-- Step 3: Make new columns NOT NULL after data migration
ALTER TABLE public.blog_posts
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN content SET NOT NULL;

-- Step 4: Drop old language-specific columns
ALTER TABLE public.blog_posts
  DROP COLUMN IF EXISTS title_ru,
  DROP COLUMN IF EXISTS title_ro,
  DROP COLUMN IF EXISTS title_en,
  DROP COLUMN IF EXISTS excerpt_ru,
  DROP COLUMN IF EXISTS excerpt_ro,
  DROP COLUMN IF EXISTS excerpt_en,
  DROP COLUMN IF EXISTS content_ru,
  DROP COLUMN IF EXISTS content_ro,
  DROP COLUMN IF EXISTS content_en;

-- Step 5: Add constraint for source_lang
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_source_lang_check
  CHECK (source_lang IN ('ru', 'ro', 'en'));
