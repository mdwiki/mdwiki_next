/* eslint-env worker, serviceworker */
/* eslint no-restricted-globals: ["off", "self"] */

const buildId = 'BUILD_ID';
const appJSHash = 'APPJS_HASH';
const ENV = 'NODE_ENV';

const APP_CACHE_NAME = 'mdwiki-cache-v1';

const filesToPrecache = [
  './index',
  `./_next/${buildId}/page/index.js`,
  `./_next/${buildId}/page/_error/index.js`,
  `./_next/${appJSHash}/app.js`,
  './static/manifest.json',
  './static/scripts/register-service-worker.js',
  './service-worker.js',
  './static/scripts/sw-toolbox.js',
  './static/styles/simplemde.min.css',
  './static/styles/markdown.css',
  './static/styles/styles.css',
  './static/styles/normalize.css',
  './static/images/wiki.png',
  './static/images/favicon.ico',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/roboto/v18/CWB0XYA8bzo0kSThX0UTuA.woff2',
  'https://fonts.gstatic.com/s/roboto/v18/RxZJdnzeo3R5zSexge8UUVtXRa8TVwTICgirnJhmVJw.woff2'
];

const GITHUB_CACHE_NAME = 'mdwiki-github-cache';
const HOST_ADDRESS = 'http://localhost:3000';


if (ENV === 'production') {
  importScripts('./../static/scripts/sw-toolbox.js');

  self.toolbox.options.cache.name = APP_CACHE_NAME;
  self.toolbox.precache(filesToPrecache);
  self.toolbox.router.get(`${HOST_ADDRESS}/(.*)`, self.toolbox.cacheFirst);

  self.toolbox.router.get(/^https:\/\/www.mdwiki.com\/api\//, self.toolbox.networkFirst, {
    cache: { name: GITHUB_CACHE_NAME }
  });
}

