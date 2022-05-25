const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const output = fs.createWriteStream(
  path.join(__dirname, 'text.txt'), 'utf-8'
);

stdout.write('Привет! Введите текст...\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  output.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Удачи!'));
