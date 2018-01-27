if ('serviceWorker' in window.navigator) {
  window.addEventListener('load', () => {
    window.navigator.serviceWorker.register('./service-worker.js')
      .catch(error => {
        console.log('Registration of ServiceWorker failed', error);
      });

    if (window.Notification.permission !== 'granted') {
      window.Notification.requestPermission();
    }
  });

  window.navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.type === 'update') {
      if (window.Notification.permission === 'granted') {
        const notification = new window.Notification('MDWiki Update', {
          icon: 'https://www.mdwiki.net/static/images/wiki.png',
          body: 'We updated MDWiki, you should refresh you browser to use the latest version'
        });

        notification.onclick = () => {
          window.location.reload();
        };
      }
    }
  });
}

