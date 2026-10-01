import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { DY_CUT_ACCESS_COOKIE, verifyAccessToken } from '@/lib/dyCutAccess'
import { documentUrl, getProjectSeries, projectColumnCards, seriesUrl } from '@/lib/projectSeries'

type Props = { params: Promise<{ project: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const series = getProjectSeries((await params).project)
  return series ? { title: series.title, description: series.description } : {}
}

export default async function ProjectSeriesPage({ params }: Props) {
  const { project } = await params
  const series = getProjectSeries(project)
  if (!series) notFound()
  if (!verifyAccessToken((await cookies()).get(DY_CUT_ACCESS_COOKIE)?.value)) {
    redirect(`/aicoding/dy-cut-access?returnTo=${encodeURIComponent(seriesUrl(project))}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/aicoding" className="text-sm font-semibold text-brand hover:underline">返回 AIcoding实践</Link>
      <nav aria-label="项目专栏" className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-b border-gray-200 pb-5 text-sm">
        {projectColumnCards.map((column) => (
          <Link key={column.slug} href={column.href} aria-current={column.slug === project ? 'page' : undefined}
            className={column.slug === project ? 'font-bold text-brand' : 'text-gray-500 hover:text-brand'}>{column.title}</Link>
        ))}
      </nav>
      <header className="py-9">
        <p className="text-sm text-gray-500">项目专栏 · {series.documents.length} 篇文档</p>
        <h1 className="mt-3 text-3xl font-extrabold text-navy">{series.title}</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">{series.description}</p>
      </header>
      {series.documents.length ? (
        <ol className="border-t border-gray-200">
          {series.documents.map((document, index) => (
            <li key={document.file} className="border-b border-gray-200">
              <Link href={documentUrl(project, document.file)} className="group flex gap-5 py-6 hover:bg-white">
                <span className="w-8 shrink-0 text-sm text-gray-400">{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1"><h2 className="text-lg font-bold text-navy group-hover:text-brand">{document.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{document.description}</p></div>
                <span aria-hidden="true" className="text-brand">→</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : <p className="border-t border-gray-200 py-8 text-gray-500">文档待收录。</p>}
    </div>
  )
}
