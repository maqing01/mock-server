const path = require('path');

const Koa = require('koa');
const koaStatic = require('koa-static');
const websockify = require('koa-websocket')

// 抓取全局异常
process.on('uncaughtException', function (err) {
  console.error('caught_by_uncaughtException', err);
});

// 抓取异步异常
process.on('unhandledRejection', function (err, p) {
  console.error('caught_by_unhandledRejection', err);
});

const app = websockify(new Koa());

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

// html目录
app.use(koaStatic(`${__dirname}/static`));

app.ws.use((ctx, next) => {
  ctx.websocket.send("连接成功");
  return next(ctx)
})
app.ws.use((ctx) => {
  /**接收消息*/
  ctx.websocket.on('message', function (message) {
      console.log(message);
      // 返回给前端的数据
      let data = JSON.stringify({
          id: Math.ceil(Math.random()*1000),
          time: parseInt(new Date()/1000)
      })
      ctx.websocket.send(data);
  })
});

app.on('upgrade', (...args) => {
  console.log(args);
})

app.listen(8080);