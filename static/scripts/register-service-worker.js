if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker.register('./service-worker.js')
    .catch(error => {
      console.log('Registration of ServiceWorker failed', error);
    });
}

