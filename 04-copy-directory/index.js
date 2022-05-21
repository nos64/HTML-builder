const fs = require('fs');
const path = require('path');

const copyPath = path.join(__dirname, 'files-copy');
const initialPath = path.join(__dirname, 'files');

const init = () => {
  fs.stat(copyPath, (err, stats) => {
    if (err) { 
      mkDir();
      copy();
    } else if (stats.isDirectory()) {
      clear();
      copy ();
    } else if (stats.isFile()) {
      fs.unlink((copyPath), () => {});
      mkDir();
      copy ();
    }
  });
};

function mkDir () {
  fs.mkdir((copyPath), () => {});
}

function clear () {
  fs.readdir(copyPath, (err, files) => {
    if (err) throw err;
    if (files) {
      files.forEach(item => {
        fs.unlink(path.join(copyPath, item), () => {});
      });
    }
  });
}

function copy () {
  fs.readdir(initialPath,
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      files.forEach(item => {
        fs.copyFile(
          path.join(initialPath, item.name), 
          path.join(copyPath, item.name), 
          (err) => {
            if (err) throw err;
          });
      });
    });
}

init();



