const fs = require('fs');
const path = require('path');

const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let str = '';

rs.on('data', (chunk) => {
  str += chunk;
});

rs.on('end', () => console.log(str));
rs.on('error', (error) => console.log('Error', error.message));
