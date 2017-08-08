const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const mobxReact = require('mobx-react');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.NODE_ENV === 'production' ? 80 : 3333;

mobxReact.useStaticRendering(true);

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  //router.get('/api/messages', async ctx => {
  //let messages;
  //if (ctx.query.search) {
  //messages = messageService.search(ctx.query.search);
  //} else {
  //messages = messageService.getAll();
  //}
  //ctx.body = messages;
  //});

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
