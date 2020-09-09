const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const basePath = './data';
const noFileText = JSON.stringify({
  code: -1,
  message: 'mock系统中不存在改数据文件'
}, null, 4);

const formatUrl = (reqUrl) => {
  let { pathname } = url.parse(reqUrl);
  pathname = pathname.replace(/\/+$/, '');
  return pathname;
}

const getData = (dataPath) => {
  if (fs.existsSync(dataPath)) {
    return fs.readFileSync(dataPath);
  }
  return noFileText;
}

http.createServer((req, res) => {
  const pathname = formatUrl(req.url);
  const dataPath = path.join(basePath, `${pathname}.${req.method.toLowerCase()}.json`);
  console.log(dataPath);
  const data = getData(dataPath);
  res.write(data);
  res.end();
}).listen(8080)