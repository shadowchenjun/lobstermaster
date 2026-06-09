# AI 基础设施投资分享笔记

整理日期：2026-06-09

用途：学习素材保留，不作为官网页面展示，不构成任何证券买卖建议。

来源说明：根据 AI 基础设施学习笔记整理，并结合 NVIDIA、Alphabet/Google 等公开资料做趋势验证。

---

## 一、核心判断

这场分享的主线是：AI 进入“算力为王、Token 即生产力”的阶段，底层基础设施的价值会持续上升。

AI 的产出可以理解为 Token，Token 背后对应的是算力、存力和互联能力。未来不是单纯拼模型，而是拼谁能更低成本、更高效率地生产 Token。因此，AI 基础设施会从单点芯片竞争，升级为“计算 + 存储 + 高速互联”的系统级竞争。

投资上，核心方法论是：只投卖铲子。

也就是优先投 AI 产业链中确定性更高的基础设施环节，而不是直接押单一应用。

---

## 二、AI 产业格局：中美对比

美国 AI 产业更偏闭源生态，由 OpenAI、Google、Anthropic、Meta、Microsoft、NVIDIA 等巨头主导，算力、模型、云平台深度绑定。

中国 AI 产业更偏开源、免费和快速扩散。笔记中提到中国 AI 产业规模约 5.1 万亿，过去两年 AI 相关增长超过千倍级别。这里的“千倍”可能指模型调用、应用数量、Token 消耗或产业热度，需要后续核实具体口径。

中美对比下，中国的机会主要在：

1. 国产替代。
2. AI 基础设施补短板。
3. 光互联、存储、先进封装、半导体设备材料。
4. 未来量子科技与卫星互联网。

---

## 三、AI 基础设施三大支柱

AI 基础设施可以拆成三块：

| 环节 | 占比/规模线索 | 投资含义 |
| --- | ---: | --- |
| 算力 | 约 42.5% | GPU、ASIC、TPU、交换芯片、先进封装 |
| 存力 | 约 25%，提到 316 亿 | HBM、DRAM、NAND，长鑫、长存等国产替代 |
| 互联 | 约 37.5%，提到 325 亿 | CPO、OCS、硅光、光模块、光芯片、连接器 |

以上数字属于学习笔记口径，后续需要结合公开研报或公司披露核实。更重要的是方向判断：互联正在成为 AI 算力扩展的瓶颈和最快增长点。

过去市场主要盯 GPU，但当集群规模继续扩大后，GPU 之间、机柜之间、数据中心之间的数据交换会变得越来越关键。未来 AI 超级工厂的能力，不只取决于单颗芯片，而取决于整个集群的互联效率。

---

## 四、Token 工厂经济

NVIDIA GTC 提到“Token 工厂经济”。这可以理解为：AI 数据中心不是传统 IDC，而是生产 Token 的工厂。

Token 工厂的核心投入包括：

1. GPU / XPU / TPU。
2. 存储系统。
3. 高速网络。
4. 光互联。
5. 电力和液冷。
6. 软件调度和集群管理。

投资逻辑是：谁能降低 Token 生产成本，谁就掌握 AI 时代的基础设施定价权。

所以未来 AI 基础设施会从“算力中心”走向“算力 + 互联中心”。

---

## 五、光互联/CPO 是重点机会

光电互联将成为 AI 算力的核心基础。

原因是电互联在距离、功耗、带宽密度上会遇到瓶颈，而光互联具备更高带宽、更低损耗、更适合大规模集群扩展的特点。

重点技术包括：

1. CPO：共封装光学，把光引擎靠近交换芯片或计算芯片。
2. OCS：光电路交换/光交换机，用纯光或近纯光方式做网络切换。
3. 硅光：把光学器件集成到硅基平台上。
4. 光子集成：未来计算、存储、互联进一步解耦和重构。
5. 光引擎、激光器、调制器、探测器、连接器、测试设备。

笔记中提到：2026 年可能是 OCS 商用化元年，OCS 增长率约 122%。这一点可以作为后续重点跟踪指标。

---

## 六、看巨头在做什么

