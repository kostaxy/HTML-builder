const fs = require('fs');
const path = require('path');
const originalPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

start(originalPath, copyPath);

function copyDirectory(originalPath, copyPath) {
  fs.mkdir(copyPath, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(originalPath, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const originalFileName = path.join(originalPath, file);
        const copyFileName = path.join(copyPath, file);

        fs.stat(originalFileName, (err, stats) => {
          if (err) throw err;

          if (stats.isDirectory()) {
            copyDirectory(originalFileName, copyFileName);
          } else {
            fs.copyFile(originalFileName, copyFileName, (err) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  });
}
function start(originalPath, copyPath) {
  fs.rm(copyPath, { recursive: true, force: true }, (err) => {
    if (err) {
      throw err;
    }
    copyDirectory(originalPath, copyPath);
  });
}
