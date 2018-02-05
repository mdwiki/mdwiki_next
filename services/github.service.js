import env from './env.service.js';

class GithubService {
  constructor() {
    this.hostAddress = env.host();
  }

  buildOptions(method = 'GET') {
    const options = { method };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (this.accessToken) {
      headers.append('Authorization', `token ${this.accessToken}`);
    }

    options.headers = headers;
    return options;
  }

  async _get(url) {
    const options = this.buildOptions();
    const response = await fetch(`${this.hostAddress}/api${url}`, options);
    if (response.status === 200) {
      return response.json();
    }
    return undefined;
  }

  async _put(url, body) {
    const EXPECTED_STATUS = [200, 201];

    const options = this.buildOptions('PUT');
    options.body = JSON.stringify(body);

    const response = await fetch(`${this.hostAddress}/api${url}`, options);
    if (EXPECTED_STATUS.some(s => s === response.status)) {
      return response.json();
    }
    return undefined;
  }

  async _delete(url, body) {
    const options = this.buildOptions('DELETE');
    options.body = JSON.stringify(body);

    const response = await fetch(`${this.hostAddress}/api${url}`, options);
    if (response.status === 200) {
      return response.json();
    }
    return undefined;
  }

  _decodeContent(content) {
    if (content) {
      return decodeURIComponent(escape(window.atob(content)));
    }
    return undefined;
  }

  _encodeContent(content) {
    return window.btoa(unescape(encodeURIComponent(content)));
  }

  _mapPage(page) {
    if (page) {
      return {
        name: page.name.substr(0, page.name.length - 3),
        path: page.path,
        sha: page.sha,
        content: this._decodeContent(page.content)
      };
    }
    return undefined;
  }

  async getPages(userName, repository) {
    const url = `/repos/${userName}/${repository}/contents`;
    const pages = await this._get(url);

    return pages.filter(this._markdownFilesOnly).map(page => this._mapPage(page));
  }

  async getPage(userName, repository, path) {
    const page = await this._get(`/repos/${userName}/${repository}/contents/${this.appendExtension(path)}`);
    return this._mapPage(page);
  }

  async createOrUpdatePage(userName, repository, path, pageContent, commitMessage, sha) {
    const url = `/repos/${userName}/${repository}/contents/${this.appendExtension(path)}`;
    const body = {
      message: commitMessage,
      content: this._encodeContent(pageContent),
      sha
    };

    const response = await this._put(url, body);
    return this._mapPage(response.content);
  }

  deletePage(userName, repository, path, commitMessage, sha) {
    const url = `/repos/${userName}/${repository}/contents/${this.appendExtension(path)}`;
    const body = {
      message: commitMessage,
      sha
    };
    return this._delete(url, body);
  }

  async searchPages(userName, repository, searchTerm) {
    const searchUrl = `/search/code?q=${escape(searchTerm)}+in:file+extension:md+repo:${userName}/${repository}`;
    const searchResult = await this._get(searchUrl);
    searchResult.items = searchResult.items.map(page => this._mapPage(page));
    return searchResult;
  }

  async getUser(userName) {
    try {
      const user = await this._get(`/users/${userName}`);
      return user;
    } catch (error) {
      console.log('Error while fetching user', userName);
      return undefined;
    }
  }

  async getRepository(userName, repositoryName) {
    try {
      const user = await this._get(`/repos/${userName}/${repositoryName}`);
      return user;
    } catch (error) {
      console.log('Error while fetching repository', userName, repositoryName);
      return undefined;
    }
  }

  appendExtension(path) {
    if (!path.endsWith('.md')) {
      return `${path}.md`;
    }
    return path;
  }

  _markdownFilesOnly(page) {
    return page.name.endsWith('.md');
  }
}

export default new GithubService();
