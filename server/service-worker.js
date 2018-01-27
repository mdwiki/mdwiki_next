/* eslint-env worker, serviceworker */
/* eslint no-restricted-globals: ["off", "self"] */

const APP_VERSION = '1.0.0';

const EXTERNALS_CACHE_NAME = 'mdwiki-externals-cache-v1';
const APP_CACHE_NAME = `mdwiki-app-cache-v${APP_VERSION}`;
const API_CACHE_NAME = 'mdwiki-api-cache';

const externalLibraries = [
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/roboto/v18/CWB0XYA8bzo0kSThX0UTuA.woff2',
  'https://fonts.gstatic.com/s/roboto/v18/RxZJdnzeo3R5zSexge8UUVtXRa8TVwTICgirnJhmVJw.woff2'
];

const cacheRules = [
  /^\/$/,
  /^\/index$/,
  /^\/connect$/,
  /^\/search$/,
  /^\/_next\//,
  /^\/static\//,
  /^\/index\//
];

const apiCacheRule = /^\/api\//;

self.addEventListener('install', event => {
  const precachePromise = addToCache(EXTERNALS_CACHE_NAME, externalLibraries);

  event.waitUntil(precachePromise.then(() => notifyUpdate()));
});

self.addEventListener('activate', event => {
  event.waitUntil(cleanOldCaches());
});

self.addEventListener('fetch', event => {
  event.respondWith(handleFetch(event.request));
});


async function notifyUpdate() {
  const allClients = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of allClients) {
    client.postMessage({ type: 'update' });
  }
}

async function handleFetch(request) {
  const requestUrl = new URL(request.url);

  if (isExternalRequest(requestUrl)) {
    return cacheFirst(EXTERNALS_CACHE_NAME, request);
  }

  if (shouldRequestBeCached(requestUrl)) {
    return cacheFirst(APP_CACHE_NAME, request, requestUrl.pathname);
  }

  if (isApiRequest(requestUrl)) {
    if (!navigator.onLine) {
      return cacheFirst(API_CACHE_NAME, request, requestUrl.pathname);
    }
    return networkFirst(API_CACHE_NAME, requestUrl, requestUrl.pathname);
  }

  return fetch(request);
}

async function isApiRequest(requestUrl) {
  return apiCacheRule.exec(requestUrl.pathname) !== null;
}

function shouldRequestBeCached(requestUrl) {
  let shouldBeCached = false;

  for (const cacheRule of cacheRules) {
    shouldBeCached = cacheRule.exec(requestUrl.pathname) !== null;
    if (shouldBeCached) {
      break;
    }
  }

  return shouldBeCached;
}

function isExternalRequest(requestUrl) {
  return requestUrl.origin !== location.origin;
}


async function addToCache(cacheName, filesToCache) {
  const cache = await caches.open(cacheName);
  return cache.addAll(filesToCache);
}

async function cacheFirst(cacheName, request, cacheKey = request) {
  const cache = await caches.open(cacheName);

  const responseFromCache = await cache.match(cacheKey);
  if (responseFromCache) {
    return responseFromCache;
  }

  return fetch(request)
    .then(response => {
      cache.put(cacheKey, response.clone());
      return response;
    });
}

async function networkFirst(cacheName, request, cacheKey) {
  const cache = await caches.open(cacheName);

  return fetch(request)
    .then(response => {
      cache.put(cacheKey, response.clone());
      return response;
    })
    .catch(error => cache.match(cacheKey));
}

async function cleanOldCaches() {
  const activeCacheKeys = [EXTERNALS_CACHE_NAME, APP_CACHE_NAME, API_CACHE_NAME];

  const existingCacheKeys = await caches.keys();

  const cachesToDelete = existingCacheKeys.filter(key => !activeCacheKeys.includes(key));
  if (cachesToDelete.length > 0) {
    return Promise.all(cachesToDelete.map(key => caches.delete(key)));
  }
  return undefined;
}
