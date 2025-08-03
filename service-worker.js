const CACHE_NAME = 'v1.0.0'; // 改這個可觸發更新
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 安裝階段：快取資源
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 啟動階段：刪除舊版快取
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] 刪除舊快取:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 攔截請求：先快取，後抓網路
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return new Response('⚠️ 無法載入頁面（離線且無快取）', {
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
    })
  );
});
