const Koa = require('koa');
const proxy = require('koa-server-http-proxy');

// 抓取全局异常
process.on('uncaughtException', function (err) {
  console.error('caught_by_uncaughtException', err);
});

// 抓取异步异常
process.on('unhandledRejection', function (err, p) {
  console.error('caught_by_unhandledRejection', err);
});

const app = new Koa();

// 捕获中间件异常
app.use(async function errHandleFacade(ctx, next) {
  try {
    await next();
  } catch (err) {
    console.error('caught_by_err_handler_middleware', err);
    ctx.body = {
      code: -1,
      message: '中间件异常',
    };
  }
});

app.use(proxy('/', {
  target: 'https://docs.corp.kuaishou.com',
  headers: {
    host: 'docs.corp.kuaishou.com'
  },
  changeOrigin:true,
  ws: true,
  onError(err, req, res) {
    res.end(`{code: -1}`);
  },
  onProxyReq(proxyReq) {
    proxyReq.setHeader('x-forwarded-port', '443');
    proxyReq.setHeader('x-forwarded-host', 'docs.corp.kuaishou.com');
    proxyReq.setHeader('referer', 'https://docs.corp.kuaishou.com');
    proxyReq.setHeader('origin', 'https://docs.corp.kuaishou.com');
  }
}))

// 接口mock数据不存在
app.use((ctx) => {
  ctx.body = {
    code: -1,
    message: 'mock系统中不存在改数据文件',
  };
});

app.listen(8080);