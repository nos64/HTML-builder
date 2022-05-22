const fs = require('fs');
const path = require('path');


const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const initialStyles = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');




const mkDir = async (folder) => {
  
  //Создаем папку project-dist
  fs.mkdir((folder), { recursive: true }, (err) => {
    if (err) console.log(err);
    //Создаем папку asses внутри project-dist
    fs.mkdir(path.join(folder, 'assets'), { recursive: true }, (err) => {
      if (err) console.log(err);
      //Читаем папку assets
      fs.readdir(
        assets,
        { withFileTypes: true },
        (err, files) => {
          if (err) console.log(err);
          files.forEach(item => {
            let file = path.join(assets, item.name);
            fs.stat(file, (err, stats) => {
              if (err) console.log(err);
              //Если внутри assets - файлы
              if(stats.isFile()) {
                fs.copyFile(
                  path.join(assets, item.name),
                  path.join(folder, 'assets', item.name),
                  (err) => {
                    if (err) console.log(err);
                  });
              }
              //Если внутри assets - папки
              else if(stats.isDirectory()) {
                fs.mkdir(path.join(folder, 'assets', item.name), { recursive: true }, (err) => {
                  if (err) console.log(err);
                  //Читаем каждую исходную папку
                  fs.readdir(path.join(assets, item.name),
                    { withFileTypes: true },
                    (err, files) => {
                      if (err) console.log(err);
                      //Перебираем файлы внутри
                      files.forEach(elem => {
                        //Копируем файлы
                        fs.copyFile(
                          path.join(assets, item.name, elem.name),
                          path.join(folder, 'assets', item.name, elem.name),
                          (err) => {
                            if (err) console.log(err);
                          });
                      });
                    });
                });
              }
            });
          });
        });
    });
  });
};

const mergeStyle = () => {
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
};


// const createIndexFile = async () => {
// //Читаем файл template
//   fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, data) => {
//     if (err) console.log(err);
//     let idexData = '';
//     idexData +=  data;

//     //Читаем папку с компонентами
//     fs.readdir(components,
//       { withFileTypes: true },
//       (err, files) => {
//         if (err) console.log(err);

//         //Перебираем компоненты
//         for (const item of files) {
//         // files.forEach(async item => {
//           let file = path.join(components, item.name);
//           fs.stat(file, (err, stats) => {
//             if (err) console.log(err);

//             //Для каждого компонента с расширением html
//             if(stats.isFile() && path.parse(file).ext.slice(1) === 'html') {

//               //Читаем компонент
//               fs.readFile(file, 'utf8', (err, data) => {
//                 if (err) console.log(err);
//                 //Заменяем {{компонент}} на содержимое файла компонента
//                 idexData =  idexData.replace(`{{${path.parse(file).name}}}`, data);

//                 //Записываем в файл index.html
//                 fs.writeFile(path.join(projectDist, 'index.html'), idexData, err => {
//                   if (err) console.log(err);
//                 });
//               });
//             }
//           });
//         }
//         // });
//       });
//   });
// };


const createIndexFile = async () => {
  //Читаем файл template
  const template = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8');

  //Читаем папку с компонентами
  const componentsList = await fs.promises.readdir(components);
  let idexData = template;
 
  //Перебираем компоненты
  for await (let item of componentsList) {
    let file = path.join(components, item);
    const stats = await fs.promises.stat(file);

    //Для каждого компонента с расширением html
    if(stats.isFile() && path.parse(file).ext.slice(1) === 'html') {
      //Читаем компонент
      const componentText = await fs.promises.readFile(file, 'utf8');
    
      //Заменяем {{компонент}} на содержимое файла компонента
      idexData =  idexData.replace(`{{${path.parse(file).name}}}`, componentText)
    }
  }
  //Записываем в файл index.html
  await fs.promises.writeFile(path.join(projectDist, 'index.html'), idexData);   
};


const buildPage = async () => {
  await fs.promises.rm(projectDist, { recursive: true, force: true });
  mkDir(projectDist);
  createIndexFile();
  mergeStyle();
};

buildPage();