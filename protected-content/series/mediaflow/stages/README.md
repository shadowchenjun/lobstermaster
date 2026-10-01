# 阶段开发记录

按开发批次记录过程，保留目标、决策、问题、验证和交接。阶段编号不是完整系统完成度，也不等同于 Specs 的 P0–P4。

| 阶段 | 范围 | 状态 | 记录 |
|---|---|---|---|
| S01 | 本地素材处理与粗剪闭环 | 已交付基础版；生产能力未完成 | [S01](S01-local-pipeline.md) |
| S02 | 架构页面、数据库迁移、模型适配与缓存渲染 | 已集成；真实模型质量未验收 | [S02](S02-foundations.md) |
| S03 | 需求解析、推荐选材、明确章节编排、工作台 | 已集成；浏览器视觉验收待补 | [S03](S03-creation-flow.md) |
| S04 | 长视频分析任务状态与事件契约 | 初版有待修缺陷；持久化 Worker 待后续 | [S04](S04-analysis-jobs.md) |
| S05 | Specs 评审修订与阶段验收基线 | 文档修订完成；不代表代码修复或产品阶段通过 | [S05](S05-specs-review.md) |
| S06 | 自动多帧视觉识别 | 首版已实现；需配置真实模型，效果未验收 | [S06](S06-automatic-visual-analysis.md) |
| S07 | 任务不变量修复与持久化接口 | 历史全量 68 项通过；租约方法已实现，执行器及 fencing 校验未接通 | [S07](S07-durable-analysis-jobs.md) |
| S08 | 租约保护与 AI 标签选材 | 本轮修复已交付；生产 Worker/模型质量未完成 | [S08](S08-lease-retrieval-hardening.md) |
| S09 | 本地 ASR/OCR Provider 适配器 | 通用命令适配层；历史全量 80 项通过，空结果误报等边界待修，真实识别未接通 | [S09](S09-local-text-providers.md) |
| S10 | 系统完整说明 HTML | 已交付；覆盖规划、当前实现、16 项任务、接口与证据 | [S10](S10-system-overview-page.md) |
| S11 | 多模态理解基础闭环 | 已交付基础版；`.env`、ASR/OCR 持久化、展示与检索已接入，真实质量待配置验收 | [S11](S11-multimodal-understanding-v1.md) |
| S12 | 标签治理与混合检索 | 已交付开发版；词表、同义词、Embedding 索引与可解释降级已接入，真实召回质量待配置验收 | [S12](S12-taxonomy-hybrid-retrieval.md) |
| S13 | 授权硬过滤与检索评测 | 已交付开发版；授权版本、严格过滤、时间线复检与 Recall/nDCG 评测工具已接入，真实台账与黄金集待验收 | [S13](S13-rights-retrieval-evaluation.md) |
| S14 | 系统评审与热路径清理 | 已交付；评审文档、Git 初始化、索引、章节授权过滤与 N+1 消除，评审清单 P1/P3/P4 主体项未开始 | [S14](S14-review-and-hot-path-cleanup.md) |
| S15 | 逐镜头分析结果独立表 | 已交付；模型结果迁出 metadata blob，接口行为不变，检索下推 SQL 未开始 | [S15](S15-shot-analyses-table.md) |
| S16 | 统一中文召回与评测可信度 | 已交付开发版；搜索/推荐/章节共享 ranking-v2，中文自然语句与否定条件统一，真实黄金集待标注 | [S16](S16-unified-chinese-retrieval.md) |

S01–S04 包含依据已有对话和实施记录整理的历史记录；S05 为本次文档修订。后续阶段使用 [模板](TEMPLATE.md)，在开始、实施和交付时持续更新。

相关文档：[总实施记录](../01-实施记录.md)、[自然语言选材说明](../02-自然语言选材实施.md)、[完整 Specs](../plans/2026-09-13-multimodal-video-library-composer-spec.md)。
