# SEO Configuration Guide

## Что уже настроено:

✅ **Метаданные** - title, description, keywords, Open Graph, Twitter Cards
✅ **robots.txt** - автоматически генерируется
✅ **sitemap.xml** - автоматически генерируется
✅ **Structured Data (JSON-LD)** - Schema.org разметка для Google
✅ **Analytics** - готовые компоненты для Google Analytics и Yandex Metrika

## Что нужно настроить:

### 1. Обновить контактную информацию

Отредактируй `lib/seo/schema.ts`:
- `telephone` - номер телефона клиники
- `streetAddress` - адрес клиники
- `postalCode` - почтовый индекс
- `latitude` и `longitude` - координаты клиники
- `openingHours` - часы работы
- `sameAs` - ссылки на соцсети

### 2. Создать изображение для Open Graph

Создай файл `public/og-image.jpg` размером 1200x630px с логотипом и названием клиники.

### 3. Настроить Google Analytics

1. Создай аккаунт на https://analytics.google.com
2. Получи Measurement ID (формат: G-XXXXXXXXXX)
3. Добавь в `.env.local` и `.env.production`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### 4. Настроить Yandex Metrika

1. Создай счетчик на https://metrika.yandex.ru
2. Получи ID счетчика
3. Добавь в `.env.local` и `.env.production`:
   ```
   NEXT_PUBLIC_YM_COUNTER_ID=XXXXXXXX
   ```

### 5. Верификация в поисковых системах

#### Google Search Console
1. Зайди на https://search.google.com/search-console
2. Добавь сайт amaterra.md
3. Получи код верификации
4. Обнови `app/layout.tsx` в `metadata.verification.google`

#### Yandex Webmaster
1. Зайди на https://webmaster.yandex.ru
2. Добавь сайт amaterra.md
3. Получи код верификации
4. Обнови `app/layout.tsx` в `metadata.verification.yandex`

### 6. Отправить sitemap в поисковые системы

После деплоя:
- Google Search Console → Sitemaps → добавь `https://amaterra.md/sitemap.xml`
- Yandex Webmaster → Индексирование → Файлы Sitemap → добавь `https://amaterra.md/sitemap.xml`

### 7. Обновить sitemap.ts

Добавь все публичные страницы сайта в `app/sitemap.ts`:
- Страницы услуг
- Страницы врачей
- Блог (если есть)
- Контакты
- О клинике

## Рекомендации для контента:

1. **Заголовки страниц** - уникальные, до 60 символов
2. **Описания** - уникальные, 150-160 символов
3. **Alt текст для изображений** - описательный текст
4. **URL структура** - понятные, короткие URL
5. **Внутренние ссылки** - связывай страницы между собой
6. **Скорость загрузки** - оптимизируй изображения
7. **Мобильная версия** - уже адаптивная

## Проверка SEO:

После деплоя проверь:
- https://search.google.com/test/rich-results - проверка структурированных данных
- https://pagespeed.web.dev - скорость загрузки
- https://validator.schema.org - валидация Schema.org
- https://www.xml-sitemaps.com - проверка sitemap

## Мониторинг:

- Google Search Console - позиции, клики, ошибки
- Yandex Webmaster - индексация, позиции
- Google Analytics - трафик, поведение
- Yandex Metrika - карта кликов, вебвизор
