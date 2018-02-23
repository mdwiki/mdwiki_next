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
          icon: 'static/images/wiki.png',
          body: `We updated MDWiki to version ${event.data.version}, you should refresh your browser or click on this message to use the latest version`,
          tag: 'mdwiki_update'
        });

        notification.onclick = () => {
          notification.close();
          window.location.reload();
        };
      }
    }
  });
}

