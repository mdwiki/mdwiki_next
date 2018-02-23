import { action, observable } from 'mobx';
import github from './../services/github.service.js';
import navigator from './../services/navigator.service.js';

export default class PageStore {
  @observable isBusy = false;
  @observable path = null;
  @observable markdown = '';
  @observable isInEditMode = false;

  @action async loadPage(user, repository, path) {
    this.isBusy = true;

    try {
      this.page = await github.getPage(user, repository, path);
      this.markdown = this.page.content;
    } finally {
      this.isBusy = false;
      this.isInEditMode = false;
    }
  }

  @action updatePage(markdown) {
    this.markdown = markdown;
  }

  @action async savePage(user, repository, commitMessage) {
    this.isBusy = true;

    try {
      await github.createOrUpdatePage(
        user,
        repository,
        this.page.path,
        this.markdown,
        commitMessage,
        this.page.sha
      );

      this.markdown = this.page.content;
    } finally {
      this.isBusy = false;
    }
  }

  @action toggleEditMode() {
    this.isInEditMode = !this.isInEditMode;
  }

  createPage(user, repository, pageName) {
    const content = `# ${pageName}`;
    const commitMessage = `Create new page ${pageName}`;
    const path = `${pageName.replace(/\s/g, '_')}.md`.toLowerCase();

    return github.createOrUpdatePage(
      user,
      repository,
      path,
      content,
      commitMessage
    );
  }

  async deletePage(user, repository) {
    const commitMessage = `Delete page ${this.page.name}`;
    await github.deletePage(user, repository, this.page.path, commitMessage, this.page.sha);
    navigator.goHome();
  }
}

