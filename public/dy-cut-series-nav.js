(function () {
  var series = [
    { href: '/douyin-takeout-ai-remix-share.html', title: 'dy-cut 项目说明书', step: '01' },
    { href: '/dy-cut-architecture.html', title: '系统架构图', step: '02' },
    { href: '/dy-cut-team-onboarding.html', title: '团队导览', step: '03' },
    { href: '/douyin-takeout-video-study-notes.html', title: '优秀视频学习笔记', step: '04' },
    { href: '/inspiration-flow.html', title: 'inspiration 拍摄灵感', step: '05' },
    { href: '/material-quality-full-report.html', title: '素材质量评估报告', step: '06' },
    { href: '/beatmix-experiment-flow.html', title: 'beatmix 卡点流程', step: '07' },
    { href: '/dy-cut-vs-html-video-study-summary.html', title: 'dy-cut vs html-video', step: '08' },
    { href: '/closed-loop-roadmap.html', title: '素材-视频-投放闭环', step: '09' },
    { href: '/publish-distribution-progress-2026-06-29.html', title: '发布分发策略与进展', step: '10' }
  ];

  var path = window.location.pathname || '';
  var current = series.findIndex(function (item) { return path.endsWith(item.href); });
  if (current < 0 || document.querySelector('[data-dy-cut-series-nav]')) return;

  var prev = series[(current - 1 + series.length) % series.length];
  var next = series[(current + 1) % series.length];

  var style = document.createElement('style');
  style.textContent = [
    '.dy-series-ribbon{position:sticky;top:0;z-index:9999;background:rgba(15,23,42,.94);color:#e2e8f0;border-bottom:1px solid rgba(148,163,184,.24);backdrop-filter:blur(14px);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}',
    '.dy-series-inner{max-width:1180px;margin:0 auto;padding:10px 18px;display:flex;align-items:center;gap:14px;justify-content:space-between}',
    '.dy-series-title{display:flex;align-items:center;gap:10px;min-width:0}',
    '.dy-series-title a{color:#fff;text-decoration:none;font-weight:800;font-size:13px;white-space:nowrap}',
    '.dy-series-title span{color:#94a3b8;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.dy-series-links{display:flex;align-items:center;gap:8px;overflow-x:auto}',
    '.dy-series-links a{color:#cbd5e1;text-decoration:none;border:1px solid rgba(148,163,184,.28);border-radius:999px;padding:6px 10px;font-size:12px;white-space:nowrap;background:rgba(255,255,255,.04)}',
    '.dy-series-links a:hover{border-color:#fb923c;color:#fff}',
    '.dy-series-links a.is-current{background:#f97316;border-color:#f97316;color:#fff;font-weight:800}',
    '.dy-series-foot{max-width:1180px;margin:40px auto 28px;padding:0 18px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}',
    '.dy-series-footbox{display:grid;grid-template-columns:1fr 1fr;gap:12px;border-top:1px solid rgba(148,163,184,.28);padding-top:18px}',
    '.dy-series-footbox a{display:block;text-decoration:none;border:1px solid rgba(148,163,184,.28);border-radius:12px;padding:14px 16px;background:rgba(255,255,255,.86);color:#0f172a}',
    '.dy-series-footbox b{display:block;font-size:12px;color:#f97316;margin-bottom:4px}',
    '.dy-series-footbox span{font-size:14px;font-weight:800}',
    '@media(max-width:760px){.dy-series-inner{align-items:flex-start;flex-direction:column}.dy-series-footbox{grid-template-columns:1fr}.dy-series-title{width:100%}.dy-series-links{width:100%}}'
  ].join('');

  var nav = document.createElement('nav');
  nav.className = 'dy-series-ribbon';
  nav.setAttribute('data-dy-cut-series-nav', 'true');
  nav.innerHTML =
    '<div class="dy-series-inner">' +
      '<div class="dy-series-title">' +
        '<a href="/aicoding/dy-cut-series">dy-cut 系列</a>' +
        '<span>' + series[current].step + ' · ' + series[current].title + '</span>' +
      '</div>' +
      '<div class="dy-series-links">' +
        series.map(function (item, index) {
          return '<a class="' + (index === current ? 'is-current' : '') + '" href="' + item.href + '">' + item.step + '</a>';
        }).join('') +
      '</div>' +
    '</div>';

  var foot = document.createElement('section');
  foot.className = 'dy-series-foot';
  foot.innerHTML =
    '<div class="dy-series-footbox">' +
      '<a href="' + prev.href + '"><b>上一篇</b><span>' + prev.title + '</span></a>' +
      '<a href="' + next.href + '"><b>下一篇</b><span>' + next.title + '</span></a>' +
    '</div>';

  if (document.body) {
    document.body.prepend(nav);
    document.body.appendChild(foot);
    document.head.appendChild(style);
  }
})();
