const Koa = require('koa');
const koaBody = require('koa-body');

// 抓取全局异常
process.on('uncaughtException', function (err) {
  console.error('caught_by_uncaughtException', err);
});

// 抓取异步异常
process.on('unhandledRejection', function (err, p) {
  console.error('caught_by_unhandledRejection', err);
});

const app = new Koa();
const bodyParse = koaBody({ multipart: true });

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

// 校验是否存在mock数据
app.use(async (ctx, next) => {
  if (ctx.path.includes('/mock/api')) {
    // 存在mock数据，解析body
    await bodyParse(ctx, next);
  } else {
    await next();
  }
});

// 获取mock数据
app.use(async (ctx, next) => {
  if (ctx.request.body) {
      // ctx.request.body不为undefined表示body被koa-body解析
      ctx.body = ctx.request.body;
  } else {
    await next();
  }
});

// 接口mock数据不存在
app.use((ctx) => {
  ctx.body = {
    code: -1,
    message: 'mock系统中不存在改数据文件',
  };
});

app.listen(1234);