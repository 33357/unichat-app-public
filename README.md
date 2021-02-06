<!--
 * @Author: 33357
 * @Date: 2021-02-05 13:15:37
 * @LastEditTime: 2021-02-06 10:15:59
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

unichat-app-public
├── babel.config.js
├── LICENSE
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── src
│   ├── App.vue
│   ├── components
│   ├── css
│   │   └── chat.scss
│   ├── index.html
│   ├── main.js
│   ├── manifest.json
│   ├── pages
│   │   ├── home
│   │   │   ├── chat.vue
│   │   │   └── home.vue
│   │   └── open
│   │       ├── businessCard.vue
│   │       └── login.vue
│   ├── pages.json
│   ├── static
│   │   ├── iconfont
│   │   └── image
│   ├── store
│   │   ├── extend
│   │   │   ├── avatar.js
│   │   │   ├── contractABI.js
│   │   │   ├── log.js
│   │   │   ├── math.js
│   │   │   └── uniapp.js
│   │   ├── index.js
│   │   ├── model
│   │   │   ├── home
│   │   │   └── open
│   │   └── net
│   │       ├── httpAPI.js
│   │       ├── web3Provider.js
│   │       └── websocket.js
│   ├── uni.scss
│   └── uview-ui
├── tsconfig.json
└── yarn.lock

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

暂不支持加入贡献，但可以发起讨论。

## 开源协议

[MIT](LICENSE) © Richard Littauer
