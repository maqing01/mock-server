const path = require('path');

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

// mock文件目录根地址
const basePath = path.join(process.cwd(), './data');
// 获取数据文件方法
const getDataPath = (pathname, method) => path.join(basePath, `${pathname.replace(/\/+$/, '')}.${method.toLowerCase()}`);

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

app.use(koaBody({multipart: true}));

// 获取mock数据
app.use(async (ctx, next) => {
  const dataPath = getDataPath(ctx.path, ctx.method);
  try {
    const dataPack = require(dataPath);
    if (typeof dataPack === 'function') {
      // 处理js脚本情况
      const { body, query } = ctx.request;
      ctx.body = dataPack({body, query})
    } else {
      // 处理json数据情况
      ctx.body = dataPack;
    }
  } catch (error) {
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

app.listen(8080);
