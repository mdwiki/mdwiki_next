import { action, observable, reaction } from 'mobx';
import env from './../services/env.service.js';
import storage from './../services/storage.service.js';
import github from './../services/github.service.js';

let appStore = null;

const defaultSettings = { user: 'mdwiki', repository: 'wiki' };

class AppStore {
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

    if (user.isLoggedIn) {
      github.accessToken = user.accessToken;
    }
  }

  @action changeSettings(settings) {
    this.settings = settings;
    this.saveToStorage();
  }

  @action readFromStorage() {
    this.settings = storage.getObject('settings') || defaultSettings;
    this.searchValue = storage.get('searchValue');
    this.user = storage.getObject('user') || { isLoggedIn: false };
  }

  saveToStorage() {
    storage.setObject('user', this.user);
    storage.setObject('settings', this.settings);
  }

  @action startSearch() {
  }

}

export function initAppStore(user) {
  const isServer = env.isServer();
  if (isServer) {
    return new AppStore(isServer);
  }

  if (appStore === null) {
    appStore = new AppStore(isServer);
    appStore.readFromStorage();

    github.accessToken = appStore.user.accessToken;
    window.APP_STORE = appStore;
  }

  if (user) {
    appStore.setUser(user);
  }

  return appStore;
}

