const fs = require('fs');
const path = require('path');

const fromDir = path.join(__dirname, 'styles');
const copyFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
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
