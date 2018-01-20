const fs = require('fs');
const appVersion = require('./package.json').version;

const SERVICEWORKER_FILEPATH = `${__dirname}/server/service-worker.js`;

let serviceWorkerCode = fs.readFileSync(SERVICEWORKER_FILEPATH, { encoding: 'utf8' });

serviceWorkerCode = serviceWorkerCode.replace(/1\.0\.0/g, appVersion);

fs.writeFileSync(SERVICEWORKER_FILEPATH, serviceWorkerCode, { encoding: 'utf8' });

