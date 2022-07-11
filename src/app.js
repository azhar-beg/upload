const { notFoundHandler, serveStatic } = require('handlers');
const { createRouter } = require('http-server');
const { injectParams } = require('./handlers/injectParams');
const { saveFile } = require('./handlers/save-file');

const handlers = [
  injectParams,
  saveFile,
  serveStatic('./public'),
  notFoundHandler
];

const router = createRouter(...handlers);
module.exports = { router };
