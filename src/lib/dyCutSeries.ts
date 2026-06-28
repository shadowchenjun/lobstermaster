export const dyCutSeries = [
  {
    href: '/douyin-takeout-ai-remix-share.html',
    title: 'dy-cut 项目说明书',
    kicker: '01 · 项目总览',
    desc: '从项目背景、主批处理流水线、AI 能力整合、使用说明和已知限制理解 dy-cut 的生产主干。',
    phase: 'run',
  },
  {
    href: '/dy-cut-architecture.html',
    title: '系统架构图',
    kicker: '02 · 三线架构',
    desc: '把 run 主链路、beatmix 口播卡点链路、inspiration 拍摄灵感链路放在一张系统地图里。',
    phase: 'architecture',
  },
  {
    href: '/dy-cut-team-onboarding.html',
    title: '团队导览',
    kicker: '03 · 新人地图',
    desc: '面向协作者的项目地图：主流程、beatmix、素材质量、最佳实践和上手路线。',
    phase: 'onboarding',
  },
  {
    href: '/douyin-takeout-video-study-notes.html',
    title: '优秀抖音外卖视频学习笔记',
    kicker: '04 · 对标拆解',
    desc: '从优秀餐饮外卖样片里提炼钩子、节奏、景别、字幕和可自动化规则。',
    phase: 'research',
  },
  {
    href: '/inspiration-flow.html',
    title: 'inspiration 拍摄灵感流程',
    kicker: '05 · 创意挖掘',
    desc: '把爆款视频拆成视觉、剪辑、内容和情绪因子，生成逐套餐拍摄建议。',
    phase: 'inspiration',
  },
  {
    href: '/material-quality-full-report.html',
    title: '批量素材质量评估报告',
    kicker: '06 · 素材质检',
    desc: '用 tier、分数、品类覆盖和 Top 10 样本判断哪些素材适合进入混剪。',
    phase: 'quality',
  },
  {
    href: '/beatmix-experiment-flow.html',
    title: 'beatmix 口播 BGM 卡点流程',
    kicker: '07 · 口播卡点',
    desc: '用 voicemap、素材打标、质量评分、槽位编排、去重和并行渲染实现声画同步。',
    phase: 'beatmix',
  },
  {
    href: '/dy-cut-vs-html-video-study-summary.html',
    title: 'dy-cut vs html-video 学习总结',
    kicker: '08 · 工具对比',
    desc: '比较真实素材混剪主链路和 HTML 动效层的分工，梳理后续融合方向。',
    phase: 'compare',
  },
  {
    href: '/closed-loop-roadmap.html',
    title: '素材-视频-投放闭环路线图',
    kicker: '09 · 闭环路线图',
    desc: '把 PG 素材库、beatmix 质量闭环、复审成片库、投放评估、拍摄指导和效果插件串成下一阶段路线。',
    phase: 'roadmap',
  },
  {
    href: '/publish-distribution-progress-2026-06-29.html',
    title: '发布分发策略与开发进展',
    kicker: '10 · 账号分发',
    desc: '把 beatmix 从单 BGM 出片推进到多账号整日跑批，梳理 round-robin 分发、PG 素材源、publish.json 和按账号去重。',
    phase: 'publish',
  },
]

export type DyCutSeriesItem = (typeof dyCutSeries)[number]
