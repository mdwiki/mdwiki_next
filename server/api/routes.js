const githubModule = require('./github.module.js');

module.exports = {
  setupRoutes
};

function setupRoutes(router) {
  githubModule.setupRoutes(router);
}
