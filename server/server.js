const Koa = require('koa');
const nextjs = require('next');
const fs = require('fs');
const util = require('util');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const mobxReact = require('mobx-react');
const fetch = require('node-fetch');
const { parse } = require('url');
const routes = require('./api/routes.js');

const readFile = util.promisify(fs.readFile);

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

global.host = dev ? `http://localhost:${PORT}` : 'https://www.mdwiki.net';

const PAGE_NAMES = ['_next', 'static', 'connect', 'search', 'login'];

mobxReact.useStaticRendering(true);

if (!global.fetch) {
  global.fetch = fetch;
}

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(bodyParser());

  server.keys = ['7pb0HHz9Mwq5yZfw'];
  server.use(session({}, server));

  require('./auth.js'); // eslint-disable-line
  const passport = require('koa-passport'); // eslint-disable-line
  server.use(passport.initialize());
  server.use(passport.session());

  router.get('/auth/logout', (ctx) => {
    ctx.logout();
    ctx.redirect();
  });

  router.get('/auth/github', passport.authenticate('github'));

  router.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (ctx) => {
      if (ctx.session.passport && ctx.session.passport.user) {
        const user = ctx.session.passport.user;
        ctx.redirect(`/login?user=${user.name}&accessToken=${user.accessToken}`);
      } else {
        ctx.redirect('/');
      }
    }
  );

  router.get('/auth/user', ctx => {
    let user = {};
    if (ctx.session.passport) {
      user = Object.assign(user, ctx.session.passport.user);
    }

    user.isAuthenticated = user.name !== undefined;

    ctx.body = user;
    ctx.status = 200;
  });

  router.get('/service-worker.js', async ctx => {
    const data = await readFile(`${__dirname}/service-worker.js`, 'utf8');
    ctx.type = 'application/javascript; charset=UTF-8';
    ctx.set('Cache-Control', 'max-age=0');
    ctx.body = data;
    ctx.status = 200;
  });

  routes.setupRoutes(router);

  router.get('/', async ctx => {
    if (!ctx.query.page) {
      await app.render(ctx.req, ctx.res, '/', { page: 'index' });
    } else {
      await handle(ctx.req, ctx.res);
    }
    ctx.respond = false;
  });

  router.get('*', async ctx => {
    const parsedUrl = parse(ctx.req.url);
    const { pathname } = parsedUrl;

    const pageName = getPageName(pathname);
    const isExistingPage = PAGE_NAMES.some(p => p === pageName);

    if (!isExistingPage) {
      ctx.redirect(`/?page=${pageName}`);
    } else {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    }
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on; http://localhost:${PORT}`);
  });
});


function getPageName(pathname) {
  if (pathname === '/') {
    return 'index';
  }
  if (pathname.startsWith('/static')) {
    return 'static';
  }
  if (pathname.startsWith('/_next')) {
    return '_next';
  }
  return pathname.substr(1);
}
