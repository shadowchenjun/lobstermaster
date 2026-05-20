import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: '龙大师 · LobsterMaster', template: '%s · 龙大师' },
  description: '用 AI 做事，把过程写下来。AI Agent 协作平台 + 项目学习 / AIcoding实践 / 他山之石。',
  openGraph: {
    siteName: '龙大师 LobsterMaster',
    locale: 'zh_CN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <main className="pt-16 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