方法论：看不清方向的时候，看巨头在投什么。

### NVIDIA

NVIDIA 不只是卖 GPU，也在做网络、交换、CPO、光互联和 AI 工厂架构。

根据 NVIDIA FY2027 Q1 公开数据：

| 指标 | 数据 | 同比 |
| --- | ---: | ---: |
| 总收入 | 816 亿美元 | +85% |
| 数据中心收入 | 752 亿美元 | +92% |
| 数据中心计算收入 | 604 亿美元 | +77% |
| 数据中心网络收入 | 148 亿美元 | +199% |

网络收入增速显著高于计算收入，验证了“高速互联是最快增长点”的判断。

### Google / Alphabet

Google 围绕 TPU 做超大规模集群。TPU 芯片互联、OCS 光交换机、Google 光电互联体系是重要观察方向。

根据 Alphabet/Google 公开披露：

| 指标 | 数据 | 含义 |
| --- | ---: | --- |
| Alphabet Q1 2026 收入 | 902 亿美元 | 同比 +22% |
| Google Cloud Q1 2026 收入 | 127 亿美元 | 同比 +63% |
| Alphabet Q1 2026 CapEx | 357 亿美元 | 同比 +107% |
| 2026 年 CapEx 预期 | 1800-1900 亿美元 | AI 基础设施继续扩张 |
| 第一方模型 API Token | 每分钟 190 亿 | 约同比 6 倍 |

Google Research 的 Jupiter 论文显示，OCS 与软件定义网络结合后，能带来：

| 指标 | 改善 |
| --- | ---: |
| CapEx | 降低 30% |
| 功耗 | 降低 41% |
| 网络重构速度 | 提升 3 倍 |

这说明 OCS 不只是概念，而是超大规模数据中心已经验证过的架构方向。

---

## 七、产业链拆解

光电产业可以拆成三类基础能力：

1. 光学：激光器、透镜、耦合、光纤、调制器、探测器。
2. 微电子：交换芯片、DSP、SerDes、硅光芯片、先进封装。
3. 机械/精密制造：连接器、封装、测试、散热、光纤阵列。

上游核心包括：

1. 关键芯片。
2. 关键器件。
3. 关键设备。
4. 关键材料。

这也是国产替代最值得跟踪的地方。

---

## 八、美股代表公司

| 公司 | 代码 | 逻辑 |
| --- | ---: | --- |
| NVIDIA | NVDA | AI 工厂定义者，GPU + 网络 + 光互联 |
| Broadcom | AVGO | 交换芯片、SerDes、ASIC、CPO |
| Marvell | MRVL | 光 DSP、定制 ASIC、数据中心互联 |
| Coherent | COHR | 激光器、光器件、光模块、材料 |
| Lumentum | LITE | 激光器、光源、光通信器件 |
| Corning | GLW | 光纤、玻璃、连接材料 |
| Micron | MU | 存储/HBM，AI 存力受益 |
| TSMC | TSM | 先进制程、先进封装 |
| Intel | INTC | 硅光、封装、数据中心芯片 |
| POET | POET | 光引擎/光中介层，小盘高波动 |

美股主线不只是 NVIDIA，而是整个 AI 半导体基础设施链。

---

## 九、A 股代表公司

| 公司 | 代码 | 逻辑 |
| --- | ---: | --- |
| 中际旭创 | 300308 | 高速光模块龙头，800G/1.6T 主线 |
| 新易盛 | 300502 | 高速数通光模块 |
| 天孚通信 | 300394 | 光器件、光引擎零部件 |
| 光迅科技 | 002281 | 光芯片、光器件、光模块 |
| 剑桥科技 | 603083 | 光模块、CPO/NPO 相关布局 |
| 华工科技 | 000988 | 光模块、激光加工、光通信 |
| 源杰科技 | 688498 | 激光器/光芯片 |
| 光库科技 | 300620 | 光器件、调制器相关 |
| 太辰光 | 300570 | 光连接器、光器件 |
| 长鑫/长存 | 未直接 A 股上市 | 国产 DRAM/NAND 存储主线 |

