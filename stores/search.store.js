import { action, observable } from 'mobx';
import github from './../services/github.service.js';

export default class SearchStore {
  @observable isBusy = false;
  @observable searchTerm = '';
  @observable searchResult = null

  @action async startSearch(user, repository, searchTerm) {
    this.isBusy = true;

    try {
      this.searchTerm = searchTerm;
      this.searchResult = await github.search(user, repository, searchTerm);
    } finally {
      this.isBusy = false;
    }
  }
}

