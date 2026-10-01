# 多模态视频素材库与智能长视频合成系统 Implementation Plan

> **修订版 0.2 · 2026-09-14**：根据评审及现有实施证据更新。执行遵循项目 AGENTS.md；本文不要求安装特定 Agent 或技能。评审处置见 [采纳记录](../04-specs-评审采纳.md)。

**Goal:** 建设一套能够批量接入长短视频和图片、自动解析关键帧与标签、通过自然语言检索素材，并有机合成长视频的生产级系统。

**Architecture:** 系统采用“素材数据平面 + AI 控制平面 + 确定性媒体执行平面”的分层架构。素材处理和渲染由可重试的工作流执行，LLM 只负责受 Schema 约束的理解、规划和选择；所有素材、片段、关键帧、标签、检索证据、时间线和产物均可追溯、版本化和局部重算。

**Tech Stack:** 当前为 Vue 3、FastAPI、SQLite/SQLAlchemy/Alembic、本地文件和 FFmpeg。目标为 PostgreSQL + pgvector、S3 兼容存储、持久化工作流（首选 Temporal）、按规模引入 OpenSearch/Redis/独立 Worker。React/Next.js、具体模型和动画引擎按模块评审确定，列表不代表已经部署。

---

## 1. 文档定位

界面原型补充：用户提供的13页Vue原型已纳入必做功能基线。优化版及逐页映射见 [MediaFlow 原型与界面规格补充](../../mediaflow-prototype/README.md)，入口为 [优化界面](../../mediaflow-prototype/index.html)。其中覆盖公共/个人资源库、多模态列表、识别详情、剪辑、一键/目标成片、任务、统计、智能体对话、能力调度、回收站和系统管理，并新增长视频章节编排。交互实现状态与后端待实现范围以该补充文档为准。

本文同时作为：

- 产品需求规格说明书（PRD）
- 系统需求规格说明书（SRS）
- 总体技术架构设计（HLD）
- 核心数据与接口契约草案
- 分阶段实施与验收计划

本文不绑定某一家大模型或视频生成供应商。模型、素材源、TTS、向量模型和渲染器均通过 Provider 接口接入。

### 1.1 规格等级与当前事实

- 本文的“必须”表示对应能力进入验收范围时的要求，不表示当前版本已具备。
- 目标规格、实施承诺和实际验证分别记录；新接口、内存状态或单元测试通过不能替代用户流程与恢复验收。
- 当前只实现本地短素材闭环、人工标签与文本推荐、明确章节的规则编排、代理粗剪。VLM 仅有可配置建议适配器，ASR/OCR、向量检索、持久化分析 Worker、自动叙事及生产部署未完成。
- S01–S05 为开发批次记录，Phase 0–4 为下文 §27 产品阶段，二者不按编号对应。当前不能宣布 Phase 0/1 整阶段通过。
- 最新历史测试为 46 项 Python 与 5 项前端状态测试通过；浏览器视觉验收未完成。结果按阶段记录更新，不能外推到小时级素材或生产 SLA。
- S04 存在已复现待修问题：状态更新绕过模型验证、事件序号未校验连续性；进程内任务状态会随重启丢失。

## 2. 背景与问题定义

业务会持续收集大量长视频、短视频和图片。原始素材通常存在以下问题：

- 文件格式、编码、画幅、帧率和清晰度不统一。
- 长视频难以按内容检索，只能依赖文件名或人工备注。
- 标签颗粒度停留在文件级，无法准确指向某个镜头、片段或关键帧。
- 自动识别标签、人工标签和业务标签混杂，没有版本、来源和置信度。
- 用户知道“想表达什么”，但不知道素材文件名及时间码。
- 检索结果相关但不适合剪辑，例如太短、人物被裁切、方向不连续或版权状态不明。
- 生成长视频时容易出现素材堆砌、镜头重复、节奏失控、音画不一致和风格割裂。
- 修改一个镜头经常导致整条视频重新生成，成本和等待时间过高。

因此需要把“文件仓库”升级为“镜头级、多模态、可检索、可编排、可追溯”的素材资产平台，并在其上构建自然语言驱动的视频合成能力。

## 3. 产品目标与非目标

### 3.1 产品目标

1. 支持批量接入小时级长视频、短视频、图片、音频和文本附件。
2. 自动完成标准化、镜头切分、关键帧提取、语音转写、OCR、视觉理解和标签生成。
3. 建立文件、视频片段、镜头、关键帧、图片、语音句子和标签之间的完整关系。
4. 用户通过自然语言描述画面、人物、动作、时间、情绪、风格和叙事用途检索素材。
5. 检索必须同时满足语义相关性、业务标签、技术质量、版权、画幅和可剪辑性约束。
6. 根据自然语言需求自动生成长视频 Brief、脚本、分镜、旁白、素材清单和时间线。
7. 优先使用素材库内容；素材缺口经策略允许后才搜索外部授权素材或调用 AI 生成。
8. 支持长视频生成、分段渲染、失败恢复、局部修改和局部重渲染。
9. 所有成片能追溯到原素材、时间码、标签、模型版本、提示词和授权信息。
10. 支持企业级权限、审计、成本控制、生命周期和可观测性。

### 3.2 非目标（第一阶段）

- 不实现专业 NLE 的全部复杂操作和插件生态。
- 不默认抓取或使用来源不明、无授权的互联网视频。
- 不把“去水印”作为素材清洗的默认能力。
- 不承诺仅靠 AI 自动生成即可达到影视级最终交付；首期定位为高质量粗剪与模板化成片。
- 不在首期建设模型训练平台和自研基础视频生成模型。
- 不在首期实现自动发布到所有社交媒体平台。

## 4. 用户角色

| 角色 | 主要职责 | 权限范围 |
|---|---|---|
| 素材管理员 | 上传、校验、补充标签、维护授权 | 素材与标签管理 |
| 编导/策划 | 创建需求、编辑脚本和分镜 | 项目与创意审批 |
| 剪辑人员 | 替换素材、调整时间线、预览和渲染 | 项目编辑 |
| 审核人员 | 内容、品牌、版权和成片审核 | 审批与驳回 |
| 系统管理员 | Provider、配额、用户、模板和策略 | 全局配置 |
| API 客户端 | 批量入库、检索和生成 | 服务账号授权范围 |

## 5. 核心用户故事

### US-01 批量建设素材库

作为素材管理员，我可以上传或同步大量长视频，系统在后台解析，并在完成后提供镜头、关键帧、标签、转写和失败项报告。

### US-02 关键帧与镜头检索

作为编导，我可以输入“雨夜城市里撑伞行走的人，蓝感，中远景”，得到精确到视频时间码的镜头片段和关键帧，而不是只得到整个视频文件。

### US-03 组合过滤

作为编导，我可以限定人物、地点、日期、横竖屏、最短可用时长、授权范围、清晰度和不包含的元素。

### US-04 自然语言生成长视频

作为策划，我可以输入主题、受众、目标时长、风格、结构和禁用规则，系统生成脚本、分镜、素材映射和可预览的长视频。

### US-05 局部修改

作为剪辑人员，我可以说“第12镜换成更开阔的航拍，保留旁白，时长增加2秒”，系统只重新检索、调整受影响时间线并局部重渲染。

### US-06 证据追溯

作为审核人员，我可以查看成片中每一帧使用了哪个素材、原始时间码、标签、授权、AI生成记录和修改历史。

## 6. 总体架构

```text
┌──────────────────────────────────────────────────────────────────┐
│ Web Studio / Admin / Open API / CLI                              │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│ API Gateway + Auth + Project Service                             │
├──────────────────────────────────────────────────────────────────┤
│ AI Control Plane                                                 │
│ Intent Parser │ Planner │ Retrieval Agent │ Timeline Agent │ QA  │
├──────────────────────────────────────────────────────────────────┤
│ Workflow Plane (replaceable engine; Temporal preferred)           │
│ Ingest │ Analyze │ Index │ Compose │ Render │ Review │ Recover    │
├──────────────────────────────────────────────────────────────────┤
│ Media Capability Plane                                           │
│ FFmpeg │ ASR │ OCR │ Vision │ Embedding │ TTS │ GenAI │ Remotion │
├──────────────────────────────────────────────────────────────────┤
│ Data Plane                                                       │
│ PostgreSQL/pgvector │ OpenSearch │ S3/MinIO │ Redis │ Audit Log  │
└──────────────────────────────────────────────────────────────────┘
```

### 6.1 三个关键原则

1. **模型输出必须有来源和用途边界。** 用户要求来自 Brief；媒体技术事实来自探测/源文件；ASR/OCR/VLM 是带证据和不确定性的模型观察。数据库持久化结果不意味着结果已经成为可靠事实。模型规划必须引用已验证候选。
2. **工作流确定，智能决策受约束。** 每个 Agent 只能在给定 Schema、候选集、预算和策略内作出选择。
3. **时间线是唯一成片真相。** 所有预览、渲染、修改、审计和导出都以版本化 Timeline IR 为准。

