import { action, observable, autorun } from 'mobx';
import env from './../services/env.service.js';
import storage from './../services/storage.service.js';

let store = null;

const defaultSettings = { user: 'mdwiki', repository: 'wiki' };

class Store {
  @observable isServer = false;
  @observable searchValue = '';
  @observable settings = null;
  @observable user = null;
  @observable items = null;

  constructor(isServer) {
    this.isServer = isServer;
  }

  @action setUser(user) {
    this.user = user;
    this.saveToStorage();
  }

  @action changeSettings(settings) {
    this.setting = settings;
    this.saveToStorage();
  }

  @action readFromStorage() {
    this.user = storage.getObject('user') || { isLoggedIn: false };
    this.settings = storage.getObject('settings') || defaultSettings;
    this.searchValue = storage.get('searchValue');
  }

  saveToStorage() {
    storage.setObject('user', this.user);
    storage.setObject('settings', this.settings);
  }

  @action startSearch() {
  }
}

export function initStore(user) {
  const isServer = env.isServer();
  if (isServer) {
    return new Store(isServer);
  }

  if (store === null) {
    store = new Store(isServer);
    store.readFromStorage();

    window.STORE = store;
  }

  if (user) {
    store.setUser(user);
  }
  return store;
}

