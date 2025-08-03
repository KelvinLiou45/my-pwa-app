if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(reg => {
    reg.onupdatefound = () => {
      const newWorker = reg.installing;
      newWorker.onstatechange = () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          const confirmed = confirm('有新版本可用，是否立即更新？');
          if (confirmed) {
            newWorker.postMessage({ action: 'skipWaiting' });
          }
        }
      };
    };
  });

  // 接收 skipWaiting 指令
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload(); // 自動刷新頁面套用新版本
  });
}
