# Применение миграции для блога

## Шаг 1: Откройте Supabase Dashboard

1. Перейдите на https://supabase.com/dashboard
2. Войдите в свой аккаунт
3. Выберите проект: **nqscykqhubvfgvtfhqpr**

## Шаг 2: Откройте SQL Editor

1. В левом меню найдите **SQL Editor**
2. Нажмите **New Query**

## Шаг 3: Скопируйте и выполните SQL

Скопируйте весь SQL из файла `supabase/migrations/003_blog_posts.sql` и вставьте в редактор.

Или скопируйте отсюда:

```sql
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ru TEXT NOT NULL,
  title_ro TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt_ru TEXT,
  excerpt_ro TEXT,
  excerpt_en TEXT,
  content_ru TEXT NOT NULL,
  content_ro TEXT NOT NULL,
  content_en TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Create index on published and published_at for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, published_at DESC);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "Anyone can read published posts"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can read all posts (for admin)
CREATE POLICY "Authenticated users can read all posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at_trigger
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();
```

## Шаг 4: Нажмите RUN

После выполнения вы должны увидеть сообщение "Success. No rows returned"

## Шаг 5: Проверьте

1. Перейдите в **Table Editor** в левом меню
2. Найдите таблицу **blog_posts**
3. Таблица должна быть пустой, но структура создана

## Шаг 6: Создайте первую статью

1. Откройте http://localhost:3000/admin/blog
2. Нажмите "+ Создать статью"
3. Заполните все поля
4. Опубликуйте

Готово! Блог работает! 🎉
