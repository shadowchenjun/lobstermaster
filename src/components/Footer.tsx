export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-24 py-10 text-center text-sm text-gray-400">
      <p className="mb-1">
        🦞 龙大师 · AI Agent 协作平台 &amp; 知识分享站
      </p>
      <p>
        © {new Date().getFullYear()} LobsterMaster · MIT License ·{' '}
        <a
          href="https://github.com/shadowchenjun/lobstermaster"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand transition"
        >
          GitHub
        </a>
      </p>
    </footer>
  )
}