### 6.2 回写、事件与 Agent 边界

业务状态与 Outbox 事件同事务提交；消费者按 event_id 去重，按聚合版本处理过期/乱序消息，失败进入可查询重试队列。任务结果 → 数据库/Outbox → 索引或规划失效标记 → 前端进度读模型。单机先用数据库 Outbox，不要求 Kafka；内存事件仅用于开发，不能承诺恢复。

每个 Agent 定义 input_schema、output_schema、preconditions、postconditions、预算和版本。只传递带版本的中间对象；用户修改生成新版本，运行任务绑定原输入快照，不原地改写其历史。优化算法在工作流 Activity 中执行，记录求解配置、随机种子与结果；工作流重放读取历史结果。

## 7. 领域模型与素材层级

```text
Asset（原始素材）
├── VideoAsset
│   ├── VideoStream / AudioStream
│   ├── Scene（场景段，可跨多个镜头）
│   ├── Shot（镜头，检索和剪辑基本单位）
│   │   ├── Keyframe（代表帧）
│   │   ├── TranscriptSegment（语音段）
│   │   ├── OCRSegment（屏幕文字段）
│   │   └── Annotation（标签与描述）
│   └── Proxy / Thumbnail / Waveform
├── ImageAsset
│   └── Annotation
├── AudioAsset
│   └── TranscriptSegment
└── TextAsset
```

### 7.1 关键定义

- **Asset**：用户上传或外部同步的原始文件，不可覆盖修改。
- **Derivative**：代理视频、缩略图、关键帧、波形、转码版本等派生文件。
- **Scene**：语义上连续的场景，可由多个镜头组成。
- **Shot**：一次连续摄影或算法切分出的剪辑单元，是视频检索和时间线选材的主要单位。
- **Keyframe**：用于代表镜头视觉内容的帧，一个镜头可以有主关键帧和补充关键帧。
- **Annotation**：标签、描述、实体、动作、情绪、镜头属性等统一标注对象。
- **Collection**：人工或规则创建的素材集合。
- **Usage**：素材在项目和成片中的实际使用记录。

### 7.2 作用域、派生与版本引用

上图表达归属而非完整物理外键。Scene 通过有序 Shot 成员及时间范围聚合，可人工修订；分析窗口用 boundary_kind 区分摄影切点与算法窗口。图片无需真实 Shot 层，当前代码的 5 秒图片 Shot 是兼容过渡结构；迁移时保留旧引用。

Annotation 用 scope_type（ASSET/SHOT/KEYFRAME/RANGE）、asset_id、可选 shot_id/keyframe_id、半开时间区间 [start_ms,end_ms) 表达作用域。外键归属、时间范围与作用域组合必须校验，时间使用源媒体坐标并记录代理映射。图片无原始时间范围。

派生物保留 derivation_kind、处理配置哈希、生成器版本、源校验和；多输入派生用 derivation_inputs 关系构成有向无环图，不能只靠单个 parent_file_id。清理前检查被引用情况。

版本链：Storyboard 引用 Brief/Script 版本；Timeline 引用规划版本或标明人工创建。父版本更新将旧子版本标记为“基于旧输入”，不删除、不自动覆盖；继续编辑或导出前明确选择旧快照或重建。Chapter 是叙事分组，Sequence 是执行分段，后者显式引用 chapter_id。

## 8. 素材入库与标准化预处理

### 8.1 输入方式

- 浏览器分片上传，支持断点续传。
- 本地/NAS 目录扫描。
- S3/OSS/COS 对象存储同步。
- 合法授权的外部素材 Provider 导入。
- 批量 API 和命令行导入。

### 8.2 入库幂等

每个文件计算：

- `sha256`：完全重复检测。
- 感知哈希：近似图片和视频代表帧去重。
- 音频指纹：重复音轨识别。
- 来源键：`provider + external_id + version`。

重复文件不重新上传，但允许创建不同业务归属和标签关系。

### 8.3 标准化流程

```text
RECEIVED
→ VIRUS_SCANNED
→ PROBED
→ VALIDATED
→ NORMALIZED
→ PROXY_READY
→ ANALYZING
→ INDEXED
→ READY
```

失败状态为 `FAILED_RETRYABLE` 或 `FAILED_FINAL`，每一阶段记录错误码、重试次数和输入输出版本。

### 8.4 视频标准化

原片永久保留，另生成编辑代理文件：

| 项目 | 标准 |
|---|---|
| 容器 | MP4 |
| 视频编码 | H.264，yuv420p |
| 音频编码 | AAC，48kHz |
| 时间基 | 统一为毫秒，内部保留原始 PTS/DTS 映射 |
| 帧率 | 代理文件 CFR；保留原文件 VFR 信息 |
| 预览分辨率 | 长边 720p 或 1080p，可配置 |
| 声道 | 保留原音轨，额外生成分析用 mono PCM |
| 色彩 | 保存原色彩空间；代理转为标准 SDR，HDR 单独处理 |
| 旋转 | 应用 metadata 旋转并记录变换矩阵 |

必须使用 `ffprobe` 保存原始媒体技术元数据。不得在没有映射表的情况下直接以代理时间码代替原片时间码。

### 8.5 代理与派生文件

- 编辑代理视频
- 低码率网页预览
- 多尺寸缩略图
- 镜头 contact sheet
- 音频波形数据
- 抽取音轨
- 字幕和转写文件
- 主关键帧及补充关键帧
- 可选光流、深度图、人脸特征等高级派生物

## 9. 长视频解析管线

### 9.1 分段执行

小时级长视频先按时间切成分析分片，例如10分钟一片，分片需要：

- 共享2～5秒重叠区，避免边界漏检。
- 保留全局时间码映射。
- 可以独立重试和并行处理。
- 合并时消除重叠镜头与重复转写。

### 9.2 镜头检测

组合使用：

- 直方图/内容差异检测硬切。
- 渐变和淡入淡出检测软切。
- 最短/最长镜头约束。
- 语义连续性合并。
- 人工拆分与合并校正。

输出字段：`start_ms`、`end_ms`、`cut_type`、`confidence`、`detector_version`。

### 9.3 关键帧提取策略

每个 Shot 至少生成一个主关键帧。以下情况生成补充关键帧：

- 镜头时间超过阈值。
- 镜头内主体或构图明显变化。
- 检测到多个关键动作。
- OCR 文本发生变化。
- 人物切换或新增重要实体。

关键帧候选评分：

```text
keyframe_score =
  sharpness * 0.25
  + visual_representativeness * 0.25
  + face_quality * 0.10
  + object_coverage * 0.15
  + aesthetic_score * 0.10
  + motion_stability * 0.10
  + text_legibility * 0.05
```

需要过滤：黑帧、过曝、严重模糊、转场中间帧、闭眼/畸变人脸、字幕遮挡严重的帧。

### 9.4 音频与文本理解

- 使用 VAD 提取有声区间。
- ASR 输出词级时间戳、说话人和语言。
- 可选声纹聚类，不默认建立真实身份。
- OCR 输出文字、位置、出现区间和置信度。
- 将转写、OCR、视觉描述按 Shot 时间范围合并。
- 自动生成标题式短描述和详细描述。

### 9.5 视觉理解输出

每个 Shot/Keyframe 至少解析：

- 场景：室内、室外、办公室、街道、工厂等。
- 主体：人物、物品、动物、产品、车辆等。
- 动作：走、跑、交谈、操作机器、展示产品等。
- 镜头：特写、中景、全景、航拍、推拉摇移、静止等。
- 时间与天气：白天、夜晚、雨、雪、晴等。
- 视觉风格：纪实、商业、电影感、卡通、低饱和等。
- 情绪与氛围：轻松、紧张、温暖、庄重等。
- 构图：主体位置、安全裁切区、留白和可放字幕区域。
- 技术质量：清晰度、抖动、噪点、曝光和压缩损伤。
- 风险：Logo、水印、敏感内容、版权不确定、人脸隐私。

### 9.6 模型观察与修订边界

ASR 保存原文、词 ID、时间戳和音频证据；标点/分段与文字纠错分开版本化。纠错可产生建议，但改字或合并词后必须重新对齐，不能继续冒用原词时间戳。OCR 保存原文、框与出现范围，建议修订不覆盖原结果。

VLM 描述允许参与检索，但必须带 MODEL 来源、模型版本、置信度/未知标记、证据帧和审核状态；召回命中不等于身份或事实确认。人物实体区分真实拍摄、屏幕/海报和无法判断，敏感身份推断须单独策略。人工确认高于模型建议但保留修订链。

## 10. 标签体系

### 10.1 标签分类

| 类型 | 示例 |
|---|---|
| 主题 | 科技、农业、教育、城市生活 |
| 场景 | 会议室、街道、生产车间 |
| 主体 | 青年、儿童、咖啡、机器人 |
| 动作 | 奔跑、演讲、装配、品尝 |
| 镜头语言 | 特写、广角、航拍、跟拍 |
| 时间天气 | 清晨、夜晚、雨天 |
| 风格 | 电影感、纪实、轻快、复古 |
| 情绪 | 温暖、紧张、积极、孤独 |
| 业务 | 品牌、产品线、活动、地区 |
| 技术 | 4K、竖屏、无声、低照度 |
| 权利 | 自有、采购、CC、地域限制 |
| 风险 | 水印、竞品Logo、未授权人脸 |

