const fs = require('fs');

const path = require('path');

// console.log(path.join(__dirname, 'secret-folder'))
fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        if (!file.isDirectory()) {
          console.log(
            `${path.parse(file.name).name} - ${path.parse(file.name).ext.slice(1)} - `);
        }
      });
    }
  });
