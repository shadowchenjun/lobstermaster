import type { Metadata } from 'next'
import ArticleCard from '@/components/ArticleCard'
import { getArticles } from '@/lib/mdx'

export const metadata: Metadata = {
  title: '他山之石',
  description: '从 Obsidian 整理输出的知识专栏，外部优质内容的二次加工与个人延伸。',
}

export default function OthersStonesPage() {
  const articles = getArticles('others-stones')

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-4xl mb-3">🪨</div>
        <h1 className="text-3xl font-extrabold text-navy mb-3">他山之石</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          从 Obsidian 笔记蒸馏输出的知识专栏。不只是转发，而是经过消化、提炼和个人延伸的二次创作。<br />
          <strong>核心观点提炼</strong> · <strong>关键引用</strong> · <strong>个人理解与延伸</strong> · <strong>如何用到自己身上</strong>
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-amber-500 rounded-full inline-block"></span>
          共 {articles.length} 篇 · 笔记成熟后定期输出
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📓</div>
          <p>Obsidian 笔记整理中，即将输出…</p>
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
