import type { Metadata } from 'next'
import ArticleCard from '@/components/ArticleCard'
import { getArticles } from '@/lib/mdx'

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

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">⌨️</div>
          <p>龙大师 V3 建站过程将作为第一篇记录…</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}
