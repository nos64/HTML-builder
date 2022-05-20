const fs = require('fs');
const path = require('path');

const filesCopy = path.resolve(__dirname, 'files-copy');
const files = path.join(__dirname, 'files');

const deleteFile = (folder) => {
  fs.readdir(folder,
    { withFileTypes: true },
    (err, files) => {
    if(err) throw err;
    files.forEach(item =>{
      let file = path.resolve(folder, item.name);
      fs.stat(file, (errStat, stats) => {
        if(errStat) throw errStat;
        if(stats.isDirectory()){
          fs.rmdir((file), (err) => {
            if (!err) fs.rmdir((file), () => {console.log('Удален файл ' + file);})
            else {
              deleteFile(file)
              console.log('file: ', file);
              
            }
          });
       }else if (stats.isFile()) {
        fs.unlink((folder, file), () => {});
        } 
        // else {
        //   fs.rmdir((filesCopy, file), () => {})
        // };
      })
    })
  })
}

deleteFile(filesCopy)

// const mkDir = () => {
//   fs.stat(path.join(__dirname, 'files-copy'), (err, stats) => {
//     if (err) { 
//       fs.mkdir(path.join(__dirname, 'files-copy'), () => {});
//     } else if (stats.isDirectory()) {
//       fs.unlink(path.join(__dirname, 'files-copy'), () => {});
//         // process.exit();
//     } else if (stats.isFile()) {
//       fs.unlink(path.join(__dirname, 'files-copy'), () => {});
//       mkDir();
//     } 
//   });
// };
// mkDir();

// fs.stat(path.join(__dirname, 'files-copy'), (err, stats) => {
//   if (err) { 
//     fs.mkdir(path.join(__dirname, 'files-copy'), () => {});
//   } else {
//     // fs.rmdir(path.join(__dirname, 'files-copy'), err => {});
//     // fs.mkdir(path.join(__dirname, 'files-copy'), () => {});
//     fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
//       if(err) throw err;
//       files.forEach(item => {
//         fs.stat(path.join(__dirname, 'files-copy'), (err, item) => {
//           if(err) throw err;
//           if(stats.isDerictory()){
//             console.log('Папка: ' + item.name);
//             listObjects(path + '/' + item.name);
//           }else{
//             console.log('Файл: ' + item.name);
//          }
//         })
//       })
//     })

    
//   }
// })


// fs.readdir(
//   path.join(__dirname, 'files'),
//   { withFileTypes: true },
//   (err, files) => {
//     if (err) console.log(err);
//     files.forEach(item => {
//       fs.copyFile(path.join(__dirname, 'files', item.name), path.join(__dirname, 'files-copy', item.name), (err) => {
//         if (err) {
//           console.log("Error Found:", err);
//         }
//       });
//     });
//   });