### 10.2 标签来源

- `MODEL`：模型自动识别。
- `RULE`：规则和技术分析产生。
- `IMPORT`：随素材导入。
- `HUMAN`：人工添加或确认。
- `INHERITED`：从集合、项目或父级素材继承。

每个标签必须保存：来源、置信度、模型/规则版本、创建时间、审核状态和适用时间范围。

### 10.3 标签治理

- 同义词：`汽车`、`轿车`、`car` 映射到同一概念节点。
- 层级：`交通工具 > 汽车 > 新能源汽车`。
- 别名：品牌、人物、地点的常用名和正式名。
- 冲突：人工审核标签高于模型标签，但不删除模型原始结果。
- 版本：标签本体升级后支持增量重标，不要求全库立即重算。
- 多语言：保存标准概念 ID 和多语言显示名。

## 11. 数据模型

### 11.1 核心表

| 表 | 用途 |
|---|---|
| `assets` | 原始素材主记录 |
| `asset_files` | 原片、代理和派生文件 |
| `video_streams` | 视频流技术元数据 |
| `audio_streams` | 音频流技术元数据 |
| `scenes` | 语义场景段 |
| `shots` | 镜头片段 |
| `keyframes` | 关键帧 |
| `transcript_segments` | ASR分段和词级时间戳 |
| `ocr_segments` | OCR文本和位置 |
| `annotations` | 统一标签和描述 |
| `taxonomy_nodes` | 标签本体和层级 |
| `embeddings` | 文本、图像和多模态向量 |
| `collections` | 素材集合 |
| `rights_records` | 授权和使用范围 |
| `projects` | 视频项目 |
| `brief_versions` | 需求理解版本 |
| `script_versions` | 脚本版本 |
| `storyboard_versions` | 分镜版本 |
| `timeline_versions` | 时间线版本 |
| `render_jobs` | 渲染任务 |
| `artifact_usages` | 成片素材使用证据 |
| `workflow_runs` | 工作流状态 |
| `model_invocations` | 模型调用、成本和结果摘要 |
| `audit_events` | 审计日志 |

### 11.1a 数据约束补充（目标模型，分期迁移）

| 对象 | 必须明确的字段/关系 | 验收 |
|---|---|---|
| embeddings | embedding_space_id、model/version、dimension、modality、source/version、预处理版本、distance_metric | 不同空间不得直接混算；索引按兼容空间隔离，升级期间旧新版本可共存和回滚 |
| annotations | §7.2 作用域、证据、来源、审核和版本 | 跨资产引用/越界拒绝，人工修订不丢原结果 |
| taxonomy | 概念 ID 与语言名称/别名分离，语言映射版本化 | 显示翻译与检索扩展分开记录 |
| rights/usage | 每次素材使用绑定不可变授权快照；导出保存当前用途审核结果 | 在地域、渠道、时间、用途下重验当前权限；历史快照不作为继续使用的许可证 |
| tenant-owned 数据 | tenant_id 必填、跨表租户归属约束；生产 PostgreSQL 采用 RLS 防御 | 搜索、预览、下载、任务和导出均验证；后台账号不默认绕过 |

向量可采用按空间分表或分区/独立索引；不得仅按三种模态分表后假定维度一致。物理实现通过数据规模与查询基准的 ADR 确定。全局配置表需明确是否租户无关。

### 11.2 Asset 示例

```json
{
  "id": "ast_01J...",
  "tenantId": "t_001",
  "kind": "VIDEO",
  "originalName": "城市宣传片原片.mov",
  "sha256": "...",
  "durationMs": 7284000,
  "status": "READY",
  "source": {"type": "UPLOAD", "externalId": null},
  "rights": {"status": "OWNED", "expiresAt": null},
  "technical": {
    "width": 3840,
    "height": 2160,
    "fps": 25,
    "videoCodec": "prores",
    "audioCodec": "pcm_s24le"
  },
  "analysisVersion": "analysis-v3"
}
```

### 11.3 Shot 示例

```json
{
  "id": "shot_01J...",
  "assetId": "ast_01J...",
  "startMs": 152430,
  "endMs": 161920,
  "description": "雨夜街道，一名撑黑伞的行人从右向左经过霓虹灯店铺",
  "camera": {"scale": "WIDE", "movement": "TRACKING"},
  "quality": {"sharpness": 0.91, "stability": 0.82},
  "cropSafety": {"portrait": 0.72, "landscape": 0.96},
  "embeddingIds": ["emb_visual...", "emb_text..."]
}
```

## 12. 索引与检索

### 12.1 索引单位

- 文件级索引：用于资产管理和粗筛。
- Shot级索引：主要视频检索单位。
- Keyframe级索引：视觉相似和构图检索。
- Transcript句子级索引：按话语内容检索。
- Image级索引：静态图片检索。

### 12.2 混合检索流程

```text
自然语言查询
→ 意图结构化
→ 权限/授权/技术硬过滤
→ BM25关键词召回
→ 文本向量召回
→ 图文多模态向量召回
→ 标签图谱召回
→ 候选融合
→ Cross-Encoder/多模态重排
→ 去重与多样性选择
→ 返回带时间码和证据的素材
```

### 12.3 查询意图 Schema

```json
{
  "semanticQuery": "雨夜城市里撑伞行走的人",
  "entities": ["人物", "雨伞", "城市街道"],
  "actions": ["行走"],
  "mood": ["孤独", "电影感"],
  "camera": ["中远景"],
  "must": {"minDurationMs": 4000, "rights": ["OWNED", "COMMERCIAL"]},
  "mustNot": {"tags": ["卡通", "水印", "竞品Logo"]},
  "targetAspectRatio": "16:9",
  "resultType": "SHOT",
  "limit": 30
}
```

### 12.4 排序模型

```text
final_score =
  semantic_similarity       * 0.30
  + tag_match               * 0.15
  + transcript_match        * 0.10
  + visual_style_match      * 0.10
  + technical_quality       * 0.10
  + duration_fit            * 0.05
  + aspect_crop_fit         * 0.05
  + editability             * 0.05
  + rights_score            * 0.05
  + diversity_contribution  * 0.05
```

硬性规则必须在排序前过滤，不能通过相关性分数抵消版权或权限限制。

### 12.4a 门控与融合基线

权限、授权、禁止标签、可用源范围等是独立 eligibility predicate；不通过的候选不得被高相关分补偿。editability 区分项目必需的最低时长/裁切可行性与偏好的构图质量。前述权重是候选实验配置，不是已验证公式；每一特征需提供计算定义、归一化、缺失值策略及版本。

混合召回 v0 实验基线采用按实体 ID 去重的 RRF，参数 k=60、重排上限 200 为可配置初值，须经黄金集验证。每路记录 Top-K、耗时、降级与截止时间；Cross-Encoder 只处理预算内融合候选，不对全库计算。不同模型空间分数不能直接相加；超时保留已通过硬门控的结果并标记降级。当前本地文本规则接口不冒充此混合流程。

### 12.5 检索结果解释

每个结果返回：

- 原视频名称和精确时间码。
- 主关键帧和低码率片段预览。
- 命中的文本、标签和相似度。
- 技术质量、可裁切性和可用时长。
- 授权状态和限制。
- 被选择或未选择的原因。

## 13. 自然语言意图理解

### 13.1 输入类型

- 一句话创作需求。
- 完整策划案或脚本。
- 参考视频/图片及自然语言说明。
- 对已有项目的修改指令。
- 结构化 API 参数。

### 13.2 Video Brief Schema

```json
{
  "title": "城市夜归人",
  "objective": "品牌形象传播",
  "audience": ["20-35岁城市青年"],
  "durationTargetMs": 600000,
  "aspectRatio": "16:9",
  "language": "zh-CN",
  "tone": ["纪实", "克制", "温暖"],
  "narrative": {
    "structure": "chaptered_documentary",
    "chapters": 5,
    "hookStrategy": "visual_question",
    "ending": "emotional_callback"
  },
  "materialPolicy": {
    "internalLibraryFirst": true,
    "allowLicensedExternal": false,
    "allowAIGeneration": false,
    "maxReusePerShot": 1
  },
  "audio": {
    "narration": true,
    "voiceStyle": "calm",
    "musicStyle": "ambient_cinematic"
  },
  "mustInclude": ["雨夜", "通勤", "城市灯光"],
  "mustNotInclude": ["竞品Logo", "未成年人正脸"],
  "approvalGates": ["BRIEF", "STORYBOARD", "FINAL"]
}
```

### 13.3 歧义处理

