const fetch = require('node-fetch');

const GITHUB_API_URL = 'https://api.github.com';

module.exports = {
  setupRoutes
};

function setupRoutes(router) {
  /**
   * @api {get/post} /auth/* Handles all api requests and proxies it to GitHub
   */
  router.all('/api/*', handleApiRequest);
}

async function handleApiRequest(ctx) {
  const request = ctx.request;
  let url = `${GITHUB_API_URL}${request.url.replace('/api', '')}`;

  const options = {
    method: request.method,
    headers: new fetch.Headers()
  };

  if (request.header.authorization) {
    options.headers.append('Authorization', request.header.authorization);
  } else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    // In case that CLIENT_ID and CLIENT_SECRET is set as environment variable
    // we should append this to the url to prevent request limit issues
    url += `?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;
  }

  if (request.body) {
    options.body = JSON.stringify(request.body);
  }

  const response = await fetch(url, options);

  ctx.body = await response.json();
  ctx.status = response.status;
}
