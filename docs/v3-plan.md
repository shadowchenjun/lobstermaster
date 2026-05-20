# 龙大师官网 V3 建站规划

> 整理日期：2026-05-21  
> 状态：执行中（v3 分支）

---

## 一、版本演进回顾

| 版本 | 分支 | 定位 | 技术 | 问题 |
|------|------|------|------|------|
| V1 | gh-pages | "记录 AI 龙虾和主人探索边界的故事" | 纯 HTML 单页 | 无内容更新机制，像名片 |
| V2 | master/next | "让 AI 成为你的团队成员" | Next.js + Tailwind | 骨架有了，缺持续内容输出 |
| V3 | v3（本分支） | "用 AI 做事，把过程写下来" | Next.js 15 + MDX | — |

**核心转变**：从"AI 团队展示站"进化为**个人 AI 实践知识站**。

```
工具力（AI Agent 能力展示）
    +
知识力（项目学习 / AIcoding实践 / 他山之石）
    =
个人 AI 品牌
```

---

## 二、V3 导航结构

```
首页 · 📚 项目学习 · 💻 AIcoding实践 · 🪨 他山之石 · Skills市场 · 解决方案 · 联系我们
```

---

## 三、三个新栏目内容规划

### 📚 项目学习 `/project-learning`

**定位**：对优秀开源/商业项目进行三维解读。

**标准文章格式**：
```
标题：[项目名] 深度分析
---
项目基本面（star/fork/语言/定位）
技术架构解析（分层图 + 选型理由）
产品设计评估（用户价值/功能完整性/创新点）
运营策略拆解（商业化/社区/竞争格局）
SWOT + 综合评分
个人总结：我学到了什么
```

**选题方向**：
- AI 工具类（Cursor、v0、bolt.new 等）
- 开源基础设施（Supabase、Vercel 产品线）
- 爆款 GitHub 项目（如 awesome-gpt-image-2）
- 国内 AI 产品拆解

**更新节奏**：每 2 周 1 篇

**已发布**：
- [x] `awesome-gpt-image-2`：Prompt-as-Code 的工业级实践（2026-05-20）

---

### 💻 AIcoding实践 `/aicoding`

**定位**：用 AI 工具做项目的过程记录，侧重真实踩坑和感悟。

**标准文章格式**：
```
标题：[项目名] · AIcoding 实践记录
---
项目背景（做什么、为什么做）
工具选型（Claude Code / Cursor / Copilot...选哪个，为什么）
过程记录（关键节点 + 遇到的坑）
AI 协作效率评估
代码/产出展示
可复用经验总结
```

**选题方向**：
- 龙大师官网 V3 建站（第一篇，本次实践）
- Claude Code 实战专项
- 工具横向对比实验
- vibe coding 专题

**更新节奏**：每个真实项目结束后 1 篇

**待发布**：
- [ ] `lobstermaster-v3`：用 Claude Code 搭建龙大师 V3 全记录

---

### 🪨 他山之石 `/others-stones`

**定位**：从 Obsidian 整理输出的知识专栏，外部优质内容的二次加工。

**标准文章格式**：
```
标题：[主题关键词]
来源 + 整理日期
---
核心观点提炼（3~5 条）
原文关键引用
个人理解与延伸
如何用到自己身上
```

**选题方向**：
- 技术趋势类（AI Agent 发展/编程范式）
- 产品方法论（增长/定价/冷启动）
- 效率工具链
- 书摘/课程笔记

**更新节奏**：Obsidian 笔记成熟后推出，目标每周 1 篇

**关键任务**：建立 Obsidian → Git 自动同步管道（Obsidian Git 插件）

---

## 四、首页改版方案（V3 设计）

