const http = require('http');
const { router } = require('./src/app.js');

const startServer = (PORT, router) => {
  const server = http.createServer(router);
  server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
};

startServer(4444, router);
