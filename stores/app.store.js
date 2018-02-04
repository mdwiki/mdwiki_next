import { action, observable } from 'mobx';
import env from './../services/env.service.js';
import storage from './../services/storage.service.js';
import github from './../services/github.service.js';
import pageListFilter from './../common/helpers/page-list-filter.js';

let appStore = null;

const defaultSettings = { user: 'mdwiki', repository: 'wiki' };

class AppStore {
  @observable isServer = false;
  @observable searchTerm = '';
  @observable settings = null;
  @observable user = null;
  @observable pages = null;
  @observable selectedPage = null;

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

  @action changeSelectedPage(page) {
    this.selectedPage = page;
  }

  _compareByName(page1, page2) {
    return page1.name.localeCompare(page2.name);
  }

  @action async loadPages() {
    const pages = await github.getPages(this.settings.user, this.settings.repository);
    this.setPages(pages);
  }

  @action setPages(pages) {
    pages.sort(this._compareByName);
    this.pages = pages.filter(pageListFilter);
  }

  @action addPage(page) {
    const pages = this.pages.slice();
    pages.push(page);
    this.setPages(pages);
  }

  @action removePage(path) {
    const pages = this.pages.slice();
    const pageIndex = pages.findIndex(i => i.path === path);

    if (pageIndex >= 0) {
      pages.splice(pageIndex, 1);
      this.setPages(pages);
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

