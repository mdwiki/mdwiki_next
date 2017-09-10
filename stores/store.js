import { action, observable } from 'mobx';
import envService from './../services/env.service.js';

let store = null;

class Store {
  @observable searchValue = '';
  @observable settings = {
    user: 'mdwiki',
    repository: 'wiki'
  };
  @observable items;

  @action startSearch() {
    console.log('Start search with value', this.searchValue);
  }

}

export function initStore() {
  const isServer = !envService.isClient();
  if (isServer) {
    return new Store();
  }

  if (store === null) {
    store = new Store();
  }
  return store;
}

