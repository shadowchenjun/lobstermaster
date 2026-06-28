import { createHmac, timingSafeEqual } from 'crypto'

export const DY_CUT_ACCESS_COOKIE = 'dy_cut_access'
export const DY_CUT_ACCESS_MAX_AGE = 60 * 60 * 24 * 30

export const protectedDyCutPaths = [
  '/aicoding/dy-cut-series',
  '/aicoding/douyin-takeout-video-ai-remix',
  '/aicoding/dy-cut-architecture',
  '/aicoding/dy-cut-team-onboarding',
  '/aicoding/douyin-takeout-video-study-notes',
  '/aicoding/inspiration-flow',
  '/aicoding/material-quality-full-report',
  '/aicoding/beatmix-experiment-flow',
  '/aicoding/dy-cut-vs-html-video-study-summary',
  '/aicoding/closed-loop-roadmap',
  '/aicoding/publish-distribution-progress-2026-06-29',
  '/douyin-takeout-ai-remix-share.html',
  '/dy-cut-architecture.html',
  '/dy-cut-team-onboarding.html',
  '/douyin-takeout-video-study-notes.html',
  '/inspiration-flow.html',
  '/material-quality-full-report.html',
  '/beatmix-experiment-flow.html',
  '/dy-cut-vs-html-video-study-summary.html',
  '/closed-loop-roadmap.html',
  '/publish-distribution-progress-2026-06-29.html',
]

export function normalizePhone(value: string) {
  return value.replace(/[^\d]/g, '')
}

export function getApprovedPhones() {
  return new Set(
    (process.env.DY_CUT_APPROVED_PHONES ?? '')
      .split(',')
      .map((phone) => normalizePhone(phone))
      .filter(Boolean),
  )
}

export function isApprovedPhone(phone: string) {
  return getApprovedPhones().has(normalizePhone(phone))
}

function getAccessSecret() {
  return process.env.DY_CUT_ACCESS_SECRET || 'local-dev-dy-cut-access-secret'
}

function signPayload(payload: string) {
  return createHmac('sha256', getAccessSecret()).update(payload).digest('hex')
}

export function createAccessToken(phone: string) {
  const normalized = normalizePhone(phone)
  const expires = Math.floor(Date.now() / 1000) + DY_CUT_ACCESS_MAX_AGE
  const payload = `v1.${normalized}.${expires}`
  return `${payload}.${signPayload(payload)}`
}

export function verifyAccessToken(token: string | undefined) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== 'v1') return false

  const payload = parts.slice(0, 3).join('.')
  const signature = parts[3]
  const expected = signPayload(payload)

  try {
    const left = Buffer.from(signature, 'hex')
    const right = Buffer.from(expected, 'hex')
    if (left.length !== right.length || !timingSafeEqual(left, right)) return false
  } catch {
    return false
  }

  const phone = normalizePhone(parts[1])
  const expires = Number(parts[2])
  if (!phone || !Number.isFinite(expires)) return false
  if (expires < Math.floor(Date.now() / 1000)) return false

  return isApprovedPhone(phone)
}

export function isProtectedDyCutPath(pathname: string) {
  return protectedDyCutPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}
