const GITHUB_API_URL = 'https://api.github.com';

class GithubService {
  constructor() {
    this.accessToken = undefined;
  }

  buildOptions(method = 'GET') {
    const options = { method: method };
    // console.log('buildOptions', this.accessToken);
    if (this.accessToken) {
      const headers = new Headers();
      headers.append('Authorization', `token ${this.accessToken}`);

      options.headers = headers;
    }
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

  fetchItems(userName, repository) {
    const url = `/repos/${userName}/${repository}/contents`;
    return this._get(url);
  }

  async getUser(userName) {
    try {
      const user = await this._get(`/users/${userName}`);
      return user;
    } catch(error) {
      console.log('Error while fetching user', userName);
    }
  }

  async getRepository(userName, repositoryName) {
    try {
      const user = await this._get(`/repos/${userName}/${repositoryName}`);
      return user;
    } catch(error) {
      console.log('Error while fetching repository', userName, repositoryName);
    }
  }
}

export default new GithubService();
