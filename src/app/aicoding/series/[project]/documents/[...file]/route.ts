import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { DY_CUT_ACCESS_COOKIE, verifyAccessToken } from '@/lib/dyCutAccess'
import { documentUrl, getProjectSeries, seriesUrl } from '@/lib/projectSeries'

export const dynamic = 'force-dynamic'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ project: string; file: string[] }> }) {
  const { project, file } = await params
  const series = getProjectSeries(project)
  const filename = file.join('/')
  const index = series?.documents.findIndex((document) => document.file === filename) ?? -1
  const isSupportingFile = series?.supportingFiles?.includes(filename) ?? false
  if (!series || (index < 0 && !isSupportingFile)) return new NextResponse('Not found', { status: 404 })

  if (!verifyAccessToken(request.cookies.get(DY_CUT_ACCESS_COOKIE)?.value)) {
    const target = new URL('/aicoding/dy-cut-access', request.url)
    target.searchParams.set('returnTo', documentUrl(project, filename))
    return NextResponse.redirect(target)
  }

  const filePath = path.join(process.cwd(), 'protected-content', 'series', project, filename)
  const imageType = ({ '.png': 'image/png', '.jpg': 'image/jpeg' } as Record<string, string>)[path.extname(filename)]
  if (isSupportingFile && imageType) {
    const image = await readFile(filePath)
    return new NextResponse(new Uint8Array(image), { headers: { 'content-type': imageType, 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow', 'x-content-type-options': 'nosniff' } })
  }
  const source = await readFile(filePath, 'utf8')
  if (isSupportingFile) {
    return new NextResponse(source, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } })
  }

  const previous = series.documents[index - 1]
  const next = series.documents[index + 1]
  const navLink = (href: string, title: string) => `<a href="${escapeHtml(href)}">${escapeHtml(title)}</a>`
  const navigation = `<style>#lm-series-nav{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center;padding:14px 20px;background:#fff;color:#27312f;border-bottom:1px solid #dce3df;font:14px/1.6 system-ui,sans-serif;letter-spacing:0}#lm-series-nav a{color:#176759;text-decoration:none}#lm-series-nav a:hover{text-decoration:underline}#lm-series-nav span{margin-right:auto}</style><nav id="lm-series-nav" aria-label="专栏导航">${navLink('/aicoding', 'AIcoding实践')}<span>${navLink(seriesUrl(project), series.title)}</span>${previous ? navLink(documentUrl(project, previous.file), `上一篇：${previous.title}`) : ''}${next ? navLink(documentUrl(project, next.file), `下一篇：${next.title}`) : ''}</nav>`
  const body = source.replace(/<body\b[^>]*>/i, (tag) => `${tag}${navigation}`)
  return new NextResponse(body, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } })
}
