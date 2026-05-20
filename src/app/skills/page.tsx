import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Skills市场',
  description: '精选 AI Agent 技能，覆盖办公自动化、数据分析、创意生成、编程开发等场景，即装即用。',
}

const categories = [
  { key: 'all',       label: '全部' },
  { key: 'ai_agent',  label: 'AI Agent' },
  { key: 'office',    label: '智能办公' },
  { key: 'creative',  label: '创意生成' },
  { key: 'data',      label: '数据分析' },
  { key: 'tools',     label: '工具效率' },
]

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  ai_agent: { label: 'AI Agent', color: 'text-purple-600', bg: 'bg-purple-50' },
  office:   { label: '智能办公', color: 'text-blue-600',   bg: 'bg-blue-50'   },
  creative: { label: '创意生成', color: 'text-pink-600',   bg: 'bg-pink-50'   },
  data:     { label: '数据分析', color: 'text-emerald-600',bg: 'bg-emerald-50' },
  tools:    { label: '工具效率', color: 'text-amber-600',  bg: 'bg-amber-50'  },
}

interface Skill {
  id: string
  name: string
  subtitle: string
  description: string
  author: string
  category: string
  stars: number
  calls: number
  free: boolean
  featured?: boolean
}

const skills: Skill[] = [
  {
    id: 'agent-memory',
    name: 'Agent Memory',
    subtitle: 'AI Agent 持久记忆系统',
    description:
      '让 AI Agent 跨会话记住重要信息、经验教训与实体关系。基于本地 SQLite，无需 API Key 或注册，零门槛开箱即用。',
    author: 'claw123.ai',
    category: 'office',
    stars: 75,
    calls: 1949,
    free: true,
    featured: true,
  },
  {
    id: 'soul-md',
    name: 'SOUL.md',
    subtitle: 'AI Agent 身份认同框架',
    description:
      '通过 SOUL.md 为 AI Agent 建立稳定的身份认同：人格、价值观、行为边界，保持对话风格一致，同时防御 Prompt 注入攻击。零配置文档型技能。',
    author: 'claw123.ai',
    category: 'ai_agent',
    stars: 46,
    calls: 1241,
    free: true,
    featured: true,
  },
  {
    id: 'weather',
    name: 'Weather',
    subtitle: '免费全球天气查询',
    description:
      '通过 wttr.in 公开接口查询任意城市天气，完全免费，无需账号或 API Key，支持 JSON 输出与 50+ 语言，一行命令接入 Agent。',
    author: 'easyclaw',
    category: 'data',
    stars: 33,
    calls: 966,
    free: true,
  },
  {
    id: 'token-saver',
    name: 'Token Saver',
    subtitle: 'AI Agent Token 优化器',
    description:
      '通过心跳捎带、合并定时任务、任务委托等策略大幅降低 Token 消耗。基于 OpenClaw 官方框架文档提炼，可节省 60~90% Token 开销。',
    author: 'easyclaw',
    category: 'tools',
    stars: 26,
    calls: 419,
    free: true,
  },
  {
    id: 'emotion-sense',
    name: '情绪感知',
    subtitle: '用户情绪感知与语气调节',
    description:
      '实时检测用户情绪状态，自动调整 Agent 回复语气，让对话更温暖、更个性化。支持焦虑、愉悦、中性等多种情绪模式识别。',
    author: 'easyclaw',
    category: 'office',
    stars: 25,
    calls: 211,
    free: true,
  },
  {
    id: 'work-report',
    name: '工作汇报模板',
    subtitle: 'Agent 结构化工作汇报',
    description:
      '规范化 AI 向人类汇报工作的格式，清晰呈现完成状态、进行中任务、风险项与下一步计划，让 Agent 的工作透明可追踪。',
    author: 'easyclaw',
    category: 'office',
    stars: 19,
    calls: 156,
    free: true,
  },
  {
    id: 'ppt-sanwan',
    name: '三万风 PPT 生成器',
    subtitle: '白板美学 PPT 一键生成',
    description:
      '生成具有白板美学的 PPT：手写毛笔字体、卡通插图风格，标志性"戴龙虾帽的拉布拉多"吉祥物加持，让演示文档自带记忆点。',
    author: 'easyclaw',
    category: 'creative',
    stars: 17,
    calls: 344,
    free: true,
  },
  {
    id: 'task-decomposer',
    name: '智能任务拆解器',
    subtitle: '复杂需求自动分解',
    description:
      '将用户的复杂请求自动拆解为有序子任务列表，提升 Agent 执行效率，减少遗漏。支持依赖关系识别与优先级排序。',
    author: 'easyclaw',
    category: 'office',
    stars: 17,
    calls: 174,
    free: true,
  },
  {
    id: 'google-2fa',
    name: 'Google 2FA 生成器',
    subtitle: '纯 Node.js 动态验证码',
    description:
      '基于纯 Node.js 实现，从 Base32 种子密钥实时生成 6 位 Google Authenticator 验证码，零第三方依赖，可直接嵌入 Agent 工作流。',
    author: 'easyclaw',
    category: 'tools',
    stars: 16,
    calls: 68,
    free: true,
  },
  {
    id: 'fleet-evolution',
    name: '机器人舰队自进化',
    subtitle: '10 机器人协同自我进化系统',
    description:
      '10 机器人舰队的自我认知与进化：实时指标采集、System Prompt 自我感知注入、每周 GDI 五维度评分，让 Agent 团队持续成长。',
    author: 'claw123.ai',
    category: 'ai_agent',
    stars: 14,
    calls: 268,
    free: true,
  },
]

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
  const cat = categoryMeta[skill.category]
  const callsFormatted = skill.calls >= 1000
    ? `${(skill.calls / 1000).toFixed(1)}k`
    : skill.calls.toString()

  return (
    <div className={`group bg-white border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${skill.featured ? 'border-brand/30 ring-1 ring-brand/10' : 'border-gray-100'}`}>
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color} ${cat.bg}`}>
              {cat.label}
            </span>
            {skill.featured && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-brand bg-orange-50">
                🔥 热门
              </span>
            )}
          </div>
          <h3 className="font-bold text-navy text-base leading-snug group-hover:text-brand transition">
            {skill.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{skill.subtitle}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-sm font-bold ${skill.free ? 'text-emerald-600' : 'text-brand'}`}>
            {skill.free ? '免费' : '付费'}
          </div>
        </div>
      </div>

      {/* description */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
        {skill.description}
      </p>

      {/* footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <StarIcon />
            {skill.stars}
          </span>
          <span>📥 {callsFormatted} 次调用</span>
        </div>
        <span className="text-xs text-gray-400">by {skill.author}</span>
      </div>
    </div>
  )
}

export default function SkillsPage() {
  const featured = skills.filter((s) => s.featured)
  const topByCategory = Object.fromEntries(
    categories.slice(1).map((c) => [
      c.key,
      skills.filter((s) => s.category === c.key),
    ])
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* header */}
      <div className="mb-14">
        <div className="text-4xl mb-3">⚡</div>
        <h1 className="text-3xl font-extrabold text-navy mb-3">Skills 市场</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          精选 AI Agent 技能，覆盖智能办公、数据分析、创意生成、工具效率等场景。
          <br />即装即用，让你的 Agent 更强大。
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-brand rounded-full inline-block"></span>
            共 {skills.length} 个精选技能
          </span>
          <span>·</span>
          <a
            href="https://easyclaw.link/zh/market"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition"
          >
            数据来源：EasyClaw Market →
          </a>
        </div>
      </div>

      {/* featured */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">🔥</span>
          <h2 className="text-xl font-bold text-navy">热门精选</h2>
          <span className="text-sm text-gray-400 ml-1">调用量最高</span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {featured.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      </section>

      {/* by category */}
      {categories.slice(1).map((cat) => {
        const list = topByCategory[cat.key]
        if (!list || list.length === 0) return null
        return (
          <section key={cat.key} className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-bold text-navy">{cat.label}</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {list.length} 个
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((s) => (
                <SkillCard key={s.id} skill={s} />
              ))}
            </div>
          </section>
        )
      })}

      {/* cta */}
      <div className="mt-8 bg-gradient-to-br from-navy to-blue-900 rounded-2xl p-8 text-white text-center">
        <div className="text-3xl mb-3">🦞</div>
        <h3 className="text-xl font-bold mb-2">想把你的 Skill 上架？</h3>
        <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
          龙大师团队持续收录优质 AI Agent 技能。如果你有好用的 Skill，欢迎联系我们或前往 EasyClaw 社区发布。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-full hover:bg-orange-500 transition"
          >
            联系龙大师
          </Link>
          <a
            href="https://easyclaw.link/zh/market"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition border border-white/20"
          >
            前往 EasyClaw 发布 →
          </a>
        </div>
      </div>
    </div>
  )
}
