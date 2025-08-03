const CACHE_NAME = 'my-pwa-v1.0.3'; // 每次版本發佈時改這個值

// 所有需要快取的檔案
const urlsToCache = [
  './',
  './index.html',
  './style.css?v=1.0.1',
  './script.js?v=1.0.1',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 安裝階段：快取必要資源
self.addEventListener('install', event => {
  console.log('[SW] 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 啟用階段：刪除舊的快取
self.addEventListener('activate', event => {
  console.log('[SW] 啟用中...');
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

// 攔截網路請求：優先使用快取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

// 接收主頁訊息：例如 skipWaiting
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
