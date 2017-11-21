import { action, observable } from 'mobx';
import github from './../services/github.service.js';

export default class SearchStore {
  @observable isBusy = false;
  @observable searchTerm = '';
  @observable searchResult = null

  _compareByName(page1, page2) {
    return page1.name.localeCompare(page2.name);
  }

  @action async startSearch(user, repository, searchTerm) {
    this.isBusy = true;

    try {
      this.searchTerm = searchTerm;

      const result = await github.searchPages(user, repository, searchTerm);
      result.items.sort(this._compareByName);
      this.searchResult = result;
    } finally {
      this.isBusy = false;
    }
  }
}

