import { action, observable } from 'mobx';
import env from './../services/env.service.js';
import storage from './../services/storage.service.js';
import github from './../services/github.service.js';

let appStore = null;

const defaultSettings = { user: 'mdwiki', repository: 'wiki' };

class AppStore {
  @observable isServer = false;
  @observable searchTerm = '';
  @observable settings = null;
  @observable user = null;
  @observable items = null;
  @observable selectedItem = null;

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
    this.searchTerm = storage.get('searchTerm');
    this.user = storage.getObject('user') || { isLoggedIn: false };
  }

  saveToStorage() {
    storage.setObject('user', this.user);
    storage.setObject('settings', this.settings);
  }

  @action changeSearchTerm(searchTerm) {
    this.searchTerm = searchTerm;
  }

  @action changeSelectedItem(item) {
    this.selectedItem = item;
  }

  _compareByName(item1, item2) {
    return item1.name.localeCompare(item2.name);
  }

  @action setItems(items) {
    items.sort(this._compareByName);
    this.items = items;
  }

  @action addItem(item) {
    if (item.path === 'index.md') {
      return; // The index page we wont show in the list
    }

    const items = this.items.slice();
    items.push(item);
    this.setItems(items);
  }

  @action removeItem(itemPath) {
    const items = this.items.slice();
    const itemIndex = items.findIndex(i => i.path === itemPath);

    if (itemIndex >= 0) {
      items.splice(itemIndex, 1);
      this.setItems(items);
    }
  }

  isLoggedIn() {
    return this.user && this.user.isLoggedIn;
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