```
┌─────────────────────────────────────────┐
│  NAV（固定顶部导航）                      │
├─────────────────────────────────────────┤
│  HERO                                    │
│  🦞  用 AI 做事，把过程写下来             │
│  [开始探索]  [查看 Skills]               │
├─────────────────────────────────────────┤
│  STATS：20+ 任务 · 15+ Skills · 5+ 平台  │
├─────────────────────────────────────────┤
│  内容专栏（三栏卡片，核心新增板块）       │
│  [📚 项目学习] [💻 AIcoding] [🪨 他山之石]│
├─────────────────────────────────────────┤
│  近期文章（跨栏目混排，最新 6 篇）        │
├─────────────────────────────────────────┤
│  AI 能力展示（简化版 V1/V2 内容）        │
├─────────────────────────────────────────┤
│  CTA：联系龙大师                         │
└─────────────────────────────────────────┘
```

---

## 五、技术实现方案（方案 A：MDX 文件驱动）

### 目录结构

```
lobstermaster/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # V3 首页
│   │   ├── project-learning/
│   │   │   ├── page.tsx                    # 列表页
│   │   │   └── [slug]/page.tsx             # 文章页
│   │   ├── aicoding/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── others-stones/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   └── ArticleCard.tsx
│   └── lib/
│       └── mdx.ts                          # 文章读取工具
├── content/                                # ← 所有文章在这里
│   ├── project-learning/
│   │   └── awesome-gpt-image-2.mdx         # 第一篇
│   ├── aicoding/
│   └── others-stones/
└── docs/
    └── v3-plan.md                          # 本文件
```

### 写作工作流

```
Obsidian 写作
    → Obsidian Git 插件自动 commit
    → push 到 content/ 目录
    → Vercel/Cloudflare Pages 自动构建发布
```

### 文章 Frontmatter 规范

```yaml
---
title: "文章标题"
date: "YYYY-MM-DD"
category: "project-learning | aicoding | others-stones"
tags: ["标签1", "标签2"]
summary: "一句话摘要，显示在列表卡片上"
coverEmoji: "🎯"          # 可选，封面 emoji
github: "https://..."     # 可选，适用于项目学习
stars: 5700               # 可选，GitHub stars
rating: "8.1"             # 可选，综合评分
---
```

### 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 样式 | Tailwind CSS v3 + @tailwindcss/typography |
| 内容 | MDX + gray-matter + next-mdx-remote |
| 部署 | Vercel / Cloudflare Pages |
| 写作 | Obsidian + Obsidian Git 插件 |

---

## 六、迭代路线图

### V3.0 — 框架落地（当前阶段）
- [x] 首页 V3 设计，三专栏卡片区域
- [x] 三个栏目列表页路由
- [x] 文章详情页（MDX 渲染）
- [x] MDX 内容管道（`src/lib/mdx.ts`）
- [x] 项目学习第一篇：awesome-gpt-image-2 分析
- [ ] 安装依赖，本地验证构建
- [ ] 配置 Obsidian Git 同步 content/ 目录
- [ ] 部署到 Cloudflare Pages / Vercel

### V3.1 — 内容体验（1~2 个月）
- [ ] 文章目录（TOC）锚点导航
- [ ] 全站搜索（Fuse.js 本地方案）
- [ ] 标签筛选系统
- [ ] RSS Feed
- [ ] 阅读进度条 + 预估阅读时间
- [ ] 代码块一键复制

### V3.2 — 增长机制（3~6 个月）
- [ ] 邮件订阅（Resend）
- [ ] 评论系统（giscus，基于 GitHub Discussions）
- [ ] OG Image 自动生成（分享卡片）
- [ ] 微信社群沉淀入口

### V3.3 — 变现探索（视内容积累）
- [ ] Skills 市场下载付费
- [ ] 项目分析报告付费版
- [ ] 赞助商位

---

## 七、内容日历（滚动更新）

| 时间 | 栏目 | 主题 |
|------|------|------|
| 2026-05-20 | 项目学习 | awesome-gpt-image-2 深度分析 |
| 待定 | AIcoding实践 | 龙大师 V3 建站全记录 |
| 待定 | 他山之石 | Obsidian 笔记第一篇 |

---

*本文件随项目迭代持续更新*
