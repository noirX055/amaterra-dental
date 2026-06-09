const CACHE_NAME = "amaterra-admin-v1";

// Страницы и ресурсы для кеширования при установке
const PRECACHE_URLS = [
  "/admin",
  "/admin/appointments",
  "/admin/calendar",
  "/admin/doctors",
  "/admin/patients",
];

// Устанавливаем SW и кешируем основные страницы
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Удаляем старые кеши при активации
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Network-first для admin запросов, fallback на кеш
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Обрабатываем только запросы в /admin и статику
  if (!url.pathname.startsWith("/admin") && !url.pathname.startsWith("/icons")) {
    return;
  }

  // Пропускаем API запросы — всегда сеть
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Кешируем успешные GET-ответы
        if (event.request.method === "GET" && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Офлайн — возвращаем из кеша
        return caches.match(event.request).then(
          (cached) =>
            cached ||
            new Response("<h1>Нет соединения</h1><p>Приложение работает в офлайн режиме.</p>", {
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
        );
      })
  );
});
