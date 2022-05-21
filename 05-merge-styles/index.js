const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist');
const initialPath = path.join(__dirname, 'styles');

fs.readdir(
  initialPath,
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    let styleData = '';
    files.forEach(item => {
      let file = path.join(initialPath, item.name);
      if (item.isFile() && path.parse(file).ext === '.css') {
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) console.log(err);
          styleData += data;
          fs.writeFile(path.join(bundlePath, 'bundle.css'), styleData, err => {
            if (err) console.log(err);
          });
        });
      }
    });
  });

