<!--
 * @Author: 33357
 * @Date: 2021-02-05 13:15:37
 * @LastEditTime: 2021-02-06 11:04:06
 * @LastEditors: 33357
-->

# unichat-app-public

unichat App端开源信息

## 目录

- [项目背景](#项目背景)
- [相关项目](#相关项目)
- [项目结构](#项目结构)
- [安装说明](#安装说明)
- [使用说明](#使用说明)
- [额外信息](#额外信息)
- [维护成员](#维护成员)
- [加入贡献](#加入贡献)
- [开源许可](#开源许可)

## 项目背景

想要了解unichat项目背景请访问：[unichat-public](https://github.com/33357/unichat-public)

## 相关项目

想要了解相关项目请访问：[unichat-public](https://github.com/33357/unichat-public)

## 项目结构

```
unichat-app-public
├── babel.config.js
├── LICENSE                                     //开源协议
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md                                   //说明文件
├── src                                         //源代码
│   ├── App.vue                                 //应用生命周期
│   ├── components                              //额外组件
│   ├── css                                     //css文件
│   │   └── chat.scss                           //chat页面css
│   ├── index.html                              //html模板
│   ├── main.js                                 //uniapp入口文件
│   ├── manifest.json                           //uniapp配置
│   ├── pages                                   //页面文件
│   │   ├── home                                //首页页面
│   │   │   ├── chat.vue                        //chat页面
│   │   │   └── home.vue                        //home页面
│   │   └── open                                //全局页面
│   │       ├── businessCard.vue                //businessCard页面
│   │       └── login.vue                       //login页面
│   ├── pages.json                              //页面配置
│   ├── static                                  //资源文件
│   │   ├── iconfont                            //字体文件
│   │   └── image                               //图片文件
│   ├── store                                   //vuex
│   │   ├── extend                              //扩展功能
│   │   │   ├── avatar.js                       //头像生成
│   │   │   ├── contractABI.js                  //智能合约ABI
│   │   │   ├── log.js                          //日志处理
│   │   │   ├── math.js                         //计算封装
│   │   │   └── uniapp.js                       //uniappAPI封装
│   │   ├── index.js                            //vuex入口文件
│   │   ├── model                               //model
│   │   │   ├── home                            
│   │   │   │   ├── chat.js                     //chat页面model
│   │   │   │   └── home.js                     //home页面model
│   │   │   └── open
│   │   │       ├── businessCard.js             //businessCard页面model
│   │   │       └── login.js                    //login页面model
│   │   └── net                                 //网络功能
│   │       ├── httpAPI.js                      //API封装
│   │       ├── web3Provider.js                 //web3提供商封装
│   │       └── websocket.js                    //websocket封装
│   ├── uni.scss                                //uniapp默认css
│   └── uview-ui                                //uview组件
├── tsconfig.json
└── yarn.lock
```

## 安装说明

安装依赖
```
npm install
```

## 使用说明

项目测试：
```
npm run dev:h5
```

项目发行：
```
npm run build:h5
```

## 额外部分

See [Configuration Reference](https://cli.vuejs.org/config/).

## 维护成员

[@33357](https://github.com/33357)

## 加入贡献

暂不支持加入贡献，但欢迎发起讨论。

## 开源协议

[MIT](LICENSE)
