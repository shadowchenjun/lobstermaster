import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '解决方案',
  description: '龙大师团队 AI 落地实践：农业赋能平台、云认养系统、极简 TodoList，从 0 到 1 的真实案例。',
}

/* ── Types ── */
interface TechPill {
  label: string
  type: 'frontend' | 'backend' | 'db' | 'ai' | 'infra'
}

interface Feature {
  icon: string
  title: string
  desc: string
}

interface Project {
  id: string
  emoji: string
  tag: string
  tagColor: string
  name: string
  subtitle: string
  summary: string
  github: string
  demo?: string
  techStack: TechPill[]
  features: Feature[]
  highlights: string[]
  accentFrom: string
  accentTo: string
  borderColor: string
}

/* ── Data ── */
const pillColors: Record<TechPill['type'], string> = {
  frontend: 'text-blue-600 bg-blue-50 border-blue-100',
  backend:  'text-emerald-600 bg-emerald-50 border-emerald-100',
  db:       'text-violet-600 bg-violet-50 border-violet-100',
  ai:       'text-pink-600 bg-pink-50 border-pink-100',
  infra:    'text-amber-600 bg-amber-50 border-amber-100',
}

const projects: Project[] = [
  {
    id: 'funeng',
    emoji: '🌾',
    tag: '农业科技',
    tagColor: 'text-emerald-700 bg-emerald-100',
    name: '现代农业赋能平台',
    subtitle: 'funeng · Agricultural Management SaaS',
    summary:
      '面向农业企业的全栈产品管理与销售平台，打通从商品录入、分类管理到移动端展示的完整链路，让农产品管理像操作电商后台一样简单。',
    github: 'https://github.com/shadowchenjun/funeng',
    techStack: [
      { label: 'Vue 3', type: 'frontend' },
      { label: 'TypeScript', type: 'frontend' },
      { label: 'Element Plus', type: 'frontend' },
      { label: 'Pinia', type: 'frontend' },
      { label: 'Vite', type: 'infra' },
      { label: 'FastAPI', type: 'backend' },
      { label: 'Python 3.9+', type: 'backend' },
      { label: 'SQLAlchemy', type: 'backend' },
      { label: 'MySQL 8.0', type: 'db' },
      { label: 'JWT', type: 'infra' },
      { label: '微信 OAuth', type: 'infra' },
      { label: 'Docker', type: 'infra' },
    ],
    features: [
      {
        icon: '🔐',
        title: '多角色权限体系',
        desc: '管理员、编辑、访客、客户四级 RBAC，微信 OAuth 一键登录，JWT 鉴权，企业级安全。',
      },
      {
        icon: '📦',
        title: '全链路产品管理',
        desc: '商品 CRUD、分类管理、图片上传压缩、移动端自适应，覆盖农产品从录入到展示的完整流程。',
      },
      {
        icon: '📊',
        title: 'Swagger API 文档',
        desc: '后端自动生成 Swagger UI / ReDoc 接口文档，前后端协作效率翻倍，支持第三方对接。',
      },
      {
        icon: '🐳',
        title: '一键容器化部署',
        desc: 'Docker Compose 快速启动，支持 Gunicorn + Nginx 生产部署，开发到上线路径清晰。',
      },
    ],
    highlights: [
      '微信生态深度集成，适配国内农业企业使用习惯',
      'Vue 3 + FastAPI 前后端分离，团队可独立并行迭代',
      '图片本地存储 + 压缩优化，节省 CDN 成本',
    ],
    accentFrom: 'from-emerald-50',
    accentTo: 'to-teal-50',
    borderColor: 'border-emerald-100',
  },
  {
    id: 'tangyuan',
    emoji: '🌾',
    tag: '农文旅数字化',
    tagColor: 'text-amber-700 bg-amber-100',
    name: '汤原大米云认养平台',
    subtitle: 'tangyuan-farming · Cloud Adoption System',
    summary:
      '将黑龙江汤原的稻田搬上手机屏幕。消费者购买认养订单后，可通过 H5 实时查看土地证书、IoT 传感器数据和产品溯源信息，把一袋大米变成一段可感知的农耕体验。',
    github: 'https://github.com/shadowchenjun/tangyuan-farming',
    techStack: [
      { label: 'Vue 3', type: 'frontend' },
      { label: 'TypeScript', type: 'frontend' },
      { label: 'Element Plus', type: 'frontend' },
      { label: 'Vite', type: 'infra' },
      { label: 'Express.js', type: 'backend' },
      { label: 'FastAPI', type: 'backend' },
      { label: 'Supabase', type: 'db' },
      { label: 'SMS 验证码', type: 'infra' },
      { label: 'IoT 集成', type: 'ai' },
    ],
    features: [
      {
        icon: '📜',
        title: '数字土地证书',
        desc: '每块认养田地生成专属数字证书，包含地块信息、认养人信息和区块链式溯源记录。',
      },
      {
        icon: '📡',
        title: 'IoT 实时监测',
        desc: '接入田间传感器数据，消费者可查看土壤湿度、温度、生长阶段等实时农业数据。',
      },
      {
        icon: '🔗',
        title: '产品全链路溯源',
        desc: '从播种到餐桌，每个环节记录上链，消费者扫码即可追溯大米的完整生命周期。',
      },
      {
        icon: '📱',
        title: 'H5 移动优先',
        desc: '专为微信内嵌 H5 设计，短信验证码登录，无需下载 App，消费帮扶场景即开即用。',
      },
    ],
    highlights: [
      '"消费帮扶 + 数字农业"双轨模式，契合乡村振兴政策方向',
      'IoT + 溯源 + 认养三位一体，构建差异化产品壁垒',
      'H5 轻量部署，快速接入电商平台消费后链路',
    ],
    accentFrom: 'from-amber-50',
    accentTo: 'to-yellow-50',
    borderColor: 'border-amber-100',
  },
  {
    id: 'todo',
    emoji: '✅',
    tag: '效率工具',
    tagColor: 'text-indigo-700 bg-indigo-100',
    name: '极简 TodoList',
    subtitle: 'todo.lobstermaster.me · Focus on What Matters',
    summary:
      '去掉一切干扰，只留下任务本身。龙大师团队自用的极简待办清单，专注于让你快速记录、快速完成、快速清空大脑。没有多余的功能，因为最好的工具就是不打扰你工作的工具。',
    github: 'https://github.com/shadowchenjun/lobstermaster',
    demo: 'https://todo.lobstermaster.me',
    techStack: [
      { label: 'Next.js', type: 'frontend' },
      { label: 'TypeScript', type: 'frontend' },
      { label: 'Tailwind CSS', type: 'frontend' },
      { label: 'Vercel', type: 'infra' },
    ],
    features: [
      {
        icon: '⚡',
        title: '零摩擦录入',
        desc: '打开即用，无需注册，键盘回车即完成任务添加，最小化操作路径。',
      },
      {
        icon: '🎯',
        title: '专注单一任务',
        desc: '极简界面设计，让注意力始终在任务上，而不是在工具的功能上。',
      },
      {
        icon: '📱',
        title: '全平台响应式',
        desc: '手机、平板、桌面完美适配，随时随地记录和管理你的待办事项。',
      },
      {
        icon: '🦞',
        title: '龙大师团队自用',
        desc: '真实使用场景打磨，不是为了做产品而做，是因为自己需要而做。',
      },
    ],
    highlights: [
      '极简主义设计哲学：功能不是越多越好，而是刚好够用',
      '龙大师团队日常使用，持续根据真实需求迭代',
      '开源代码，可 Fork 自部署，完全掌控数据',
    ],
    accentFrom: 'from-indigo-50',
    accentTo: 'to-purple-50',
    borderColor: 'border-indigo-100',
  },
]

