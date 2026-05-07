# Применение миграции для Storage

## Шаг 1: Откройте Supabase Dashboard

1. Перейдите на https://supabase.com/dashboard
2. Войдите в свой аккаунт
3. Выберите проект: **nqscykqhubvfgvtfhqpr**

## Шаг 2: Откройте SQL Editor

1. В левом меню найдите **SQL Editor**
2. Нажмите **New Query**

## Шаг 3: Скопируйте и выполните SQL

Скопируйте весь SQL из файла `supabase/migrations/004_storage_images.sql` и вставьте в редактор.

Или скопируйте отсюда:

```sql
-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

## Шаг 4: Нажмите RUN

После выполнения вы должны увидеть сообщение "Success"

## Шаг 5: Проверьте

1. Перейдите в **Storage** в левом меню
2. Должен появиться bucket **images**
3. Bucket должен быть публичным

Готово! Теперь можно загружать изображения для блога! 🎉
