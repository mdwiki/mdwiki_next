import env from './env.service.js';

class HttpService {
  getHostAddress() {
    if (!env.isServer()) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return global.host;
  }

  async get(url) {
    if (!url.startsWith('http')) {
      url = this.getHostAddress() + url;
    }
    const response = await fetch(url);
    return response.json();
  }
}

export default new HttpService();
