# 博士生生活科研手账

一个静态优先的博士生公开数字花园，用于记录博士生活、科研日志、阅读笔记、项目档案和网站幕后更新。

## 本地开发

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 查看站点。

## 验证

```bash
npm run typecheck
npm run build
```

## 内容维护

主要内容放在 `content/` 目录：

- `content/journal`：生活手账、周记、月记、阶段反思
- `content/research`：科研日志、组会记录、实验记录
- `content/reading`：论文、书籍和文章阅读笔记
- `content/projects`：科研项目、代码项目和个人工具
- `content/behind`：网站设计理念、技术栈和更新日志

新增文章时复制同类型已有 `.mdx` 文件，修改 frontmatter 和正文即可。

## 新增文章

以新增一篇阅读笔记为例：

1. 在 `content/reading/` 下创建 `your-note-slug.mdx`。
2. 复制已有阅读笔记的 frontmatter。
3. 修改 `title`、`date`、`summary`、`tags` 等字段。
4. 正文使用 Markdown 写作。
5. 运行 `npm run dev` 本地预览。

示例：

```mdx
---
title: "一篇新的阅读笔记"
date: "2026-05-23"
type: "reading"
itemType: "paper"
authors: ["Author Name"]
year: 2026
summary: "这篇文献解决了什么问题。"
oneLine: "我从这篇文献中带走的一句话。"
readingStatus: "read"
importance: "medium"
tags: ["阅读笔记", "方法"]
draft: false
---

## Why I Read This

写下阅读原因。

## Main Ideas

整理主要观点。
```

## 内容字段说明

所有内容通用字段：

- `title`：标题
- `date`：日期，建议使用 `YYYY-MM-DD`
- `type`：内容类型，支持 `journal`、`research`、`reading`、`project`、`behind`
- `summary`：摘要，会显示在卡片和详情页
- `tags`：标签数组
- `pinned`：是否置顶，可选
- `draft`：是否草稿，`true` 时不会出现在页面中

## 部署到 Vercel

1. 把本目录推送到 GitHub。
2. 登录 Vercel，选择导入该仓库。
3. Framework Preset 选择 `Next.js`。
4. Build Command 使用默认 `next build`。
5. Install Command 使用默认 `npm install`。
6. 部署完成后即可访问公开站点。

第一阶段不需要数据库、登录、评论或后台管理。所有公开内容都来自 `content/` 目录。
