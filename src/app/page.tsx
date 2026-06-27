import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getAllArticles } from '@/lib/mdx'

const columns = [
  {
    href: '/project-learning',
    emoji: '📚',
    title: '项目学习',
    desc: '对优秀开源 / 商业项目进行技术、产品、运营三维深度解读，提炼可复用的分析框架。',
    color: 'from-indigo-50 to-blue-50',
    border: 'border-indigo-100',
    badge: 'text-indigo-600 bg-indigo-100',
  },
  {
    href: '/aicoding',
    emoji: '💻',
    title: 'AIcoding实践',
    desc: '用 AI 工具做项目的全过程记录：工具选型、踩坑经历、效率评估、可复用经验。',
    color: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
    badge: 'text-emerald-600 bg-emerald-100',
  },
  {
    href: '/others-stones',
    emoji: '🪨',
    title: '他山之石',
    desc: '从 Obsidian 整理输出的知识专栏，对外部优质内容进行二次加工与个人延伸。',
    color: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    badge: 'text-amber-600 bg-amber-100',
  },
]

const stats = [
  { num: '20+', label: '定时任务' },
  { num: '15+', label: 'Skills' },
  { num: '5+', label: '平台接入' },
  { num: '持续', label: '内容更新' },
]

const capabilities = [
  { icon: '💻', title: '代码与开发', desc: '写代码、调 Bug、做 Code Review、自动化脚本' },
  { icon: '📝', title: '内容与写作', desc: '写报告、生成文案、整理笔记、制作 PPT 提纲' },
  { icon: '📊', title: '数据与分析', desc: '数据清洗、生成图表、市场分析、竞品对比' },
  { icon: '🔗', title: '跨平台集成', desc: '飞书、微信、邮件、GitHub、Slack 多平台联动' },
]

export default function HomePage() {
  const latest = getAllArticles().slice(0, 6)

  return (
    <div className="bg-cream">
      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-brand text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-orange-100">
          🧬 龙大师 AI 家族 · V3
        </div>
        <div className="text-7xl mb-6 animate-bounce">🦞</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4">
          用 AI 做事<br />
          <span className="text-brand">把过程写下来</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          记录一只 AI 龙虾和它的主人，一起探索 AI 能力边界的故事。
          <br />这里有项目分析、工具实践，也有从 Obsidian 蒸馏出来的知识精华。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/project-learning"
            className="px-6 py-3 bg-brand text-white font-semibold rounded-full hover:bg-orange-600 transition shadow-md shadow-orange-100"
          >
            开始探索 →
          </Link>
          <Link
            href="/solutions"
            className="px-6 py-3 bg-white text-navy font-semibold rounded-full border border-gray-200 hover:border-brand hover:text-brand transition"
          >
            查看 Skills
          </Link>
          <Link
            href="/resume"
            className="px-6 py-3 bg-navy text-white font-semibold rounded-full hover:bg-slate-800 transition"
          >
            查看简历
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-brand">{s.num}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THREE COLUMNS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-2">内容专栏</p>
          <h2 className="text-3xl font-extrabold text-navy">三个持续更新的栏目</h2>
          <p className="text-gray-500 mt-3">每篇都是真实经历和思考的沉淀</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <Link
              key={col.href}
              href={col.href}
              className={`group block bg-gradient-to-br ${col.color} border ${col.border} rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
            >
              <div className="text-5xl mb-4">{col.emoji}</div>
              <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${col.badge}`}>
                {col.title}
              </div>
              <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-brand transition">
                {col.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{col.desc}</p>
              <div className="mt-6 text-sm font-semibold text-brand group-hover:gap-2 flex items-center gap-1 transition-all">
                查看文章 <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LATEST ARTICLES ── */}
      {latest.length > 0 && (
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest text-brand uppercase mb-1">最新发布</p>
                <h2 className="text-2xl font-extrabold text-navy">近期文章</h2>
              </div>
              <Link href="/project-learning" className="text-sm text-brand font-semibold hover:underline">
                查看全部 →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((a) => (
                <ArticleCard key={`${a.category}-${a.slug}`} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CAPABILITIES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-2">AI 能力</p>
          <h2 className="text-3xl font-extrabold text-navy">人用电脑能干的，它都能干</h2>
          <p className="text-gray-500 mt-3">全天候自动化运行，越用越懂你</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((c) => (
            <div key={c.title} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-navy mb-2">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-5xl mb-4">🦞</div>
          <h2 className="text-3xl font-extrabold mb-4">想让 AI 也为你工作？</h2>
          <p className="text-blue-200 mb-8 max-w-md mx-auto">
            一起探索 AI Agent 的边界，或者聊聊你的场景需求。
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-brand text-white font-semibold rounded-full hover:bg-orange-500 transition shadow-lg shadow-orange-900/30"
          >
            联系龙大师
          </Link>
        </div>
      </section>
    </div>
  )
}
