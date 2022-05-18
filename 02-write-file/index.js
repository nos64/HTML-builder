const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

// const output = fs.createWriteStream(
//   path.join(__dirname, 'destination.txt'), 'utf-8'
// );
const input = fs.createReadStream(
  path.join(__dirname, 'destination.txt'), 'utf-8'
);
stdout.write('Введите текст...\n');



input.on('data', chunk => output.write(chunk));
input.on('error', error => console.log('Error', error.message));


stdout.write('Введите текст...\n');