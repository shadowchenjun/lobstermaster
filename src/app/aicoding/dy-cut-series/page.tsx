import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DY_CUT_ACCESS_COOKIE, verifyAccessToken } from '@/lib/dyCutAccess'
import { dyCutSeries } from '@/lib/dyCutSeries'

export const metadata: Metadata = {
  title: 'dy-cut 抖音外卖视频剪辑项目系列',
  description: 'dy-cut 抖音餐饮外卖视频 AI 混剪项目的系列文章集合。',
}

const phaseTone: Record<string, string> = {
  run: 'border-blue-200 bg-blue-50 text-blue-700',
  architecture: 'border-slate-200 bg-slate-50 text-slate-700',
  onboarding: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  research: 'border-amber-200 bg-amber-50 text-amber-700',
  inspiration: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
  quality: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  beatmix: 'border-rose-200 bg-rose-50 text-rose-700',
  compare: 'border-violet-200 bg-violet-50 text-violet-700',
  roadmap: 'border-orange-200 bg-orange-50 text-orange-700',
  publish: 'border-lime-200 bg-lime-50 text-lime-700',
}

export default async function DyCutSeriesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(DY_CUT_ACCESS_COOKIE)?.value
  if (!verifyAccessToken(token)) {
    redirect('/aicoding/dy-cut-access?returnTo=/aicoding/dy-cut-series')
  }

  return (
    <div className="bg-cream">
      <section className="border-b border-orange-100 bg-[#fff7ed]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <Link href="/aicoding" className="text-sm font-semibold text-brand hover:underline">
            ← AIcoding实践
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">Project Series</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-navy leading-tight">
              dy-cut 抖音外卖视频剪辑项目系列
            </h1>
            <p className="mt-5 text-gray-600 leading-relaxed text-base md:text-lg">
              这是一个持续更新的 AIcoding 实践系列，记录 dy-cut 从项目构想到批量出片、
              爆款拆解、拍摄灵感、素材质检、口播卡点和工具对比的完整演进。
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-orange-200 bg-white px-4 py-2 font-semibold text-navy">
              {dyCutSeries.length} 篇已收录
            </span>
            <span className="rounded-full border border-orange-200 bg-white px-4 py-2 text-gray-500">
              run · beatmix · inspiration
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-4">
          {dyCutSeries.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group grid gap-4 border border-gray-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md md:grid-cols-[140px_1fr_auto]"
            >
              <div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${phaseTone[item.phase]}`}>
                  {item.kicker}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-navy group-hover:text-brand">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
              <div className="flex items-center text-sm font-semibold text-brand">
                阅读 →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-extrabold text-navy">建议阅读顺序</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
            初次了解建议从项目说明书和架构图开始；准备协作时读团队导览；
            做内容策略时读对标拆解与 inspiration；进入生产阶段再看素材质检和 beatmix。
          </p>
        </div>
      </section>
    </div>
  )
}
