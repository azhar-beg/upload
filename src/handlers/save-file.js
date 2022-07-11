const fs = require('fs');

const saveFile = (req, res, next) => {
  if (req.pathname !== '/save-file') {
    next();
    return;
  }
  req.bodyParams.forEach(param => {
    const { header, content } = param;
    const { filename } = header['content-disposition'].attributes;
    if (!header['content-type']) {
      return;
    }
    fs.writeFileSync('data/' + filename, content);
  });
  res.end();
  return;
};

module.exports = { saveFile };
