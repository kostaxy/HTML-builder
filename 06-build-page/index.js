const fs = require('fs');
const path = require('path');

start();

function start() {
  createCopy();
}
function createHtml() {
  const templateDir = __dirname;
  const templateFileName = 'template.html';
  let filesCount = 0;

  fs.readdir(templateDir, (err, files) => {
    if (err) throw err;
    files = files.filter((el) => el === templateFileName);

    const rs = fs.createReadStream(
      path.join(templateDir, templateFileName),
      'utf-8',
    );
    let templateHtml = '';
    rs.on('data', (chunk) => {
      templateHtml += chunk;
    });
    rs.on('end', () => {
      replaceTemplateTags(templateHtml);
    });
    rs.on('error', (err) => {
      if (err) throw err;
    });
  });
}

function replaceTemplateTags(templateHtml) {
  const componentsDir = path.join(__dirname, 'components');
  const replacedFilePath = path.join(__dirname, 'project-dist', 'index.html');
  const result = {};
  fs.readdir(componentsDir, (err, files) => {
    if (err) throw err;
    files = files.filter((el) => path.extname(el) === '.html');

    files.forEach((el) => {
      const rs = fs.createReadStream(path.join(componentsDir, el), 'utf-8');
      let str = '';
      rs.on('data', (chunk) => {
        str += chunk;
      });
      rs.on('end', () => {
        result[path.basename(el, '.html')] = str;
        if (files.length === Object.keys(result).length) {
          // const ws = fs.createWriteStream(path.join(copyFilePath));
          // ws.write(result.join('\n').trim());
          for (const tag in result) {
            templateHtml = templateHtml.replace(`{{${tag}}}`, result[tag]);
          }
          const ws = fs.createWriteStream(replacedFilePath);
          ws.write(templateHtml);
        }
      });
      rs.on('error', (err) => {
        if (err) throw err;
      });
    });
  });
}
function createCopy() {
  const originalPath = path.join(__dirname, 'assets');
  const copyPath = path.join(__dirname, 'project-dist/assets');

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

              createCss();
              createHtml();
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
}
function createCss() {
  const fromDir = path.join(__dirname, 'styles');
  const copyFilePath = path.join(__dirname, 'project-dist', 'style.css');
  const result = [];
  let filesCount = 0;

  fs.readdir(fromDir, (err, files) => {
    if (err) throw err;
    files = files.filter((el) => path.extname(el) === '.css');

    files.forEach((el) => {
      if (path.extname(el) === '.css') {
        const rs = fs.createReadStream(path.join(fromDir, el), 'utf-8');
        let str = '';
        rs.on('data', (chunk) => {
          str += chunk;
        });
        rs.on('end', () => {
          filesCount++;
          result.push(str);
          if (filesCount === files.length) {
            const ws = fs.createWriteStream(path.join(copyFilePath));
            ws.write(result.join('\n').trim());
          }
        });
        rs.on('error', (err) => {
          if (err) throw err;
        });
      }
    });
  });
}
