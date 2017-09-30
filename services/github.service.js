const GITHUB_API_URL = 'https://api.github.com';

class GithubService {
  buildOptions(accessToken, method = 'GET') {
    const options = { method: method };
    if (accessToken) {
      const headers = new Headers();
      headers.append('Authorization', `token ${accessToken}`);

      options.headers = headers;
    }
    return options;
  }

  async _get(url, accessToken) {
    const options = this.buildOptions(accessToken);
    const response = await fetch(`${GITHUB_API_URL}${url}`, options);
    return response.json();
  }

  fetchItems(userName, repository, accessToken) {
    const url = `/repos/${userName}/${repository}/contents`;
    return this._get(url, accessToken);
  }

  getUser(userName, accessToken) {
    return this._get(`/users/${userName}`, accessToken);
  }
}

export default new GithubService();
