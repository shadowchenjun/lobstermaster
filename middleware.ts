import { NextRequest, NextResponse } from 'next/server'

const DY_CUT_ACCESS_COOKIE = 'dy_cut_access'

const protectedDyCutPaths = [
  '/aicoding/dy-cut-series',
  '/aicoding/douyin-takeout-video-ai-remix',
  '/aicoding/dy-cut-architecture',
  '/aicoding/dy-cut-team-onboarding',
  '/aicoding/douyin-takeout-video-study-notes',
  '/aicoding/inspiration-flow',
  '/aicoding/material-quality-full-report',
  '/aicoding/beatmix-experiment-flow',
  '/aicoding/dy-cut-vs-html-video-study-summary',
  '/douyin-takeout-ai-remix-share.html',
  '/dy-cut-architecture.html',
  '/dy-cut-team-onboarding.html',
  '/douyin-takeout-video-study-notes.html',
  '/inspiration-flow.html',
  '/material-quality-full-report.html',
  '/beatmix-experiment-flow.html',
  '/dy-cut-vs-html-video-study-summary.html',
]

function normalizePhone(value: string) {
  return value.replace(/[^\d]/g, '')
}

function isProtectedDyCutPath(pathname: string) {
  return protectedDyCutPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function getApprovedPhones() {
  return new Set(
    (process.env.DY_CUT_APPROVED_PHONES ?? '')
      .split(',')
      .map((phone) => normalizePhone(phone))
      .filter(Boolean),
  )
}

function getAccessSecret() {
  return process.env.DY_CUT_ACCESS_SECRET || 'local-dev-dy-cut-access-secret'
}

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function signPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getAccessSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return bytesToHex(signature)
}

async function hasValidAccess(token?: string) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== 'v1') return false

  const phone = normalizePhone(parts[1])
  const expires = Number(parts[2])
  if (!phone || !Number.isFinite(expires)) return false
  if (expires < Math.floor(Date.now() / 1000)) return false

  const approved = getApprovedPhones()
  if (!approved.has(phone)) return false

  const payload = parts.slice(0, 3).join('.')
  const expected = await signPayload(payload)
  return expected === parts[3]
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isProtectedDyCutPath(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(DY_CUT_ACCESS_COOKIE)?.value
  if (await hasValidAccess(token)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/aicoding/dy-cut-access'
  url.searchParams.set('returnTo', `${pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