注：“中级旭创”应为“中际旭创”，“化工科技”大概率是“华工科技”。

---

## 十、量子科技与卫星互联网

除了 AI 基础设施，笔记中还提到两个中长期方向：

1. 量子科技：可能进入“十五五”科技发展重点方向。
2. 卫星互联网：Starlink 带动全球关注，中国也可能在十五五规划中加强布局。

投资含义是：AI 基础设施是当下主线，量子科技和卫星互联网是下一阶段战略科技方向。

如果用组合思路理解：

| 方向 | 定位 |
| --- | --- |
| AI 基础设施 | 当下主线，收入和订单更容易验证 |
| 量子科技 | 长期战略弹性 |
| 卫星互联网 | 空间通信和全球网络基础设施弹性 |

---

## 十一、最终投资框架

这场分享可以浓缩成一句话：

AI 时代不是只投模型，而是投 Token 工厂的铲子：算力、存力、互联，其中互联的边际变化最大，CPO/OCS/硅光是下一阶段重点。

优先级上，可以这样理解：

1. 确定性最高：AI 算力链、光模块、交换芯片、先进封装、HBM。
2. 弹性最大：CPO、OCS、硅光、光引擎、激光器。
3. 国产替代：存储、光芯片、光器件、半导体设备材料。
4. 中长期战略：量子科技、卫星互联网。
5. 投资原则：少押单一应用，多押基础设施和卖铲子环节。

---

## 十二、需要持续跟踪的指标

| 指标 | 为什么重要 |
| --- | --- |
| 云巨头 CapEx 是否继续上修 | 决定 AI 基础设施总需求 |
| NVIDIA Networking 增速 | 验证互联是否继续高于计算增长 |
| Broadcom / Marvell AI 网络收入 | 验证交换芯片、DSP、ASIC 景气度 |
| 800G / 1.6T 光模块出货 | 验证当下业绩主线 |
| CPO / OCS 商用节奏 | 验证下一阶段估值弹性 |
| HBM 供需和价格 | 验证存力瓶颈 |
| 国内光芯片国产化率 | 验证国产替代空间 |
| 出口管制和供应链政策 | 影响中美产业链分化 |

---

## 十三、风险提示

这条产业链机会很大，但波动也会很大。

主要风险包括：

1. AI CapEx 周期低于预期。
2. CPO / OCS 商用节奏慢于市场预期。
3. 可插拔光模块生命周期比预期更长。
4. 光模块价格竞争压缩利润。
5. 客户集中度高。
6. 出口管制和供应链限制。
7. 估值提前反映未来多年增长。

因此，更稳妥的方式不是押单一概念，而是持续跟踪真实订单、收入、毛利率、CapEx 和技术路线兑现。

---

## 公开资料来源

- NVIDIA FY2027 Q1 Financial Results：https://nvidianews.nvidia.com/_gallery/download_pdf/6a0e17dc3d633295d45282e6/
- NVIDIA Rubin 平台新闻稿：https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer
- NVIDIA Vera Rubin DSX AI Factory Reference Design：https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Releases-Vera-Rubin-DSX-AI-Factory-Reference-Design-and-Omniverse-DSX-Digital-Twin-Blueprint-With-Broad-Industry-Support/default.aspx
- Alphabet Q1 2026 Earnings Release：https://s206.q4cdn.com/479360582/files/doc_financials/2026/q1/2026q1-alphabet-earnings-release.pdf
- Alphabet Q1 2026 Earnings Slides：https://s206.q4cdn.com/479360582/files/doc_financials/2026/q1/Alphabet-Q1-2026-Earnings-Slides.pdf
- Alphabet 2026 Equity Capital Raise Press Release：https://s206.q4cdn.com/479360582/files/doc_news/2026/Jun/01/attachments/2026-June-Alphabet-Equity-Capital-Raise-Press-Release-PDF.pdf
- Google Cloud TPU 官方页：https://cloud.google.com/tpu?hl=en_US
- Google Research Jupiter Evolving：https://research.google/pubs/jupiter-evolving-transforming-googles-datacenter-network-via-optical-circuit-switches-and-software-defined-networking/
