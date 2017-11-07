const GITHUB_API_URL = 'https://api.github.com';

class GithubService {
  constructor() {
    this.accessToken = undefined;
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
    const response = await fetch(`${GITHUB_API_URL}${url}`, options);
    if (response.status === 200) {
      return response.json();
    }
    return undefined;
  }

  async _put(url, body) {
    const EXPECTED_STATUS = [200, 201];

    const options = this.buildOptions('PUT');
    options.body = JSON.stringify(body);

    const response = await fetch(`${GITHUB_API_URL}${url}`, options);
    if (EXPECTED_STATUS.some(s => s === response.status)) {
      return response.json();
    }
    return undefined;
  }

  async _delete(url, body) {
    const options = this.buildOptions('DELETE');
    options.body = JSON.stringify(body);

    const response = await fetch(`${GITHUB_API_URL}${url}`, options);
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
    return window.btoa(content);
  }

  _mapItem(item) {
    if (item) {
      return {
        name: item.name,
        path: item.path,
        sha: item.sha,
        content: this._decodeContent(item.content)
      };
    }
    return undefined;
  }

  fetchItems(userName, repository) {
    const url = `/repos/${userName}/${repository}/contents`;
    return this._get(url);
  }

  async fetchItem(userName, repository, itemPath) {
    const item = await this._get(`/repos/${userName}/${repository}/contents/${itemPath}`);
    return this._mapItem(item);
  }

  async putItem(userName, repository, itemPath, itemContent, commitMessage, sha) {
    const url = `/repos/${userName}/${repository}/contents/${itemPath}`;
    const body = {
      message: commitMessage,
      content: this._encodeContent(itemContent),
      sha
    };

    const response = await this._put(url, body);
    return this._mapItem(response.content);
  }

  deleteItem(userName, repository, itemPath, commitMessage, sha) {
    const url = `/repos/${userName}/${repository}/contents/${itemPath}`;
    const body = {
      message: commitMessage,
      sha
    };
    return this._delete(url, body);
  }

  search(userName, repository, searchTerm) {
    const searchUrl = `/search/code?q=${escape(searchTerm)}+in:file+extension:md+repo:${userName}/${repository}`;
    return this._get(searchUrl);
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
}

export default new GithubService();