/* ── Components ── */
function TechBadge({ pill }: { pill: TechPill }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pillColors[pill.type]}`}>
      {pill.label}
    </span>
  )
}

function ProjectSection({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0
  return (
    <section
      id={project.id}
      className={`rounded-3xl bg-gradient-to-br ${project.accentFrom} ${project.accentTo} border ${project.borderColor} overflow-hidden`}
    >
      {/* top bar */}
      <div className="px-8 pt-8 pb-6 border-b border-black/5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${project.tagColor}`}>
                {project.tag}
              </span>
              <span className="text-xs text-gray-400">{project.subtitle}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy flex items-center gap-3">
              <span className="text-4xl">{project.emoji}</span>
              {project.name}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-navy hover:text-navy transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-brand px-4 py-2 rounded-full hover:bg-orange-600 transition shadow-sm"
              >
                🔗 在线体验
              </a>
            )}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="p-8 grid md:grid-cols-5 gap-8">
        {/* left: summary + highlights + tech */}
        <div className={`md:col-span-2 flex flex-col gap-6 ${isEven ? '' : 'md:order-2'}`}>
          <p className="text-gray-600 leading-relaxed text-sm">{project.summary}</p>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">核心亮点</h4>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-brand mt-0.5 flex-shrink-0">✦</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">技术栈</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((p) => (
                <TechBadge key={p.label} pill={p} />
              ))}
            </div>
          </div>
        </div>

        {/* right: feature grid */}
        <div className={`md:col-span-3 grid sm:grid-cols-2 gap-4 ${isEven ? '' : 'md:order-1'}`}>
          {project.features.map((f) => (
            <div key={f.title} className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-navy text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Page ── */
export default function SolutionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* header */}
      <div className="mb-14">
        <div className="text-4xl mb-3">🚀</div>
        <h1 className="text-3xl font-extrabold text-navy mb-3">解决方案</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          龙大师团队用 AI 辅助开发的真实项目落地案例。
          <br />从农业数字化到效率工具，每个项目都是一次从 0 到 1 的完整实践。
        </p>
        {/* jump links */}
        <div className="mt-6 flex flex-wrap gap-3">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-100 px-3 py-1.5 rounded-full hover:border-brand hover:text-brand transition"
            >
              {p.emoji} {p.name}
            </a>
          ))}
        </div>
      </div>

      {/* project sections */}
      <div className="space-y-10">
        {projects.map((project, i) => (
          <ProjectSection key={project.id} project={project} index={i} />
        ))}
      </div>

      {/* cta */}
      <div className="mt-16 bg-navy rounded-3xl p-10 text-white text-center">
        <div className="text-4xl mb-3">🦞</div>
        <h2 className="text-2xl font-extrabold mb-3">有项目想用 AI 落地？</h2>
        <p className="text-blue-200 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
          无论是农业数字化、内部效率工具还是 AI Agent 系统，龙大师团队提供从需求分析、架构设计到交付部署的全程支持。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 bg-brand text-white font-semibold rounded-full hover:bg-orange-500 transition shadow-lg shadow-orange-900/20"
          >
            联系我们
          </Link>
          <Link
            href="/project-learning"
            className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition"
          >
            查看项目学习 →
          </Link>
        </div>
      </div>
    </div>
  )
}