- 缺少非关键参数：使用团队默认模板并显式展示假设。
- 缺少决定性参数：暂停在 Brief 阶段请求用户选择。
- 指令冲突：安全、权限、授权、品牌规则优先于创意指令。
- 修改指令：转换为 Timeline Patch，不重新解释整个项目。

## 14. 长视频策划与合成

### 14.1 长视频需要分层规划

长视频不能一次性生成平铺镜头列表，应采用：

```text
主题目标
→ 故事弧/论证结构
→ 章节
→ 段落/Sequence
→ 镜头/Shot
→ 帧与音频事件
```

每层均有目标、时长预算、信息点、情绪曲线和素材覆盖度。

### 14.2 生成流程

1. 解析用户需求形成 Brief，按 §13.3 标记待确认参数；决定性冲突未解决前不进入素材分配。
2. 检索素材库，生成素材能力画像和覆盖报告。
3. 根据素材事实生成脚本，不编造素材中不存在的内容。
4. 生成章节结构、旁白和信息密度计划。
5. 生成分镜槽位及每个槽位的检索查询。
6. 每个槽位召回候选并重排。
7. 在明确目标函数和时间预算内进行跨章节约束分配：v0 贪心分配后执行冲突检查及小窗口回溯；记录剩余缺口，不承诺全局最优。
8. 检测素材缺口，按策略执行改写、外部检索或AI生成。
9. 生成 Timeline IR。
10. 生成低清代理预览。
11. 完成机器质检和AI内容质检。
12. 审批后分段高质量渲染并拼接。

### 14.3 全局素材选择约束

- 同一 Shot 默认只使用一次。
- 同一原片连续出现次数设上限。
- 相邻镜头主体、景别、运动方向和色调需要形成合理关系。
- 旁白语义与画面语义必须达到最低阈值。
- 章节内信息覆盖不能重复堆叠。
- 人物和地点连续性由项目规则控制。
- 长视频必须配置呼吸镜头和节奏变化，不能保持同一镜头长度。
- 选材前预留片头、片尾、字幕、Logo和过渡时长。

### 14.3a 有界求解与字段来源

硬约束优先：权限、范围和禁止内容不可放松。可行候选间优化已定义的覆盖率、相关性、重复惩罚和连续性得分；权重与缺失值策略随配置版本保存。回溯最多影响 3 个相邻章节作为初始上限，同时设置 max_iterations 和 deadline_ms；到限返回最佳可行解及未满足约束。v0 默认确定性排序；产生不同版本时显式保存 seed，不用不可追溯随机重试。

Brief 的 mustInclude/mustNotInclude 来自用户意图，不要求素材库已有对应内容；覆盖校验应报告缺失。候选 ID、可用时长、权利和技术参数必须来自实际数据；章节预算是规划建议，必须合计校验；选择理由属于解释，不能替代证据。每个规划任务同时交付字段来源表和对应验证器。

### 14.4 素材缺口策略

按优先级执行：

1. 放宽低优先级检索条件。
2. 使用相邻语义的抽象或氛围镜头。
3. 修改旁白和脚本，使其符合现有素材。
4. 经策略允许，搜索商业可用的外部素材。
5. 经策略允许，生成图片或视频，并明确标记为AI生成。
6. 仍无法补齐则暂停并请求人工提供素材。

补缺不得自动改变已确认的硬约束。外部/生成 Provider 调用前校验项目授权与成本上限；展示计费单位、数量、估算金额及超限动作。来源通过 source_kind（LIBRARY/EXTERNAL_LICENSED/AI_GENERATED/AI_EDITED）和源生成/编辑记录保存，不把生成内容视为实拍证据。可见标记按适用规则及项目策略输出；不统一强制角落水印，也不允许用户选项绕过必要标记。

## 15. Timeline IR

### 15.1 设计要求

- 时间统一使用整数毫秒，渲染时转换为帧。
- 支持视频、图片、旁白、同期声、音乐、音效、字幕、图形和调色轨。
- 每个 Clip 保存源素材和原始时间码。
- 支持嵌套 Sequence 和章节。
- 支持版本、Patch、撤销和差异比较。
- 支持代理预览和高质量渲染共享同一逻辑时间线。
- 可导出为内部 JSON；后续扩展 OTIO、FCPXML 或剪映草稿适配器。

### 15.2 示例

```json
{
  "schemaVersion": "1.0",
  "timelineId": "tl_001",
  "version": 7,
  "canvas": {"width": 1920, "height": 1080, "fps": 25},
  "durationMs": 600000,
  "sequences": [
    {
      "id": "seq_01",
      "name": "第一章：夜幕",
      "startMs": 0,
      "durationMs": 112000,
      "tracks": [
        {
          "type": "VIDEO",
          "clips": [
            {
              "id": "clip_01",
              "assetId": "ast_01",
              "shotId": "shot_09",
              "sourceInMs": 152430,
              "sourceOutMs": 160430,
              "timelineInMs": 0,
              "timelineOutMs": 8000,
              "transform": {"fit": "cover", "focus": [0.48, 0.42]},
              "transitionOut": {"type": "DISSOLVE", "durationMs": 500}
            }
          ]
        }
      ]
    }
  ]
}
```

### 15.3 自然语言 Patch

```json
{
  "baseVersion": 7,
  "operations": [
    {
      "op": "REPLACE_VISUAL",
      "targetClipId": "clip_12",
      "query": "更开阔的城市航拍，夜景，无水印",
      "preserve": ["duration", "narration", "captions"]
    },
    {
      "op": "EXTEND_DURATION",
      "targetClipId": "clip_12",
      "deltaMs": 2000,
      "ripple": true
    }
  ]
}
```

系统先验证 Patch，再生成新版本，禁止直接覆盖当前版本。

### 15.4 契约演进与修改操作

当前 Timeline 0.1 仅连续单轨 clips。v1 引入规划版本引用、章节/sequence 关系、源类型、多轨及操作契约；v2 扩展动画和高级变换。新字段必须有默认行为、schema_version、迁移与旧渲染器拒绝不支持特性的策略。

| 用户意图 | 规范操作 | 必须验证 |
|---|---|---|
| 加/删镜头 | ADD_CLIP / REMOVE_CLIP | 引用存在、删除影响与剩余轨道 |
| 分割/裁切/延长 | SPLIT_CLIP / TRIM_CLIP / EXTEND_DURATION | 源范围、最短片段、音画同步 |
| 移动镜头/段落 | MOVE_CLIP / MOVE_SEQUENCE | ripple 的作用轨道和移动范围 |
| 换画面/批量替换 | REPLACE_VISUAL / BULK_REPLACE_BY_TAG | 候选证据、逐项影响清单、preserve |
| 按标签剔除 | FILTER_OUT_TAGS | 先生成删除计划，报告覆盖与时长缺口 |
| 增删轨道/转场/叠加 | ADD_TRACK / REMOVE_TRACK / CHANGE_TRANSITION / ADD_OVERLAY | 轨道类型、关联引用、边界 handle |
| 改音轨/旁白 | REPLACE_AUDIO_SOURCE / SET_NARRATION_TEXT | 重新生成与对齐需求；不可假定改字不改时长 |

preserve 仅允许 duration/narration/captions/placement 等声明字段；无法保留时返回冲突，不静默违约。一个 Patch 事务全部成功或全部失败，带 request_id 和 baseVersion。撤销/重做通过带并发版本校验的当前版本指针实现，所有版本不可变；分支后的历史仍可查看。diff 比较两版本对象，三方合并属于后续功能。

变换 v1 明确 fit、scale、rotation、mirror 与 source-coordinate focus；动画另定义关键帧、插值及安全裁切约束。不支持的变换必须报错，不能接收后忽略。

## 16. 音频、字幕与节奏

- 旁白先按章节生成，再做全片音色一致性检查。
- 支持保留原片同期声、自动 ducking 和响度归一化。
- 背景音乐按章节、情绪曲线和节拍点编排。
- 字幕以词级时间戳为基础进行语义断句。
- 字幕必须适配安全区、最大行数、最小字号和品牌模板。
- 长视频必须检测长时间静音、声音突变、爆音和左右声道异常。
- 视频剪辑点可参考语音边界、音乐节拍和画面运动共同确定。

## 17. 渲染架构

### 17.1 双渲染路径

- FFmpeg：素材裁切、拼接、转码、滤镜、音频混合、字幕烧录和最终封装。
- Remotion：动态文字、章节包装、数据图形、模板动画和复杂组合场景。

### 17.2 长视频分段渲染

- 以 Sequence/章节为渲染分片。
- 分片边界保留转场 handle。
- 每片独立缓存和重试。
- 片段验收通过后再无损或受控重编码拼接。
- 修改一个镜头时，只失效包含该镜头及相关转场的分片。

边界 handle 从转场、滤镜和音频依赖计算，不固定为 1 秒；硬切允许零 handle，转场按定义消耗重叠区且不得重复拼接。缓存键包括源版本/范围、完整渲染配置、handle、执行器及编码版本。依赖图为输入 → 派生节点 → 渲染产物的有向图，编辑失效沿实际下游传播；共享同一原片不等于所有消费片段都失效。提供影响清单供局部重渲染验收。

