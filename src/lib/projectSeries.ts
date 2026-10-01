import { dyCutSeries } from './dyCutSeries'

export type ProjectDocument = { file: string; title: string; description: string }
export type ProjectSeries = {
  slug: string
  title: string
  description: string
  documents: ProjectDocument[]
  supportingFiles?: string[]
}

export const projectSeries: ProjectSeries[] = [
  {
    slug: 'perfectoken',
    title: 'perfectoken 升级改造',
    description: '从支付与会员架构到模型网关选型、融合方案和 PoC 验证，记录平台的升级改造。',
    documents: [
      { file: 'pt-pay-architecture.html', title: '支付、会员与邀请架构', description: 'pt-pay 与 New API 的关系、充值、退款、补单对账及会员邀请链路。' },
      { file: 'gateway-comparison.html', title: 'LiteLLM 与 New API 对比', description: '对比模型网关能力、技术边界与适用场景。' },
      { file: 'gateway-integration.html', title: 'New API 与 LiteLLM 融合方案', description: '融合架构、协议转换、用量统计与部署设计。' },
      { file: 'gateway-poc.html', title: '融合 PoC 验证清单', description: '配置草稿与验证用例，记录方案落地前的验证步骤。' },
    ],
  },
  {
    slug: 'sinochem-assistant',
    title: '中化智能助手',
    description: '中化商务智能助手的使用手册、技术交接、需求评审与大模型选型记录。',
    supportingFiles: ['img/10-float.png', 'img/01-collect-demo.jpg', 'img/02-collect-result.jpg', 'img/03-collect-bottom.jpg', 'img/04-fill-plan.jpg', 'img/05-fill-result.jpg', 'img/06-target-page.jpg', 'img/08-history.jpg', 'img/09-settings.jpg'],
    documents: [
      { file: 'user-manual.html', title: '智能助手使用手册', description: '智能采集、文件解析、智能填写、历史记录和管理配置，含操作截图。' },
      { file: 'technical-handover.html', title: '智能助手技术交接文档', description: '总体架构、核心流程、数据留存、安全机制、部署与验证边界；2026-09-24 文档快照。' },
      { file: 'requirements-review.html', title: '需求匹配度评审（2026-09-23）', description: '对照 V3 建设方案记录需求匹配、实现差异、已落地优化和待决策事项。' },
      { file: 'model-selection.html', title: '大模型选型对比（2026-09-28）', description: 'GLM 与 MiniMax 在要素抽取任务中的准确性、填写错误、耗时与评测记录。' },
    ],
  },
  {
    slug: 'funeng',
    title: '赋能平台',
    description: '以农业数据驾驶舱为入口，记录市场行情、产业数据和平台能力的演进。',
    documents: [
      { file: 'industry-dashboard.html', title: '农业产业驾驶舱 V2', description: '总览、种植养殖、市场行情、冷链流通、产业风险及供应链金融的交互原型。' },
      { file: 'market-dashboard.html', title: '农产品市场行情驾驶舱 V1', description: '品类切换、地区筛选、行情搜索、公开来源与数据导出。' },
    ],
  },
  {
    slug: 'mediaflow',
    title: 'AI 视频分析及生成系统',
    description: 'MediaFlow 的系统设计与实现记录：素材分析、自然语言选材、章节编排和成片生成。',
    supportingFiles: ['plans/2026-09-13-multimodal-video-library-composer-spec.md', '01-实施记录.md', '02-自然语言选材实施.md', 'stages/README.md', '04-specs-评审采纳.md'],
    documents: [
      { file: 'system-overview.html', title: '系统完整说明与实现状态', description: '完整业务流程、16 项任务、素材模型、功能地图与验证证据。' },
      { file: 'architecture.html', title: '系统架构设计', description: '两条核心流水线、技术选型、执行契约、可靠性与验收边界。' },
    ],
  },
]

export function getProjectSeries(slug: string) {
  return projectSeries.find((series) => series.slug === slug)
}

export function seriesUrl(slug: string) {
  return `/aicoding/series/${slug}`
}

export function documentUrl(slug: string, file: string) {
  return `${seriesUrl(slug)}/documents/${file.split('/').map(encodeURIComponent).join('/')}`
}

export const projectColumnCards = [
  { slug: 'dy-cut', title: 'dy-cut 抖音外卖视频剪辑', description: '项目说明、系统架构、拍摄灵感、素材质检、口播卡点与闭环路线图。', href: '/aicoding/dy-cut-series', count: dyCutSeries.length },
  ...projectSeries.map((series) => ({ ...series, href: seriesUrl(series.slug), count: series.documents.length })),
]
