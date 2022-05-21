const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const initialStyles = path.join(__dirname, 'styles');

function mkDir() {
  fs.mkdir((projectDist), () => { });
}

function mergeStyle () {
  fs.readdir(
    initialStyles,
    { withFileTypes: true },
    (err, files) => {
      if (err) console.log(err);
      let styleData = '';
      files.forEach(item => {
        let file = path.join(initialStyles, item.name);
        if (item.isFile() && path.parse(file).ext === '.css') {
          fs.readFile(file, 'utf-8', (err, data) => {
            if (err) console.log(err);
            styleData += data;
            fs.writeFile(path.join(projectDist, 'style.css'), styleData, err => {
              if (err) console.log(err);
            });
          });
        }
      });
    });
}

mkDir();
mergeStyle();