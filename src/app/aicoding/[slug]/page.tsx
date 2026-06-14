import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { DY_CUT_ACCESS_COOKIE, isProtectedDyCutPath, verifyAccessToken } from '@/lib/dyCutAccess'
import { getArticle, getArticles } from '@/lib/mdx'

const CATEGORY = 'aicoding'

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

  const articlePath = `/aicoding/${slug}`
  if (isProtectedDyCutPath(articlePath)) {
    const cookieStore = await cookies()
    const token = cookieStore.get(DY_CUT_ACCESS_COOKIE)?.value
    if (!verifyAccessToken(token)) {
      const returnTo = article.directUrl ?? articlePath
      redirect(`/aicoding/dy-cut-access?returnTo=${encodeURIComponent(returnTo)}`)
    }
  }

  if (article.directUrl) redirect(article.directUrl)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-brand">首页</Link>
        <span>/</span>
        <Link href="/aicoding" className="hover:text-brand">AIcoding实践</Link>
        <span>/</span>
        <span className="text-gray-600">{article.title}</span>
      </div>

      <div className="mb-2">
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          💻 AIcoding实践
        </span>
      </div>
      <h1 className="text-3xl font-extrabold text-navy mt-3 mb-4 leading-tight">
        {article.title}
      </h1>
      <p className="text-gray-500 text-base mb-6 leading-relaxed">{article.summary}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100 mb-10">
        {article.date && <span>📅 {article.date}</span>}
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

      <article className="prose prose-lg prose-gray max-w-none">
        <MDXRemote
          source={article.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>

      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link href="/aicoding" className="text-brand font-semibold hover:underline text-sm">
          ← 返回 AIcoding实践
        </Link>
      </div>
    </div>
  )
}
