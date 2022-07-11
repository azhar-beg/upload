const fs = require('fs');
const { parseBuffer } = require('../bufferParser');

const parseBody = body => {
  const elements = body.join().split(',\r\n');
  const params = [];
  elements.forEach(element => {
    if (!element) {
      return;
    }
    const [header, content] = element.split('\r\n\r\n');
    params.push({ header, content });
  });
};

const getParams = searchParams => {
  const params = {};
  for ([key, value] of searchParams.entries()) {
    params[key] = value
  }
  return params;
};

const getBoundary = headers => {
  return headers['content-type'].split('=')[1];
};

const injectParams = (req, res, next) => {
  if (req.method === 'POST') {
    let data = '';
    let buffer = [];

    req.on('data', chunk => {
      data += chunk;
      buffer.push(chunk);
    });
    req.on('end', () => {
      req.boundary = getBoundary(req.headers);
      req.body = data;
      req.buffer = Buffer.concat(buffer);
      req.bodyParams = parseBuffer(req.buffer, Buffer.from('--' + req.boundary));
      req.pathname = req.url.pathname
      next();
    })
  } else {
    const url = new URL(req.url, `http://${req.headers.host}`)
    req.pathname = url.pathname;
    req.searchParams = getParams(url.searchParams)
    next();
  }
};


module.exports = { injectParams };