FFmpeg 负责基础媒体与最终封装；动画引擎输出声明帧率、时长、色彩和透明度的中间层或独立片段，经共同契约校验后合成。不得对同一内容重复应用字幕或变换。

### 17.3 渲染产物

- 草稿代理版。
- 审核版（可选时间码或水印）。
- 最终母版。
- 多分辨率和多码率衍生版。
- 字幕文件、封面、音频版和项目归档包。

## 18. 工作流与状态机

### 18.1 素材工作流

```text
ingest
→ probe
→ normalize
→ segment
→ keyframe
→ asr/ocr/vision（并行）
→ annotation_merge
→ embedding
→ search_index
→ quality_gate
→ ready
```

### 18.2 视频项目工作流

```text
brief
→ library_coverage
→ script
→ storyboard
→ retrieve
→ allocate
→ gap_resolution
→ timeline
→ proxy_render
→ review
→ final_render
→ final_qa
→ publish/archive
```

### 18.3 状态要求

- 每一步记录输入哈希、输出版本、执行器版本和耗时。
- 重试操作必须幂等。
- 长任务支持取消、暂停和恢复。
- Worker 丢失后应按租约和检查点恢复未完成步骤，不重跑已确认产物；恢复次数和截止时间耗尽时进入明确失败状态，不能无限重试。
- 模型调用超时仅可在用户授权、兼容能力及剩余预算内执行 Provider fallback，结果需重新通过 Schema 与质量门；无允许的备选时明确失败或请求用户决策。
- 用户修改导致的失效范围应通过依赖图计算。

### 18.4 持久化、并发与恢复验收

内存实现只是接口验证，不满足工作流退出条件。数据库任务记录至少包含 input_snapshot/hash、executor/model/config_version、status、attempt、progress、checkpoint、lease_owner/expires_at、revision 和输出引用；幂等唯一键由服务端源数据生成，不能要求客户端提供未公开的哈希才可建任务。

领取使用原子条件更新/锁与租约；Worker 写回必须校验 attempt 与 fencing token，拒绝过期 Worker 覆盖新结果。所有状态更新重新验证不变量（包括 progress∈[0,1]），同状态重试不能绕过校验。FAILED→QUEUED 清理活动错误，历史错误保留在事件中；终态重复请求按已记录结果返回。

状态与事件同事务追加，事件唯一键 (job_id,sequence)，连续单调递增，外部操作另设 request_id。重复消息不得追加重复事件；输出先写临时位置并校验，再发布引用。外部 Provider 无法提供幂等时记录调用 ID 并进行结果对账，不承诺端到端 exactly-once。

恢复验收必须覆盖：建任务后重启仍可查、并发重复提交仅一个任务、Worker 失联后接管、旧租约写回拒绝、重试检查点正确、取消与完成竞态、状态与事件一致、失败不伪报 READY。Provider 未配置时明确不可执行原因，不让任务无限排队而无解释。

Temporal 适配后：Signal/Update 处理取消或输入版本请求，Query 可用于运行时诊断；前端长期状态默认读取持久化读模型，避免将 Workflow Query 作为唯一记录。

## 19. Provider 抽象

统一接口类型：

- `VisionProvider`
- `EmbeddingProvider`
- `ASRProvider`
- `OCRProvider`
- `LLMProvider`
- `TTSProvider`
- `ImageGenerationProvider`
- `VideoGenerationProvider`
- `StockMediaProvider`
- `RenderProvider`

Provider 选择评分维度：任务适配、质量、延迟、可靠性、成本、数据合规、部署区域和连续性。

每次选择保存候选、得分、最终选择、fallback和成本预估。项目可以锁定 Provider，避免同一长视频中音色或视觉风格漂移。

### 19.1 能力与失败预算

每个 Provider 注册 capability、部署位置、配置状态、输入输出 schema、timeout、max_attempts、max_cost、并发限制、模型版本及允许降级目标。具体供应商通过黄金集和部署环境确定，不写成已选定/已验证。ASR/OCR 优先评估本地方案；当前只有 VLM 建议适配器，其余未接入。

| 能力 | 可允许的降级 | 最终状态 |
|---|---|---|
| ASR/OCR/VLM | 相同结果契约、允许的数据区域与预算内替代模型 | 可重试失败/人工处理，禁止伪造识别结果 |
| Embedding | 使用完整旧索引版本，或明确退化到关键词 | 不混用不兼容空间 |
| Planner | 人工 Brief/规则候选方案，标明能力范围 | 无可行解报告缺口 |
| TTS/生成媒体 | 项目明确允许的替代模型/模板 | 未授权改变交付音轨时暂停，不能静默交无声版 |
| 渲染 | 同契约执行器或重试有效缓存 | FAILED 且保留诊断证据 |

网络暂时故障可有限重试；schema 错误、权限策略拒绝和预算耗尽不做无限 fallback。跨供应商外传须重新过策略门；配置状态 READY 不代表真实可用性或质量验收。

## 20. 功能需求

### FR-100 素材接入

- FR-101：支持浏览器分片上传和断点续传。
- FR-102：支持批量目录和对象存储同步。
- FR-103：支持完全重复和近似重复检测。
- FR-104：支持导入时指定项目、集合、业务标签和授权。
- FR-105：上传失败能够从已完成分片继续。

### FR-200 素材分析

- FR-201：使用 ffprobe 提取完整音视频技术信息。
- FR-202：自动生成代理、缩略图和波形。
- FR-203：长视频分片并行分析且保持全局时间码。
- FR-204：自动识别 Shot 和 Scene。
- FR-205：每个 Shot 提取一个或多个关键帧。
- FR-206：生成 ASR、说话人分段和词级时间戳。
- FR-207：生成 OCR、视觉描述、标签和质量指标。
- FR-208：分析结果支持人工纠正及重新索引。

### FR-300 素材库

- FR-301：支持文件、Shot、Keyframe、图片和文本多层级浏览。
- FR-302：支持标签本体、同义词、层级和多语言。
- FR-303：支持集合、收藏、审核状态和批量操作。
- FR-304：支持授权、到期时间和地域限制。
- FR-305：支持重复素材、低质素材和风险素材报告。

### FR-400 检索

- FR-401：支持自然语言、标签、关键词和以图搜图。
- FR-402：支持人物、场景、动作、情绪、镜头、时间和技术过滤。
- FR-403：返回精确时间码、关键帧、预览和命中理由。
- FR-404：支持正向、负向和必须条件。
- FR-405：支持结果去重、多样化和相关反馈。
- FR-406：权限和版权不合格素材不得进入候选结果。

### FR-500 智能创作

- FR-501：自然语言生成结构化 Video Brief。
- FR-502：生成章节、脚本、旁白和分镜。
- FR-503：输出素材覆盖率和缺口报告。
- FR-504：逐分镜产生检索查询并保存检索证据。
- FR-505：全局分配素材并控制重复率。
- FR-506：允许根据素材实际情况改写脚本。
- FR-507：在授权策略下调用外部素材或生成式模型。

### FR-600 时间线与编辑

- FR-601：系统生成版本化 Timeline IR。
- FR-602：用户可替换、裁切、移动和调整镜头。
- FR-603：支持自然语言修改并预览修改范围。
- FR-604：支持撤销、恢复、版本比较和审批。
- FR-605：支持低清代理预览和逐章节预览。

### FR-700 渲染和输出

- FR-701：支持分段渲染、缓存和失败重试。
- FR-702：支持长视频、字幕、旁白、音乐和图形合成。
- FR-703：支持多比例、多分辨率和多码率输出。
- FR-704：支持局部重渲染。
- FR-705：输出项目归档包和素材使用清单。

### FR-800 质检

- FR-801：检测格式、时长、黑帧、冻结帧、静音和损坏。
- FR-802：检测字幕越界、音画错位和响度异常。
- FR-803：检测文案画面匹配、素材重复和叙事连续性。
- FR-804：检测版权、Logo、敏感内容和人脸规则。
- FR-805：质检失败生成镜头级修复任务。

### FR-900 管理与审计

- FR-901：角色和租户级权限隔离。
- FR-902：API Key、Provider和模型配置集中管理。
- FR-903：保存模型调用、提示词版本、成本和输出摘要。
- FR-904：保存所有人工与自动操作审计事件。
- FR-905：支持项目和素材生命周期策略。

## 21. 非功能需求

### 21.1 性能与规模基线

长期目标规模（未实测，不作为本地开发版或 Phase 0 的通过条件）：

- 100万原始素材对象。
- 10万小时视频。
- 5000万 Shot。
- 1亿 Keyframe。
- 3亿 Annotation/Embedding 记录。
- 单个视频最长8小时，单文件最大500GB。
- 每日新增1000小时视频，可水平扩展。
- 搜索P95小于2秒，预览片段首帧小于3秒。
- 自然语言查询解析P95小于5秒。
- 10分钟代理长视频渲染的目标实时系数小于0.5；最终渲染按模板复杂度定义SLA。

