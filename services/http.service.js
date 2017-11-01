import env from './env.service.js';

class HttpService {
  getHostAddress() {
    if (!env.isServer()) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return global.host;
  }

  async get(url) {
    let completeUrl = url;
    if (!completeUrl.startsWith('http')) {
      completeUrl = this.getHostAddress() + completeUrl;
    }
    const response = await fetch(completeUrl);
    return response.json();
  }
}

export default new HttpService();
