-- Шаг 1: Включить REPLICA IDENTITY для таблицы appointments
-- Это позволяет Supabase отслеживать изменения
ALTER TABLE appointments REPLICA IDENTITY FULL;

-- Шаг 2: Добавить таблицу в публикацию supabase_realtime
-- Это включает Realtime для таблицы
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- Шаг 3: Проверить, что таблица добавлена в публикацию
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Шаг 4: Проверить RLS политики (если нужно)
-- Убедись, что есть политика для чтения
SELECT * FROM pg_policies WHERE tablename = 'appointments';
