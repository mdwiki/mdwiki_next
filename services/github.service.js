// const fetch = require('graphql-fetch')('https://api.github.com/graphql');
const GITHUB_API_URL = 'https://api.github.com';

class GithubService {
  // async fetchItems(user, repository, oauthToken) {
  // const query = `
  // query { 
  // repository(owner:$user name:$repository) {
  // defaultBranchRef {
  // name
  // target {
  // ... on Commit {
  // tree {
  // entries {
  // name
  // }
  // }
  // }  
  // }
  // }
  // }
  // }
  // `;
  // const queryVars = {
  // user: user,
  // repository: repository
  // };

  // const opts = {
  // };

  // const response = await fetch(query, queryVars, opts);
  // if (response.errors) {
  // throw new Error('Error while querying Github graphql api:', response.errors);
  // }

  // return response.data.repository.defaultBranchRef.target.tree.entries;
  // }
  async fetchItems(user, repository, oauthToken) {
    const response = await fetch(`${GITHUB_API_URL}/repos/${user}/${repository}/contents`);
    return response.json();
  }
}

export default new GithubService();
