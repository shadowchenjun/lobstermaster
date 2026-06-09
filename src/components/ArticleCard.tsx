import Link from 'next/link'
import type { ArticleMeta } from '@/lib/mdx'

const categoryMeta: Record<string, { label: string; emoji: string; color: string }> = {
  'project-learning': { label: '项目学习', emoji: '📚', color: 'text-indigo-600 bg-indigo-50' },
  'aicoding':         { label: 'AIcoding实践', emoji: '💻', color: 'text-emerald-600 bg-emerald-50' },
  'others-stones':    { label: '他山之石', emoji: '🪨', color: 'text-amber-600 bg-amber-50' },
}

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const meta = categoryMeta[article.category]
  const href = article.directUrl ?? `/${article.category}/${article.slug}`

  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
          {meta.emoji} {meta.label}
        </span>
        {article.date && (
          <span className="text-xs text-gray-400">{article.date}</span>
        )}
      </div>

      <h3 className="font-bold text-navy text-base leading-snug mb-2 group-hover:text-brand transition">
        {article.coverEmoji && <span className="mr-1">{article.coverEmoji}</span>}
        {article.title}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{article.summary}</p>

      {article.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {article.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              #{t}
            </span>
          ))}
        </div>
      )}

      {article.rating && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
          <span>综合评分</span>
          <span className="font-bold text-brand">{article.rating}</span>
          <span>/ 10</span>
        </div>
      )}
    </Link>
  )
}
