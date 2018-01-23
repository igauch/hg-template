/*
 * 描述：creatFileByRouterConfig.js
 * 作者：twj94
 * 创建时间：2017/12/7
 * 版权：Copyright 2017 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
const fs = require('fs');
const path = require('path');
const routerJson = require('../src/router/config.json');
const exec = require('child_process').exec;
const chalk = require('chalk');

const routerArr = routerJson.children;
let importCpsArr = ['import Vue from \'vue\'', 'import Router from \'vue-router\''];

const forTree = (data, currentPath) => {
  const importCpsCurrentPath = currentPath.replace('/src', '');
  data.forEach((val) => {
    if (val.children) {
      val.component = 'root';

      if (fs.existsSync(val.name)) {
        forTree(val.children, currentPath);
      } else {
        if(!fs.existsSync(path.resolve(__dirname, `${currentPath + val.name}`))){
          fs.mkdirSync(path.resolve(__dirname, `${currentPath + val.name}`));
        }
        forTree(val.children, `${currentPath + val.name}/`);
      }
    } else {
      importCpsArr.push(`import ${val.name} from '${importCpsCurrentPath + val.name}.vue'`);
      val.component = val.name;

      if(fs.existsSync(path.resolve(__dirname, `${currentPath + val.name}.vue`))){
        console.log(chalk.yellow(path.resolve(__dirname, `${currentPath + val.name}.vue`)+' 文件已经存在，已跳过'));
      }else {
        fs.writeFileSync(path.resolve(__dirname, `${currentPath + val.name}.vue`),
          `<template>\n    <div>\n\n    </div>\n</template>\n\n<script>\n    export default {\n        name: '${val.name}'\n    }\n</script>\n\n<style lang=\"scss\">\n    .${val.name.replace(/([A-Z])/g, "-$1").toLowerCase()}{\n\n    }\n</style>\n`);
      }
    }
  });
};

// 创建文件和导入数组
if(fs.existsSync(path.resolve(__dirname, '../src/views'))){
  exec(`svn delete views --force && svn cleanup && svn mkdir views`, {cwd: path.resolve(__dirname, '../src/')}, error => {
    if (error) {
      console.error(`exec error3: ${error}`);
      return false;
    }
    forTree(routerArr, '../src/views/');
    svnadd();
  });
}else {
  exec(`svn mkdir views`, {cwd: path.resolve(__dirname, '../src/')}, error => {
    if (error) {
      console.error(`exec error2: ${error}`);
      return false;
    }
    forTree(routerArr, '../src/views/');
    svnadd();
  });
}
function svnadd() {
  exec(`svn add . --no-ignore --force`, {cwd: path.resolve(__dirname, '../src/views')}, error => {
    if (error) {
      console.error(`exec error1: ${error}`);
      return false;
    }
    console.log(chalk.green('创建文件成功'));
  });
}

const importCpsStr = importCpsArr.join('\n');
// 创建路由JS文件，避免动态加载组件带来的开发不便（热更新的异常，因为只要改变总会请求，带来的时间上不友好的体验）
let routerIndexJson = {
  "path": "/",
  "name": "root",
  "redirect": `${routerArr[0].name}`,
  component: "root",
  "children": routerArr
};
fs.writeFile(path.resolve(__dirname, '../src/router/index.js'),
  `${importCpsStr}
    
Vue.use(Router);

const root = Vue.component('root', {
    template: '<router-view></router-view>'
});

export let router = new Router({
    routes: [
        ${JSON.stringify(routerIndexJson).replace(/"component":([^"]*)"([^"]*)"/g, '"component":$1$2')},
        {
            "path": "/*",
            "redirect": "/"
        }
    ]
});

router.beforeEach((to, from, next) => {
    // 修改body的class，方便区分不同页面的样式差异
    document.getElementsByTagName('body')[0].className=to.name.replace(/([A-Z])/g, "-$1").replace(/^-(.*)/,'$1').toLowerCase();
});`, error => {
    if (error) {
      console.error(`exec error: ${error}`);
      return false;
    }
    console.log(chalk.green(`重写${ chalk.blue(' router/index.js ') }文件成功`));
  });
