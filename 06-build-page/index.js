const fs = require('fs');
const path = require('path');


const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const initialStyles = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');




// const mkDir = async (folder) => {
//   //Создаем папку project-dist
//   fs.mkdir((folder), { recursive: true }, (err) => {
//     if (err) console.log(err);
//     //Создаем папку asses внутри project-dist
//     fs.mkdir(path.join(folder, 'assets'), { recursive: true }, (err) => {
//       if (err) console.log(err);
//       //Читаем папку assets
//       fs.readdir(
//         assets,
//         { withFileTypes: true },
//         (err, files) => {
//           if (err) console.log(err);
//           files.forEach(item => {
//             let file = path.join(assets, item.name);
//             fs.stat(file, (err, stats) => {
//               if (err) console.log(err);
//               //Если внутри assets - файлы
//               if(stats.isFile()) {
//                 fs.copyFile(
//                   path.join(assets, item.name),
//                   path.join(folder, 'assets', item.name),
//                   (err) => {
//                     if (err) console.log(err);
//                   });
//               }
//               //Если внутри assets - папки
//               else if(stats.isDirectory()) {
//                 fs.mkdir(path.join(folder, 'assets', item.name), { recursive: true }, (err) => {
//                   if (err) console.log(err);
//                   //Читаем каждую исходную папку
//                   fs.readdir(path.join(assets, item.name),
//                     { withFileTypes: true },
//                     (err, files) => {
//                       if (err) console.log(err);
//                       //Перебираем файлы внутри
//                       files.forEach(elem => {
//                         //Копируем файлы
//                         fs.copyFile(
//                           path.join(assets, item.name, elem.name),
//                           path.join(folder, 'assets', item.name, elem.name),
//                           (err) => {
//                             if (err) console.log(err);
//                           });
//                       });
//                     });
//                 });
//               }
//             });
//           });
//         });
//     });
//   });
// };

const copyAssets = async () => {

  const assetsProject = await fs.promises.mkdir(path.join(projectDist, 'assets'), { recursive: true })
  const initialAssets = await fs.promises.readdir(assets, { withFileTypes: true });

  for await (const item of initialAssets) {
    let file = path.join(assets, item.name);
    if (item.isFile()) {
      await fs.promises.copyFile(path.join(initialAssets, item.name), path.join(assetsProject, item.name));
    } else if (item.isDirectory()) {
      const assetsProjectFolder = await fs.promises.mkdir(path.join(assetsProject, item.name), { recursive: true });
      const initialAssetsFolder = await fs.promises.readdir(file);

      for await (const initialAssetsFile of initialAssetsFolder) {
        await fs.promises.copyFile(
          path.join(assets, item.name, initialAssetsFile),
          path.join(assetsProjectFolder, initialAssetsFile)
        );
      }
    }
  }
};

const mergeStyle = async () => {
  const styleFiles = await fs.promises.readdir(initialStyles, { withFileTypes: true });
  let styleData = '';

  for await (const item of styleFiles) {
    let file = path.join(initialStyles, item.name);

    if (item.isFile() && path.parse(file).ext === '.css') {
      const style = await fs.promises.readFile(file, 'utf-8');
      styleData += style;
    }
  }
  await fs.promises.writeFile(path.join(projectDist, 'style.css'), styleData);

};

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
    if (stats.isFile() && path.parse(file).ext.slice(1) === 'html') {
      //Читаем компонент
      const componentText = await fs.promises.readFile(file, 'utf8');
      //Заменяем {{компонент}} на содержимое файла компонента
      idexData = idexData.replace(`{{${path.parse(file).name}}}`, componentText);
    }
  }
  //Записываем в файл index.html
  await fs.promises.writeFile(path.join(projectDist, 'index.html'), idexData);

};


const buildPage = async () => {
  await fs.promises.rm(projectDist, { recursive: true, force: true });
  await fs.promises.mkdir(projectDist, { recursive: true });
  copyAssets();
  createIndexFile();
  mergeStyle();
};

buildPage();