规模数值须根据真实数据、硬件、并发与成本重新校准后才能形成上线 SLA。3 亿记录指 Annotation 与 Embedding 合计设计量。

本期已验证仅短视频/图片测试，不能推定 1000 素材、100 小时或任何 P95 指标达标。Phase 0 准备 50～100 个真实长视频样本及不少于 10 类查询；Phase 1 用累计 100 小时测试素材和固定查询黄金集验收。报告必须包含总大小、时长分布、编码/VFR/旋转/音轨覆盖、硬件、并发、错误率和分位延迟。

检索初始提案：固定黄金集上 Recall@20≥0.70，权限违规返回为 0；相关性口径、查询集版本和阈值须在正式验收前确认。若调整，必须记录理由并重测，不得用降低标准把已完成样例包装为达标。

### 21.2 可用性

- 生产 API 月可用性目标99.9%，测量周期、排除项与部署冗余待上线前确定；本机开发版不承诺月可用性。
- 工作流状态持久化，服务重启后可恢复。
- 对象存储和数据库必须有备份与恢复演练。
- 索引可从主数据库和对象存储重建。

### 21.3 安全与隐私

- 租户隔离和最小权限。
- 文件传输和静态存储加密。
- 密钥进入密钥管理系统，不写入项目配置和日志。
- 人脸特征、声纹和个人身份信息属于敏感数据，需单独授权、加密和生命周期策略。
- 支持素材删除、派生物清理和索引删除闭环。
- 外部 Provider 调用前应用数据出境与敏感内容策略。

### 21.4 可观测性

必须观测：

- 入库吞吐、队列积压和各阶段失败率。
- 每小时视频的分析耗时和GPU/CPU成本。
- Shot/Keyframe数量分布和异常值。
- 模型标签置信度、人工修改率和漂移。
- 检索延迟、零结果率、点击率和最终采用率。
- 项目各阶段耗时、局部重算率和渲染失败率。
- 每分钟成片的模型与渲染成本。

告警由指标定义、分母、时间窗、基线、阈值、责任人和处置组成。初期对任务租约过期、状态/事件不一致、权限越界设置确定性告警；模型置信度不能跨模型套同一阈值，质量与零结果率阈值须由黄金集和运行基线校准。未经校准的数值标为提案。

删除分两层：逻辑禁用立即阻止新检索/导出；物理清理异步记录进度、失败和重试。流程为 REQUESTED→ACCESS_REVOKED→PURGING→IMPACT_REVIEW→COMPLETED；备份保留和受依赖保护对象必须列明，未完成物理删除不得称彻底清除。已生成成片按用途重新审核并通知负责人，不擅自改写历史成片。

## 22. API 草案

REST 是业务主接口；页面需要聚合数据时增加只读聚合端点，GraphQL 非必选。返回字段裁剪、分页和签名预览地址优先于增加协议层。实体浏览可提供 GET /v1/entities/{id}/shots，复用检索的权限和来源过滤。

下列为目标路由，实际开发版以 OpenAPI 为准；接口改名须保留兼容期或声明版本变更。事件 envelope 至少包含 event_id、aggregate_id/version、type、occurred_at、schema_version、payload，禁止将敏感素材全文默认推送到任务列表。

### 22.1 素材

```text
POST   /v1/uploads
POST   /v1/uploads/{id}/parts
POST   /v1/uploads/{id}/complete
GET    /v1/assets/{id}
GET    /v1/assets/{id}/shots
GET    /v1/shots/{id}
PATCH  /v1/shots/{id}/annotations
POST   /v1/assets/{id}/reanalyze
```

### 22.2 检索

```text
POST   /v1/search
POST   /v1/search/similar-image
POST   /v1/search/feedback
GET    /v1/search/sessions/{id}
```

### 22.3 项目与时间线

```text
POST   /v1/projects
POST   /v1/projects/{id}/brief:parse
POST   /v1/projects/{id}/storyboard:generate
POST   /v1/projects/{id}/materials:retrieve
POST   /v1/projects/{id}/timeline:generate
POST   /v1/projects/{id}/timeline:patch
GET    /v1/projects/{id}/timeline/versions
POST   /v1/projects/{id}/renders
GET    /v1/renders/{id}
POST   /v1/renders/{id}/cancel
```

### 22.4 事件

```text
asset.ingest.started
asset.analysis.completed
asset.analysis.failed
index.updated
project.storyboard.ready
project.timeline.ready
render.progress
render.completed
render.failed
quality.review.failed
```

## 23. 权限与版权规则

素材进入检索前必须通过：

```text
tenant permission
AND user role permission
AND project classification
AND rights status
AND region/channel restrictions
AND expiration rule
AND content safety policy
```

时间线保存素材授权快照。即使授权后来变化，也能确定当时生成所依据的状态；最终导出前必须重新校验当前授权。

## 24. 自动质检与评测

### 24.1 素材分析评测集

- Shot边界人工标注集。
- 关键帧代表性标注集。
- 场景、主体、动作和镜头标签集。
- OCR、ASR和时间码对齐集。
- 画质与风险标签集。

### 24.2 检索评测

- `Recall@K`
- `NDCG@K`
- 零结果率
- 结果采用率
- 人工替换率
- 权限/版权违规召回数必须为0
- 查询到最终可剪辑素材的平均耗时

### 24.3 视频合成评测

- 脚本信息覆盖率。
- 旁白画面匹配率。
- Shot重复率。
- 章节时长偏差。
- 字幕错误和越界数。
- 音画不同步时长。
- 局部修改成功率。
- 审核一次通过率。

## 25. UI 信息架构

### 25.1 素材中心

- 入库队列
- 素材浏览器
- 镜头/关键帧视图
- 标签与本体管理
- 授权与风险中心
- 重复和低质素材治理

### 25.2 创作工作台

- 对话式需求输入
- Brief确认
- 章节/脚本编辑器
- Storyboard分镜墙
- 素材候选抽屉
- 多轨时间线
- 质检问题面板
- 渲染和版本历史

### 25.3 运维控制台

- Worker与队列
- Provider健康和成本
- 模型与Prompt版本
- 失败任务和重试
- 容量与生命周期
- 审计日志

### 25.4 原型到交付的追踪要求

| 页面组 | 后端/契约依赖 | 对应 Task | 退出证据 |
|---|---|---|---|
| 数据资源库、多模态列表、资源详情 | 资产/派生关系、作用域、分页、权限、预览 | 2/3/7/8/15 | 实际资产与多模态证据可互相定位 |
| 智能识别详情、目标驱动成片 | 时间区间标注、实体浏览、候选来源 | 5/6/8/15 | 指定目标命中源时间，未配置明确提示 |
| 剪辑工作台、长视频编排 | Chapter/Sequence、Timeline/Patch/版本、局部渲染 | 9/10/11/12/15 | 编辑到实际输出一致，撤销可复现 |
| 一键成片、智能体对话 | 项目级 Brief、范围/能力约束、确认节点 | 9/10/15 | 缺参/缺素材有明确结果，不虚构成片 |
| 任务中心、调度流程 | 持久化任务/事件、重试范围、能力调用记录 | 6/14/15 | 重启后状态恢复、重复操作幂等 |
| 工作台概览、统计分析、系统管理 | 指标口径、角色、配额和引擎状态 | 16/15 | 数字可追溯真实统计窗口和数据源 |
| 回收站 | 删除/保留策略、引用影响与恢复 | 2/16/15 | 逻辑撤权即时生效，清理与恢复可审计 |

原 13 页及新增 2 页均在这些任务子项内追踪，不能因示例任务卡简略而断言无覆盖。每页在原型 README 维护 FR→接口→Task→验收用例映射；演示事件带 simulation=true，界面保留明显演示标识，不能把定时器进度称为真实执行进度。第一版编辑范围为受约束时间线，不承诺通用 NLE 全部功能。

## 26. 推荐仓库结构

```text
mediaflow/
├── apps/
│   ├── web/                         # Next.js Studio
│   └── api/                         # FastAPI
├── services/
│   ├── ingest-worker/
│   ├── analysis-worker/
│   ├── indexing-worker/
│   ├── planning-worker/
│   └── render-worker/
├── packages/
│   ├── contracts/                   # JSON Schema/OpenAPI/event schemas
│   ├── timeline/                    # Timeline IR与Patch
│   ├── providers/                   # 模型和素材Provider接口
│   ├── taxonomy/                    # 标签本体与规则
│   └── observability/
├── workflows/
│   ├── asset_ingest.py
│   └── video_project.py
├── renderers/
│   ├── ffmpeg/
│   └── remotion/
├── migrations/
├── tests/
│   ├── contract/
│   ├── integration/
│   ├── retrieval_eval/
│   └── media_fixtures/
├── docs/
└── infra/
```

实施时不创建 `services/*` 全部独立部署。首期采用模块化单体 + 独立Worker，达到明确扩展瓶颈后再拆分服务。

## 27. 分阶段交付

