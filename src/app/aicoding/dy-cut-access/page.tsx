import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'dy-cut 系列访问申请',
  description: '提交手机号，审批通过后访问 dy-cut 系列内容。',
}

type AccessPageProps = {
  searchParams?: Promise<{
    returnTo?: string
    status?: string
    phone?: string
  }>
}

function statusCopy(status?: string) {
  if (status === 'pending') {
    return '手机号已提交，但暂未在白名单中。请联系管理员审批后再试。'
  }
  if (status === 'invalid') {
    return '请输入有效手机号。'
  }
  return ''
}

export default async function DyCutAccessPage({ searchParams }: AccessPageProps) {
  const params = (await searchParams) ?? {}
  const returnTo = params.returnTo?.startsWith('/') ? params.returnTo : '/aicoding/dy-cut-series'
  const message = statusCopy(params.status)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fff7ed]">
      <div className="mx-auto flex max-w-5xl flex-col px-6 py-16 md:flex-row md:items-center md:gap-14">
        <section className="flex-1">
          <Link href="/aicoding" className="text-sm font-semibold text-brand hover:underline">
            ← AIcoding实践
          </Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-widest text-brand">
            Private Series
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            dy-cut 系列内容访问申请
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600">
            这个系列包含抖音外卖视频剪辑项目的架构、流程、素材质量和实验记录。
            请输入已审批手机号，系统会校验线上白名单后开放访问。
          </p>
        </section>

        <section className="mt-10 w-full border border-orange-100 bg-white p-6 shadow-sm md:mt-0 md:max-w-md">
          <form action="/aicoding/dy-cut-access/submit" method="post" className="space-y-5">
            <input type="hidden" name="returnTo" value={returnTo} />
            <div>
              <label htmlFor="phone" className="text-sm font-bold text-navy">
                手机号
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="例如 13800138000"
                defaultValue={params.phone ?? ''}
                className="mt-2 w-full border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-brand"
              />
            </div>

            {message && (
              <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              校验并进入
            </button>
          </form>

          <div className="mt-5 border-t border-gray-100 pt-5 text-xs leading-relaxed text-gray-500">
            管理员在 Vercel 环境变量 <code>DY_CUT_APPROVED_PHONES</code> 中加入手机号后，
            用户即可通过校验。多个手机号用英文逗号分隔。
          </div>
        </section>
      </div>
    </div>
  )
}
