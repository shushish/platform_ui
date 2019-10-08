# salesaide-ui

## 准备工作
- node.js环境（npm包管理器）

- vue-cli 脚手架构建w工具
npm install --global vue-cli
- 使用内网加速
npm config set registry  http://192.168.13.220:5050/repository/bhome-npm/

> A Vue.js project

## 开发运行

``` bash
# 安装依赖
npm install

# 本地开发 开启服务 localhost:8080
npm run dev
# 浏览器访问 http://localhost:8080
```

##### 兼容IE9/IE10可能会遇到语法或者 Promise错误，安装 babel-polyfill
```bash
npm install babel-polyfill
npm install babel-preset-es2015-ie
```


## 发布
```bash
# 构建生成环境
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 目录结构

```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── filtres                // 全局filter
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── views                   // views
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
├── .babelrc                   // babel-loader 配置
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 注意事项

- api暴露的方法名和后台访问的方法名必须保持一致
- 不常用的组件不在main.js里面加载