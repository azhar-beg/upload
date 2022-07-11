const { parseBody } = require('../bodyParser.js');

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

const injectBodyParams = (req, res, next) => {
  let buffer = [];
  req.on('data', chunk => {
    buffer.push(chunk);
  });

  req.on('end', () => {
    req.boundary = getBoundary(req.headers);
    req.body = Buffer.concat(buffer);
    req.bodyParams = parseBody(req.body, Buffer.from('--' + req.boundary));
    req.pathname = req.url.pathname
    next();
  });
};

const injectSearchParams = (req, res, next) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  req.pathname = url.pathname;
  req.searchParams = getParams(url.searchParams)
  next();
};

const injectParams = (req, res, next) => {
  if (req.method === 'POST') {
    injectBodyParams(req, res, next);
    return;
  }
  injectSearchParams(req, res, next);
};


module.exports = { injectParams };
