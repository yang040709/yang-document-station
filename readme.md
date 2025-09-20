# Yang 的文档站

这个网站基于[vitepress](https://github.com/vuejs/vitepress)搭建的

## 介绍

这是我的文档站，也是我的博客，用来记录我学习前端过程中整理的文档，还有我平时记录的笔记，还有我总结 ai 总结的一些经验和知识。

## 启动项目

首先请确保安装了 node 环境，建议使用 nvm 进行 node 版本的管理
然后安装 pnpm

```bash
npm i -g pnpm
```

安装依赖

```bash
pnpm i
```

启动开发服务器

```bash
pnpm dev
```

## 如何编写文档

在 docs 文件下编写 md 文件即可
然后可以在 vitepress/config.ts 中跟着我的配置进行配置项目的导航，具体配置详细过程请查看[vite 文档](https://vitepress.dev/zh/)
