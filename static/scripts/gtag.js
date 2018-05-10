window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(gtag.arguments);
}

if (!window.location.host.startsWith('localhost')) {
  gtag('js', new Date());
  gtag('config', 'UA-113133677-1', { anonymize_ip: true });
}