下列为产品路线，不是现有 Sxx 开发批次的完成统计。周期为资源和数据具备后的估算，未开始或未验收不得按日历自动升级阶段。当前短素材闭环只计基础验证，Phase 0 数据准备与 Phase 1 的完整退出条件仍未通过。

### Phase 0：需求和数据验证（2周）

- 收集50～100个真实长视频样本及10类典型查询。
- 定义标签本体v1、授权模型和时间线v1。
- 确认规模、SLA、部署方式和外部Provider范围。
- 建立人工评测集和黄金样本。

退出条件：样本清单、10 类查询及标注方案落盘；核心 Schema、部署边界、Provider 数据策略和阶段验收指标有明确评审结论。团队角色未实际评审时不得代记通过。生产 SLA 不属于本阶段实测退出条件。

### Phase 1：素材库MVP（4～6周）

- 上传、对象存储、元数据和代理文件。
- Shot切分、关键帧、ASR、OCR和基础视觉标签。
- 素材、Shot和关键帧浏览。
- PostgreSQL/pgvector混合检索。
- 人工标签校正和重新索引。

退出条件：累计 100 小时测试视频的清单与完整入库报告可追溯；失败样本有分类与处理结论，任务中断恢复通过；固定黄金集 Recall@20 达到 §21.1 确认阈值，权限违规返回为 0。硬件与耗时实测报告齐备。6 秒样例只作冒烟测试，不替代本条件。

### Phase 2：自然语言创作（4～6周）

- Intent/Brief Schema。
- 脚本、章节、分镜和素材覆盖报告。
- 镜头级检索、重排和全局分配。
- Timeline IR、代理预览和基础编辑。

退出条件：固定项目样例仅用内部素材生成 3～10 分钟结构化粗剪；每镜头可追溯，硬约束违反为 0，缺口显式返回，至少一次局部修改/保存/重渲染流程验证；章节覆盖与连贯性由人工量表评审。Brief 到草稿耗时按样例记录，性能目标依据预算确定。

### Phase 3：长视频生产化（4～6周）

- 分段渲染、缓存、局部重渲染。
- 音频、字幕、章节包装和Remotion模板。
- 自动质检、审批、版本比较和项目归档。
- Provider fallback、成本和审计。

退出条件：真实 30 分钟项目在中断后从有效检查点恢复；单镜头修改仅重算实际依赖片段，输出无重复 handle、音画对齐与字幕检查通过。1080p 渲染速度按硬件/模板实测，不从代理短片结果推断。

### Phase 4：规模化与效果闭环（持续）

- OpenSearch和大规模索引优化。
- 检索反馈学习、标签模型评测和漂移监控。
- 外部授权素材与AI生成补缺。
- 多租户、配额、计费和企业集成。

## 28. 实施任务清单

以下任务假定新仓库名为 `mediaflow`，采用TDD和小步提交。

所有 Task 的完成定义：代码/接口、必要迁移、正反例测试、用户流程证据和阶段记录齐备。纯契约交付只能标记子任务完成；后文 git commit 步骤仅适用于已初始化仓库，不代表当前存在对应提交。

### Task 1: 建立契约优先的项目骨架

拆为 1a 核心 Asset/Shot/Brief/Timeline 契约、1b 按模块引入 Annotation、EmbeddingSpace、AnalysisJob/Event、ProviderCall、Rights/Usage、Patch、RenderJob、QualityReport。每项维护版本、生成源与兼容测试；Pydantic 模型不等于已导出 JSON Schema。当前仓库只导出四个核心 schema，其余为待实施目标。

**Files:**
- Create: `mediaflow/packages/contracts/schemas/asset.schema.json`
- Create: `mediaflow/packages/contracts/schemas/shot.schema.json`
- Create: `mediaflow/packages/contracts/schemas/video-brief.schema.json`
- Create: `mediaflow/packages/contracts/schemas/timeline.schema.json`
- Create: `mediaflow/tests/contract/test_json_schemas.py`

**Steps:**

1. 为合法和非法样例编写失败测试。
2. 运行 `pytest tests/contract/test_json_schemas.py -v`，确认Schema尚未实现导致失败。
3. 按本文定义实现四个Schema。
4. 再次运行测试并确认通过。
5. 提交：`git commit -m "feat: define core mediaflow contracts"`。

### Task 2: 实现素材元数据与迁移

**Files:**
- Create: `mediaflow/apps/api/app/models/assets.py`
- Create: `mediaflow/apps/api/app/models/annotations.py`
- Create: `mediaflow/migrations/versions/0001_assets.py`
- Test: `mediaflow/tests/integration/test_asset_models.py`

**Steps:**

1. 写入Asset、Shot、Keyframe、Annotation关系和租户隔离测试。
2. 运行测试确认失败。
3. 实现最小模型和数据库迁移。
4. 验证时间范围约束、外键和唯一索引。
5. 提交：`git commit -m "feat: add asset catalog data model"`。

### Task 3: 实现幂等上传与对象存储

**Files:**
- Create: `mediaflow/apps/api/app/routes/uploads.py`
- Create: `mediaflow/apps/api/app/services/object_store.py`
- Test: `mediaflow/tests/integration/test_multipart_upload.py`

**Steps:**

1. 编写分片、恢复、重复完成和SHA-256去重测试。
2. 运行测试确认失败。
3. 实现S3兼容分片上传。
4. 验证重复请求不会创建重复Asset。
5. 提交：`git commit -m "feat: add resumable asset uploads"`。

### Task 4: 实现视频探测和标准化

**Files:**
- Create: `mediaflow/services/analysis-worker/media/probe.py`
- Create: `mediaflow/services/analysis-worker/media/normalize.py`
- Test: `mediaflow/tests/integration/test_media_normalization.py`

**Steps:**

1. 使用CFR、VFR、旋转、无音轨和损坏媒体夹具编写测试。
2. 确认测试失败。
3. 实现ffprobe解析、代理生成和时间码映射。
4. 用ffprobe断言输出编码、帧率、音轨和时长。
5. 提交：`git commit -m "feat: normalize uploaded video assets"`。

### Task 5: 实现Shot切分与关键帧

**Files:**
- Create: `mediaflow/services/analysis-worker/video/shot_detector.py`
- Create: `mediaflow/services/analysis-worker/video/keyframes.py`
- Test: `mediaflow/tests/integration/test_shot_keyframe_pipeline.py`

**Steps:**

1. 为硬切、渐变、短镜头和跨分片边界编写黄金测试。
2. 运行测试确认失败。
3. 实现分片检测、边界合并和关键帧评分。
4. 验证全局时间码、镜头无重叠且关键帧位于镜头区间内。
5. 提交：`git commit -m "feat: extract shots and representative keyframes"`。

### Task 6: 实现ASR、OCR与视觉Provider

**Files:**
- Create: `mediaflow/packages/providers/asr.py`
- Create: `mediaflow/packages/providers/ocr.py`
- Create: `mediaflow/packages/providers/vision.py`
- Create: `mediaflow/services/analysis-worker/pipeline/enrich.py`
- Test: `mediaflow/tests/integration/test_multimodal_enrichment.py`

**Steps:**

1. 编写Provider契约、超时、无结果和fallback测试。
2. 运行测试确认失败。
3. 实现Provider接口及一个默认适配器。
4. 校验所有输出通过Schema并能映射至Shot时间范围。
5. 提交：`git commit -m "feat: enrich shots with multimodal analysis"`。

### Task 7: 实现标签本体与人工校正

**Files:**
- Create: `mediaflow/packages/taxonomy/taxonomy.yaml`
- Create: `mediaflow/apps/api/app/services/taxonomy.py`
- Create: `mediaflow/apps/api/app/routes/annotations.py`
- Test: `mediaflow/tests/integration/test_taxonomy_annotations.py`

**Steps:**

1. 编写层级、同义词、冲突优先级和版本测试。
2. 运行测试确认失败。
3. 实现标签规范化和人工审核状态。
4. 验证修改触发受影响索引更新事件。
5. 提交：`git commit -m "feat: add governed media taxonomy"`。

### Task 8: 实现混合检索

**Files:**
- Create: `mediaflow/apps/api/app/services/search.py`
- Create: `mediaflow/apps/api/app/routes/search.py`
- Create: `mediaflow/tests/retrieval_eval/test_hybrid_search.py`
- Create: `mediaflow/tests/retrieval_eval/golden_queries.jsonl`

**Steps:**

1. 为语义、标签、负向条件、权限和版权编写评测。
2. 运行评测并记录初始基线。
3. 实现BM25、pgvector、标签和重排融合。
4. 验证版权违规召回为0，并计算Recall@20/NDCG@20。
5. 提交：`git commit -m "feat: add explainable hybrid shot retrieval"`。

### Task 9: 实现Brief与长视频层级规划

**Files:**
- Create: `mediaflow/services/planning-worker/brief.py`
- Create: `mediaflow/services/planning-worker/storyboard.py`
- Test: `mediaflow/tests/integration/test_video_planning.py`

