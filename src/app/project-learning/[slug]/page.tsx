import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getArticle, getArticles } from '@/lib/mdx'

const CATEGORY = 'project-learning'

export async function generateStaticParams() {
  return getArticles(CATEGORY).map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(CATEGORY, slug)
  if (!article) return {}
  return { title: article.title, description: article.summary }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(CATEGORY, slug)
  if (!article) notFound()
  if (article.directUrl) redirect(article.directUrl)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-brand">首页</Link>
        <span>/</span>
        <Link href="/project-learning" className="hover:text-brand">项目学习</Link>
        <span>/</span>
        <span className="text-gray-600">{article.title}</span>
      </div>

      {/* meta */}
      <div className="mb-2">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          📚 项目学习
        </span>
      </div>
      <h1 className="text-3xl font-extrabold text-navy mt-3 mb-4 leading-tight">
        {article.title}
      </h1>
      <p className="text-gray-500 text-base mb-6 leading-relaxed">{article.summary}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100 mb-10">
        {article.date && <span>📅 {article.date}</span>}
        {article.github && (
          <a href={article.github} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
            ⭐ GitHub
            {article.stars ? ` · ${(article.stars / 1000).toFixed(1)}k Stars` : ''}
          </a>
        )}
        {article.rating && (
          <span className="text-brand font-semibold">综合评分 {article.rating} / 10</span>
        )}
      </div>

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {article.tags.map((t) => (
            <span key={t} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* content */}
      <article className="prose prose-lg prose-gray max-w-none">
        <MDXRemote
          source={article.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>

      {/* back */}
      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link href="/project-learning" className="text-brand font-semibold hover:underline text-sm">
          ← 返回项目学习
        </Link>
      </div>
    </div>
  )
}
