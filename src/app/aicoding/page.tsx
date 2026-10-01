import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getArticles } from '@/lib/mdx'
import { projectColumnCards } from '@/lib/projectSeries'

export const metadata: Metadata = {
  title: 'AIcoding实践',
  description: '用 AI 工具做项目的全过程记录：工具选型、踩坑经历、效率评估。',
}

export default function AICodingPage() {
  const articles = getArticles('aicoding')

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-4xl mb-3">💻</div>
        <h1 className="text-3xl font-extrabold text-navy mb-3">AIcoding实践</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          用 AI 工具做项目的全过程记录。每篇都是一次真实的 AI 协作经历：<br />
          <strong>工具选型</strong> · <strong>过程踩坑</strong> · <strong>效率评估</strong> · <strong>可复用经验</strong>
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
          共 {articles.length} 篇 · 每个真实项目结束后更新
        </div>
      </div>

      <section className="mb-12 border-t border-gray-200 pt-7" aria-labelledby="project-columns">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="project-columns" className="text-xl font-extrabold text-navy">项目专栏</h2>
          <span className="text-sm text-gray-500">{projectColumnCards.length} 个项目</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {projectColumnCards.map((column) => (
            <Link key={column.slug} href={column.href} className="group flex min-w-0 flex-col border border-gray-200 rounded-lg bg-white p-5 transition hover:border-brand">
              <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                <span>{column.count ? `${column.count} 篇文档` : '待收录'}</span>
                <span>审批访问</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy group-hover:text-brand">{column.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{column.description}</p>
              <span className="mt-5 text-sm font-semibold text-brand">进入专栏 <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <h2 className="mb-6 text-xl font-extrabold text-navy">实践文章</h2>
      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">⌨️</div>
          <p>龙大师 V3 建站过程将作为第一篇记录…</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
