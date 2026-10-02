# LobsterMaster 协作与发布约定

- 发布前阅读 `docs/RELEASE_WORKFLOW.md`，核实目标分支、Vercel 环境、部署 SHA 与正式域名。
- 后续默认流程：检查 → Preview 验收 → 使用 Production 配置构建暂存生产版本 → 验收通过后 Promote → 正式域名检查。
- 内容更新至少运行 `npm run build`，核查目录卡片、正文、导航与链接。业务改动另做对应测试。
- 当前没有 `npm test` 或版本化 GitHub Actions 工作流；不要将流程约定称为已经启用的自动门禁。
- 密钥留在服务端或 CI Secrets；部署成功不能替代业务验收，代码回滚不能替代数据恢复。
- 文章按 `content/<category>/*.mdx` 收录；保留用户未提交的改动，只提交本次相关文件。
