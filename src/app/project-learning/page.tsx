import type { Metadata } from 'next'
import ArticleCard from '@/components/ArticleCard'
import { getArticles } from '@/lib/mdx'

export const metadata: Metadata = {
  title: '项目学习',
  description: '对优秀开源/商业项目进行技术、产品、运营三维深度解读。',
}

export default function ProjectLearningPage() {
  const articles = getArticles('project-learning')

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* header */}
      <div className="mb-12">
        <div className="text-4xl mb-3">📚</div>
        <h1 className="text-3xl font-extrabold text-navy mb-3">项目学习</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          对优秀开源 / 商业项目进行三维解读：<br />
          <strong>技术架构</strong>（如何实现）·
          <strong>产品设计</strong>（如何体验）·
          <strong>运营策略</strong>（如何增长）
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-brand rounded-full inline-block"></span>
          共 {articles.length} 篇 · 每 2 周更新一篇
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔭</div>
          <p>第一篇分析正在路上…</p>
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
