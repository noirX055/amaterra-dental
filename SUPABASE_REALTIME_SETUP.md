# Настройка Supabase Realtime

## Шаг 1: Включить Realtime для таблицы appointments

1. Открой Supabase Dashboard: https://supabase.com/dashboard/project/nqscykqhubvfgvtfhqpr
2. Перейди в раздел **Database** → **Replication**
3. Найди таблицу `appointments`
4. Включи переключатель для этой таблицы (должен стать зелёным)

## Шаг 2: Проверить RLS (Row Level Security)

1. Перейди в **Database** → **Tables** → `appointments`
2. Убедись, что RLS включен
3. Добавь политику для чтения (если её нет):

```sql
-- Политика для чтения всех записей (для админов)
CREATE POLICY "Enable read access for authenticated users" ON appointments
FOR SELECT
TO authenticated
USING (true);
```

## Шаг 3: Проверить настройки Realtime

1. Перейди в **Project Settings** → **API**
2. Убедись, что Realtime включен (должно быть зелёное состояние)
3. Проверь, что URL и ключи правильные в `.env.local`

## Альтернатива: Включить через SQL

Если не получается через UI, выполни в SQL Editor:

```sql
-- Включить репликацию для таблицы appointments
ALTER TABLE appointments REPLICA IDENTITY FULL;

-- Включить публикацию для Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
```

## После настройки

Перезапусти dev-сервер:
```bash
npm run dev
```

Realtime должен заработать автоматически!
