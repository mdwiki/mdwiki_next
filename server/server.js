const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const mobxReact = require('mobx-react');
const config = require('config');
const fetch = require('node-fetch');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

global.host = dev ? `http://localhost:${PORT}` : 'https://www.mdwiki.net';

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

  require('./auth.js');
  const passport = require('koa-passport');
  server.use(passport.initialize());
  server.use(passport.session());

  router.get('/config', async ctx => {
    ctx.body = config.client;
    ctx.status = 200;
  });

  router.get('/auth/logout', (ctx) => {
    ctx.logout();
    ctx.redirect();
  });

  router.get('/auth/github', passport.authenticate('github'));

  router.get('/auth/github/callback',
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

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
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
