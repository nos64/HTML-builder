const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const projectDist = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const initialStyles = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');

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


//Читаем файл template
fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, data) => {
  if (err) console.log(err);
  let idexData = '';
  idexData += data;

  //Читаем папку с компонентами
  fs.readdir(components,
    { withFileTypes: true },
    (err, files) => {
      if (err) console.log(err);

      //Перебираем компоненты
      files.forEach(item => {
        let file = path.join(components, item.name);
        fs.stat(file, (err, stats) => {
          if (err) console.log(err);

          //Для каждого компонента с расширением html
          if(stats.isFile() && path.parse(file).ext.slice(1) === 'html') {

            //Читаем компонент
            fs.readFile(file, 'utf8', (err, data) => {
              if (err) console.log(err);
              //Заменяем {{компонент}} на содержимое файла компонента
              idexData = idexData.replace(`{{${path.parse(file).name}}}`, data);

              //Записываем в файл index.html
              fs.writeFile(path.join(projectDist, 'index.html'), idexData, err => {
                if (err) console.log(err);
              });
            });
          }
        });
      });
    });
});

mkDir();
mergeStyle();