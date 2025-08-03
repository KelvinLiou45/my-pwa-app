if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => {
      console.log('[SW] 註冊成功:', reg.scope);

      // 🔄 自動更新提示（可選）
      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            alert('有新版本可用，請重新整理頁面以更新。');
          }
        };
      };
    })
    .catch(err => {
      console.error('[SW] 註冊失敗:', err);
    });
}
