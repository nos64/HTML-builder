const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(
  folder,
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    files.forEach(item => {
      let file = path.resolve(folder, item.name);
      if (!item.isDirectory()) {
        fs.stat(file, function (err, stats) {
          if (err) console.log(err);
          console.log(`${path.parse(file).name} - ${path.parse(file).ext.slice(1)} - ${(stats.size / 1024)}kB`);
        });
      }
    });
  });