**Steps:**

1. 编写缺参、冲突、长视频章节预算和素材约束测试。
2. 运行测试确认失败。
3. 实现受Schema约束的Brief与Storyboard生成。
4. 验证章节时长合计、必选信息点和素材策略。
5. 提交：`git commit -m "feat: plan hierarchical long-form videos"`。

### Task 10: 实现有界跨章节分配与缺口报告

**Files:**
- Create: `mediaflow/services/planning-worker/allocation.py`
- Test: `mediaflow/tests/integration/test_asset_allocation.py`

**Steps:**

1. 为素材重复、连续性、无结果、预算到限与小窗口回溯编写测试；小型穷举基准可用于质量对比，但不要求任意规模全局最优。
2. 运行测试确认失败。
3. 实现候选分配、重复约束和缺口分类。
4. 验证每个选中素材都有检索证据和选择理由。
5. 提交：`git commit -m "feat: allocate library assets across storyboard"`。

### Task 11: 实现Timeline IR与Patch

**Files:**
- Create: `mediaflow/packages/timeline/model.py`
- Create: `mediaflow/packages/timeline/patch.py`
- Test: `mediaflow/tests/contract/test_timeline_patch.py`

**Steps:**

1. 编写时间线合法性、重叠、ripple edit、版本冲突和撤销测试。
2. 运行测试确认失败。
3. 实现不可变版本和Patch应用器。
4. 验证相同Patch请求幂等且不会覆盖baseVersion。
5. 提交：`git commit -m "feat: add versioned timeline intermediate representation"`。

### Task 12: 实现代理与分段渲染

**Files:**
- Create: `mediaflow/renderers/ffmpeg/compiler.py`
- Create: `mediaflow/renderers/remotion/src/Root.tsx`
- Create: `mediaflow/services/render-worker/render.py`
- Test: `mediaflow/tests/integration/test_segment_render.py`

**Steps:**

1. 编写两章节、转场、字幕、旁白和局部失效测试。
2. 运行测试确认失败。
3. 实现分片编译、缓存键、FFmpeg/Remotion执行和拼接。
4. 使用ffprobe和抽帧验证成片。
5. 提交：`git commit -m "feat: render cached long-form timeline segments"`。

### Task 13: 实现自动质检

**Files:**
- Create: `mediaflow/services/render-worker/quality.py`
- Create: `mediaflow/packages/contracts/schemas/quality-report.schema.json`
- Test: `mediaflow/tests/integration/test_render_quality.py`

**Steps:**

1. 为黑帧、静音、字幕越界、重复镜头和错配画面编写测试。
2. 运行测试确认失败。
3. 实现硬指标检测和受约束的内容审查。
4. 验证失败项包含时间码、证据和修复建议。
5. 提交：`git commit -m "feat: add automated media quality gates"`。

### Task 14: 实现持久化任务与可替换工作流

14a：契约与开发适配器。明确内存状态无恢复保证；S04 仅覆盖部分接口，状态校验/事件序列缺陷仍待修复。

14b：先实现数据库任务、事务事件、幂等唯一约束、租约和检查点，满足 §18.4 的真实重启与并发验收，不能无限延期到每个新批次。

14c：Temporal 适配器，复用既有业务契约与恢复测试，验证 Activity 重试、Signal/Update 取消、输出对账。是否进入此子任务取决于部署范围；内存适配器不能替代 14b。

**Files:**
- Create: `mediaflow/workflows/asset_ingest.py`
- Create: `mediaflow/workflows/video_project.py`
- Test: `mediaflow/tests/integration/test_workflow_recovery.py`

**Steps:**

1. 编写Worker丢失、Provider超时、重复消息、暂停和恢复测试。
2. 运行测试确认失败。
3. 实现活动、重试策略、心跳和补偿逻辑。
4. 验证服务重启后从最后成功阶段恢复。
5. 提交：`git commit -m "feat: orchestrate resumable media workflows"`。

### Task 15: 实现Web素材中心与创作工作台

**Files:**
- Create: `mediaflow/apps/web/app/library/page.tsx`
- Create: `mediaflow/apps/web/app/projects/[id]/page.tsx`
- Create: `mediaflow/apps/web/components/shot-grid.tsx`
- Create: `mediaflow/apps/web/components/storyboard.tsx`
- Create: `mediaflow/apps/web/components/timeline.tsx`
- Test: `mediaflow/apps/web/tests/creator-flow.spec.ts`

**Steps:**

1. 编写从搜索到分镜、替换素材、预览和渲染的E2E测试。
2. 运行测试确认失败。
3. 实现最小素材浏览、分镜和时间线交互。
4. 使用真实代理视频执行完整浏览器验收。
5. 提交：`git commit -m "feat: add media library and creator studio"`。

### Task 16: 完成安全、审计和可观测性

**Files:**
- Create: `mediaflow/apps/api/app/security/policies.py`
- Create: `mediaflow/packages/observability/tracing.py`
- Create: `mediaflow/infra/otel-collector.yaml`
- Test: `mediaflow/tests/integration/test_tenant_isolation.py`

**Steps:**

1. 编写跨租户访问、授权过期、密钥泄露和审计完整性测试。
2. 运行测试确认失败。
3. 实现权限策略、日志脱敏、追踪和核心指标。
4. 执行故障演练并验证审计证据。
5. 提交：`git commit -m "feat: secure and observe mediaflow workloads"`。

## 29. MVP验收用例

### AC-01 长视频入库

给定一条2小时、VFR、带双音轨的视频，系统应生成代理、镜头、关键帧、转写、标签和索引；所有Shot时间码可准确回溯原片。

### AC-02 精确检索

输入“会议室内一名工程师操作机械臂的近景，至少5秒”，系统返回Shot级结果，并展示时间码、关键帧、命中标签和可用时长。

### AC-03 权限过滤

无论语义相关性多高，无授权或当前用户无权访问的素材均不得出现在结果和LLM上下文中。

### AC-04 长视频合成

输入10分钟纪实视频需求，系统能生成章节、脚本、分镜、素材映射、代理视频和最终视频，章节时长总误差不超过1秒。

### AC-05 局部修改

替换一个镜头后，只重新检索和渲染受影响章节；未受影响章节的产物哈希保持不变。

### AC-06 失败恢复

在分析或渲染中停止Worker，恢复后系统从最近检查点继续，不重复创建素材、Shot或计费调用。

### AC-07 可追溯

从最终视频任意Clip可以追溯原始Asset、时间码、授权、检索查询、标签、模型版本和审批记录。

## 30. 主要风险与缓解

风险表作为登记册维护：每项补 owner、触发条件、检测方法、状态、剩余风险和下次检查。当前重点：S04 状态/事件不变量缺陷（任务模块 owner，已复现待修）、内存任务丢失（工作流 owner，持久化待实现）、未做真实长视频/检索评测（媒体与检索 owner，阶段未验收）、浏览器连接失败（Web owner，视觉验收待补）。模型置信度不可直接当作已校准正确率；已有测试数不作为风险已消除的依据。

| 风险 | 缓解措施 |
|---|---|
| 长视频分析成本过高 | 代理分析、分片并行、内容哈希缓存、按需升级模型 |
| 自动标签质量不稳定 | 置信度、评测集、人工审核、标签版本和漂移监控 |
| 向量检索相关但不可剪 | 技术/版权硬过滤，Cross-Encoder重排，采用率反馈 |
| 长视频叙事松散 | 分层规划、章节预算、全局素材分配和中间审批 |
| 模型输出不可控 | JSON Schema、工具白名单、状态机、事实引用和质量门 |
| 渲染耗时和失败 | 分片、缓存、幂等重试、局部失效和代理预览 |
| 素材版权风险 | 来源与授权必填、导出前复检、Usage证据链 |
| 人脸与声纹隐私 | 独立授权、加密、细粒度权限和删除闭环 |
| Provider锁定 | 统一接口、能力矩阵、项目锁定与fallback策略 |

## 31. 最终决策建议

1. 先建设素材数据底座，再建设自动长视频；不能反过来。
2. 视频的主要检索单位为 Shot/有标记的分析窗口；图片可直接作为 Asset 检索，关键帧提供视觉检索证据，不虚构图片原始时长。
3. 目标 PostgreSQL 是业务记录的权威存储，当前开发版使用 SQLite；模型推断入库不等于已验证事实，向量库和搜索引擎是可重建索引。
4. 首期使用模块化单体和独立Worker，不直接进入微服务拆分。
5. 长视频必须采用章节化计划和分段渲染。
6. 时间线和所有核心Agent输出从第一天起使用版本化Schema。
7. 素材授权、权限与审计必须进入最初数据模型，不能后补。
8. AI生成素材只作为显式允许的缺口补齐手段，不应掩盖内部素材不足。
9. 用真实业务黄金集衡量Shot、标签和检索，而不是只观察Demo效果。
10. MVP先完成“内部素材生成3～10分钟长视频”的闭环，再扩展外部素材、复杂生成视频和多平台发布。
