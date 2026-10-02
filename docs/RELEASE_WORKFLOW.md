# LobsterMaster 发布与验收笔记

约定日期：2026-10-02。后续默认使用：检查 → Preview 验收 → Production 配置构建暂存版本 → 验收 → Promote → 正式域名验收。

## 当前仓库入口

- 官网内容：`content/project-learning/*.mdx`，目录自动收录；独立静态文档可放 `public/` 并由 MDX 卡片链接。
- 本地检查：`npm run build`。当前没有 `npm test`、GitHub Actions 工作流；不能声称业务测试或自动发布门禁已启用。
- 本次开始整理时工作分支为 `v3`，Vercel 页面标注自动生产分支为 `master`。发布前重新核实；推送 `v3` 产生 Preview，不等于正式域名更新。
- 正式入口：`https://www.lobstermaster.me/project-learning`。

## 内容发布步骤

1. 确认工作树、提交范围和目标分支；不打包或提交其他人的改动。
2. 更新 MDX frontmatter、正文、资料链接；新增内容须有目录入口，已有相关文章应互链。
3. 运行构建并记录结果，检查生成路由。链接、文章页面与目录卡片分别验收。
4. 提交并推送后核对 Preview 的 SHA 与部署状态，通过浏览器检查文章与卡片。
5. 项目采用暂存发布时，关闭 Production 环境的 Auto-assign Custom Production Domains，生成生产配置部署并确认正式域名仍在旧版本。设置必须从平台核实，不能因为写入本文件就视为生效。
6. 在生产暂存 URL 上验收后 Promote 该版本。不要在验收后重新构建另一版本而复用旧结论。
7. 打开正式域名，检查正文、卡片、导航与链接；保存截图和部署 ID / SHA。

CLI 仅在已有授权时使用：`vercel deploy --prod --skip-domain` → 验收返回 URL → `vercel promote <deployment-url-or-id>`。没有 CLI 登录时使用已授权连接或网页，不擅自授予新凭据访问。

## 业务改动与门禁

业务或鉴权改动需要增加对应自动测试与浏览器流程。配置 GitHub 必需状态检查或 Vercel Checks 后，应验证故意失败会停止合并/推广；必须记录实测结果，不能只记录 YAML 存在。

环境变量按 Development / Preview / Production 分别检查，密钥不写进 MDX、仓库或日志。应用版本回滚与外部数据库、文件、第三方状态恢复独立处理。

## 发布记录模板

```text
时间、执行者、范围：
分支、完整 SHA：
构建及其他检查结果：
Preview URL / ID / 浏览器验收：
暂存生产 URL / ID / 配置与验收：
正式域名仍指向旧部署的证据：
推广目标与正式 URL：
上线检查与截图：
回滚部署与数据兼容限制：
未验证事项 / 自动化状态：
```

公共学习笔记：[Vercel 持续集成与发布流程](https://www.lobstermaster.me/project-learning/vercel-ci-release-workflow)。
