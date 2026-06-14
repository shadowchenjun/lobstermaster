import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import { protectedDyCutPaths, verifyAccessToken, DY_CUT_ACCESS_COOKIE } from '@/lib/dyCutAccess'

type RouteContext = {
  params: Promise<{
    htmlFile: string
  }>
}

const protectedHtmlFiles = new Set(
  protectedDyCutPaths
    .filter((item) => item.endsWith('.html'))
    .map((item) => item.slice(1)),
)

export async function GET(request: NextRequest, context: RouteContext) {
  const { htmlFile } = await context.params
  if (!protectedHtmlFiles.has(htmlFile)) {
    notFound()
  }

  const token = request.cookies.get(DY_CUT_ACCESS_COOKIE)?.value
  if (!verifyAccessToken(token)) {
    const url = new URL('/aicoding/dy-cut-access', request.url)
    url.searchParams.set('returnTo', `/${htmlFile}`)
    return NextResponse.redirect(url)
  }

  const filePath = path.join(process.cwd(), 'protected-content', 'dy-cut', htmlFile)
  const body = await readFile(filePath, 'utf-8')
  return new NextResponse(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'private, no-store',
    },
  })
}
