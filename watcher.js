const chokidar = require('chokidar');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

//监听的文件
const watchFile = path.join(__dirname, "/pages/**/*.scss")

console.log(watchFile)
chokidar.watch(watchFile).on('all', (event, file) => {
  const { dir, name, ext } = path.parse(file);
  //忽略以_开头的文件
  if(name.startsWith('_')){
    return;
  }
  if (ext != '.scss') {
    return
  }
  // console.log(event, file);

  //编译生成的wxss文件目录
  // let target = path.join(path.resolve(dir,'..'),'pages')
  let target = dir
  function conversion(file) {
    /**
     * outputStyle: 
     * "expanded" （Dart Sass 的默认设置）将每个选择器和声明写在自己的行上。
      "compressed" 删除尽可能多的额外字符，并将整个样式表写在一行上。
      "nested"（Node Sass 的默认设置，Dart Sass 不支持）缩进 CSS规则以匹配 Sass 源的嵌套。
      compact（不受 Dart Sass 支持）将每个CSS规则放在自己的单行上。
      * 
      */
    sass.render({
      file: file,
      outputStyle: "expanded"
    }, function(err, result) { 
      if(!err){
        const newFile = `${target}/${name}.wxss`
        fs.writeFile(newFile, result.css, function(err){
            if(!err){
              //file written on disk
              console.log(`updated ${newFile}`)
            }
        });
      } else {
        console.log(err)
        setTimeout(()=> {
          /**
           * 由于windos下可能出现vscode等编辑器锁定了文件而造成了文件不可读
           * 参考地址：https://github.com/michaelwayman/node-sass-chokidar/issues/14
           *
           * 处理方案使用setTimeout可解决
           *  */
          conversion(file)
        })
      }
    });
  }
  conversion(file)  
});