import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '陈峻 AI 简历',
  description: '陈峻 AI 产研负责人 / AI FDE 方向简历，覆盖 AI Coding、RAG、知识库、能源帮扶平台与智慧农业等实践。',
}

export default function ResumePage() {
  return (
    <div className="bg-cream">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="rounded-[2rem] bg-navy text-white overflow-hidden shadow-2xl shadow-slate-900/10">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-orange-200 uppercase mb-5">
                  AI Resume
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
                  陈峻
                  <span className="block text-brand mt-2">AI 产研负责人 / AI FDE</span>
                </h1>
                <p className="text-blue-100 leading-8 text-base md:text-lg">
                  18 年技术背景，12 年产研管理，985 本硕。聚焦 AI Coding、企业 RAG、知识库应用、
                  能源帮扶平台 H5/Web 升级与私有化改造，以及智慧农业等可交付场景。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/resume/chenjun-ai.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-brand text-white font-semibold rounded-full hover:bg-orange-500 transition"
                >
                  打开完整版
                </a>
                <Link
                  href="/"
                  className="px-5 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/15 hover:bg-white/15 transition"
                >
                  返回首页
                </Link>
              </div>
            </div>

            <div className="bg-white/8 border-t lg:border-t-0 lg:border-l border-white/10 p-4 md:p-6">
              <div className="bg-white rounded-2xl overflow-hidden h-[72vh] min-h-[620px]">
                <iframe
                  title="陈峻 AI 岗位版简历"
                  src="/resume/chenjun-ai.html"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
