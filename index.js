const Koa = require('koa');

const SIGN = true;

const app = new Koa();

app.use((ctx, next) => {
  console.log(1);
  next();
});

/**
 * 分支语法
 * 启动服务时根据配置判断该中间件逻辑是否启用
 */
if (SIGN) {
  app.use((ctx, next) => {
    console.log(2);
    next();
  });
}

/**
 * 循环语法
 * 启动服务时循环生成有相似逻辑的中间件
 */
// for (let i = 3; i < 6; i++) {
//   app.use((ctx, next) => {
//     console.log(i);
//     next();
//   });
// }

const middleware = (i) => (ctx, next) => {
  console.log(i);
  next();
};
for (let i = 3; i < 6; i++) {
  app.use(middleware(i));
}

app.use((ctx) => {
  console.log('ok');
  ctx.body = 'ok';
});

app.listen(1121);
