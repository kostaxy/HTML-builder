const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, (err, files) => {
  if (err) throw err;
  files.forEach((el) => {
    fs.stat(path.join(dirPath, el), function (err, stats) {
      if (err) {
        console.log(err);
      } else {
        if (stats.isFile()) {
          console.log(
            `${path.basename(el, path.extname(el))} - ${path
              .extname(el)
              .substring(1, path.extname(el).length)} - ${(
              stats.size / 1024
            ).toFixed(3)}kb`,
          );
        }
      }
    });
  });
});
