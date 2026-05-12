# Performance Optimization Guide

## Что уже оптимизировано:

✅ **Next.js config** - включена компрессия, AVIF/WebP форматы
✅ **Шрифты** - добавлен `display: swap` для предотвращения FOIT
✅ **.htaccess** - настроено кеширование и Gzip сжатие
✅ **Security headers** - добавлены заголовки безопасности

## Дополнительные оптимизации:

### 1. Оптимизация изображений (экономия 901 KiB)

Все изображения в `public/` нужно оптимизировать:

**Инструменты:**
- https://squoosh.app - онлайн оптимизация
- https://tinypng.com - сжатие PNG/JPG
- ImageOptim (Mac) / FileOptimizer (Windows)

**Рекомендации:**
- Конвертируй в WebP/AVIF формат
- Используй `next/image` компонент вместо `<img>`
- Добавляй `width` и `height` атрибуты
- Используй `priority` для изображений above-the-fold
- Добавляй `loading="lazy"` для изображений ниже первого экрана

**Пример:**
```tsx
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="Description"
  width={1200}
  height={600}
  priority // для главного изображения
  quality={85}
/>
```

### 2. Render Blocking Resources (экономия 790ms)

**Уже сделано:**
- Шрифты с `display: swap`
- Analytics загружается с `strategy="afterInteractive"`

**Дополнительно:**
- Проверь что все CSS критичен
- Убери неиспользуемые стили
- Используй `next/script` с правильной стратегией

### 3. Legacy JavaScript (экономия 14 KiB)

Next.js автоматически транспилирует код. Проверь:
- Обнови все зависимости: `npm update`
- Убери неиспользуемые пакеты
- Используй динамические импорты для больших компонентов:

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

### 4. Кеширование (экономия 80 KiB)

`.htaccess` уже настроен, но убедись что:
- Файл скопирован в `/home/amaterra/public_html/`
- Apache модули включены (mod_expires, mod_deflate, mod_headers)

### 5. Проверка производительности

После оптимизаций проверь:
- https://pagespeed.web.dev/analysis?url=https://amaterra.md
- https://gtmetrix.com
- Chrome DevTools → Lighthouse

**Целевые показатели:**
- Performance: 90+
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Быстрые победы:

1. **Оптимизируй главное изображение** (hero image) - конвертируй в WebP
2. **Добавь размеры всем изображениям** - предотвращает layout shift
3. **Используй lazy loading** для изображений ниже первого экрана
4. **Минимизируй сторонние скрипты** - только необходимые

## Мониторинг:

- Google PageSpeed Insights - еженедельно
- Chrome DevTools Performance - при изменениях
- Real User Monitoring через Google Analytics
