# hg-dashboard

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 依赖  
* 支持svn命令行

# 和HG
* `npm run hg` 即可拉取或更新HG  
* hg只保留和svn库的联系，不允许提交操作 
* 因HG需要，增加了对一些库的依赖，已直接写入packages

# sass  
* 增加对sass的支持和全局变量的支持
* 全局变量为`HG/styles/var.scss` 

# 路由和视图文件 
* `npm run cr` 即可根据配置文件`router/config.json`自动创建视图文件，和创建或更新路由配置`router/index.js` 
* **`npm run cr`会删除views后再创建文件！所以不要轻易运行！一定要在项目开始的时候就先将路由配置编写完整！后续的修改请自行到对应文件修改！**

# 其他更改  
* 自动根据当前路由设置body的class，例如当前激活路由的name为HG1,则body的class为h-g1

# todo  
* 热更新 
* 自动打开浏览器
* 优化打包
* 一键换肤
