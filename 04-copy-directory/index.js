const fs = require('fs');
const path = require('path');

const copyPath = path.join(__dirname, 'files-copy');
const initialPath = path.resolve(__dirname, 'files');


const deleteFileOrFOlder = (folder) => {
  fs.readdir(folder,
    { withFileTypes: true },
    (err, files) => {
      if(err) throw err;
      files.forEach(item => {
        // fs.unlink((folder, item.name), () => {});
        fs.stat(folder, (errStat, stats) => {
          if(errStat) throw errStat;
          else fs.unlink(path.join(folder, item.name), () => {});
        })
        // let curPath = path.join(folder, item.name);
        // fs.stat(curPath, (errStat, stats) => {
        //   if(errStat) throw errStat;
        //   if(stats.isDirectory()) deleteFileOrFOlder(curPath);
        //   else fs.unlink(path.join((folder, curPath)), () => {});
        // });
      });
      
    });
  // fs.rmdir((folder), () => {});
};

const copyFilles = () => {
  fs.readdir(initialPath,
    { withFileTypes: true },
    (err, files) => {
      if (err) console.log(err);
      files.forEach(item => {
        fs.copyFile(
          path.join(initialPath, item.name), 
          path.join(copyPath, item.name), 
          (err) => {
          if (err) console.log('Error Found:', err);
        });
      });
    });
}

const mkDir = () => {
  fs.stat(copyPath, (err, stats) => {
    if (err) { 
      fs.mkdir((copyPath), () => {});
    } else if (stats.isDirectory()) {
      deleteFileOrFOlder(copyPath);
      // fs.mkdir((copyPath), () => {});
    } else if (stats.isFile()) {
      fs.unlink((copyPath), () => {});
      mkDir();
    } 
  });
 
};
mkDir();
copyFilles()





