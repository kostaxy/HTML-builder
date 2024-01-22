const fs = require('fs');
const path = require('path');
const ws = fs.createWriteStream(path.join(__dirname, 'message.txt'));

console.log('Hi, type your message:');
process.stdin.on('data', (data) => {
  const enteringText = Buffer.from(data).toString().trim();
  if (enteringText === 'exit') {
    exitProgram();
  } else {
    ws.write(Buffer.from(data).toString());
  }
});

process.on('SIGINT', () => {
  exitProgram();
});

function exitProgram() {
  console.log('Bye, see ya!');
  process.exit();
}
