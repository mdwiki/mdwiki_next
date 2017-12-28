const fs = require('fs');
const buildStats = require('./.next/build-stats.json');

const BUILD_ID_FILEPATH = `${__dirname}/.next/BUILD_ID`;
const SERVICEWORKER_FILEPATH = `${__dirname}/server/service-worker.js`;

const buildId = fs.readFileSync(BUILD_ID_FILEPATH, { encoding: 'utf8' });
const appJSHash = buildStats['app.js'].hash;

let serviceWorkerCode = fs.readFileSync(SERVICEWORKER_FILEPATH, { encoding: 'utf8' });

serviceWorkerCode = serviceWorkerCode.replace(/BUILD_ID/g, buildId);
serviceWorkerCode = serviceWorkerCode.replace(/APPJS_HASH/g, appJSHash);
serviceWorkerCode = serviceWorkerCode.replace(/NODE_ENV/g, process.env.NODE_ENV);

fs.writeFileSync(SERVICEWORKER_FILEPATH, serviceWorkerCode, { encoding: 'utf8' });

