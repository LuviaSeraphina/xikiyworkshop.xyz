---
title: 我的 2026 技术栈
slug: my-tech-stack-2026
date: 2026-07-18
category: 技术
tags: [前端, Next.js, 云存储]
cover: /images/cover-2.jpg
excerpt: 一个以 Next.js 为核心的轻量技术栈，配合 Markdown 内容和 Cloudflare R2，足够支撑个人网站的快速迭代。
---

# 为什么选择 Next.js

个人网站最怕两件事：一是改起来麻烦，二是部署成本高。Next.js 的 App Router 让页面、布局和数据读取都可以模块化，新增一个页面几乎不会影响已有页面。

## 前端生态

我用 TypeScript 保证类型安全，用 Tailwind CSS 快速实现统一的设计系统。手绘风格的视觉主要由 CSS 动效、自定义字体和插画素材完成，没有引入沉重的 UI 框架。

## 内容与存储

文章以 Markdown 文件存放在仓库中，构建时读取；图片和云盘文件放在 Cloudflare R2。这样内容天然具备版本历史，部署也很简单。

## 为什么这样组合

- 静态构建，部署到任何静态托管都能运行。
- 开发模式可以动态编辑，生产模式不会留下管理入口。
- 数据模型集中，未来加评论、加页面、换主题都不会伤筋动骨。
