const fs = require('fs');
const paths = {};
paths.dotenv = process.cwd() + '/.env';
process.env.NODE_ENV = 'development';
// .dev 也可以通过环境变量控制

const dotenvFiles = [
  // 顺序在前的优先级高
  `${paths.dotenv}.${process.env.NODE_ENV}.local`,
  `${paths.dotenv}.${process.env.NODE_ENV}`,
].filter(Boolean);


// dotenv-expand 不会覆盖已有环境变量
// 所以高优配置请放在dotenvFiles数组前排位置
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile
      })
    );
  }
});

console.log(process.env.PUBLIC_URL);
console.log(process.env.PROXY_TARGET);