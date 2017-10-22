import env from './../services/env.service.js';

class StorageService {
  getDb() {
    if (env.isServer()) {
      return {};
    }
    return window.localStorage;
  }

  get(key) {
    return this.getDb().getItem(key);
  }

  set(key, value) {
    this.getDb().setItem(key, value);
  }

  setObject(key, object) {
    this.set(key, JSON.stringify(object));
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
