import env from './../services/env.service.js';

class StorageService {
  getDb() {
    return !env.isServer() ? window.localStorage : {};
  }

  get(key) {
    return this.getDb().getItem(key);
  }

  set(key, value) {
    this.getDb().setItem(key, value);
  }

  setObject(key, value) {
    this.set(key, JSON.stringify(value));
  }

  getObject(key) {
    const value = this.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return undefined;
  }
}

export default new StorageService();
