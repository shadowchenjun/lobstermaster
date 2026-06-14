import { NextRequest, NextResponse } from 'next/server'
import {
  DY_CUT_ACCESS_COOKIE,
  DY_CUT_ACCESS_MAX_AGE,
  createAccessToken,
  isApprovedPhone,
  normalizePhone,
} from '@/lib/dyCutAccess'

function safeReturnTo(value: FormDataEntryValue | null) {
  const raw = typeof value === 'string' ? value : ''
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/aicoding/dy-cut-series'
}

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const phone = normalizePhone(String(form.get('phone') ?? ''))
  const returnTo = safeReturnTo(form.get('returnTo'))

  if (phone.length < 8) {
    const url = new URL('/aicoding/dy-cut-access', request.url)
    url.searchParams.set('status', 'invalid')
    url.searchParams.set('returnTo', returnTo)
    return NextResponse.redirect(url)
  }

  if (!isApprovedPhone(phone)) {
    const url = new URL('/aicoding/dy-cut-access', request.url)
    url.searchParams.set('status', 'pending')
    url.searchParams.set('phone', phone)
    url.searchParams.set('returnTo', returnTo)
    return NextResponse.redirect(url)
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url))
  response.cookies.set({
    name: DY_CUT_ACCESS_COOKIE,
    value: createAccessToken(phone),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DY_CUT_ACCESS_MAX_AGE,
  })
  return response
}
