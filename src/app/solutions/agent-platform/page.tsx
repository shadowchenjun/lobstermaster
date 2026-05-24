'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export default function AgentPlatformPage() {
  const [index, setIndex] = useState(0)

  const show = useCallback((nextIndex: number) => {
    const newIndex = Math.max(0, Math.min(13, nextIndex))
    setIndex(newIndex)
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${newIndex + 1}`)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        show(index + 1)
      }
      if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        show(index - 1)
      }
      if (event.key === 'Home') show(0)
      if (event.key === 'End') show(13)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, show])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fromHash = Number(location.hash.replace('#', ''))
      if (fromHash >= 1 && fromHash <= 14) {
        setIndex(fromHash - 1)
      }
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        :root {
          --ink: #17211f;
          --muted: #5e6a66;
          --paper: #f7f3e8;
          --panel: #fffaf0;
          --line: #d8d0bd;
          --green: #1f6b55;
          --teal: #0d7f8a;
          --blue: #245c9a;
          --red: #b14d3e;
          --amber: #c9851a;
          --charcoal: #263331;
          --shadow: 0 24px 80px rgba(24, 33, 31, 0.16);
          --radius: 8px;
        }

        * { box-sizing: border-box; }

        html, body {
          margin: 0;
          height: 100%;
          background:
            linear-gradient(90deg, rgba(23, 33, 31, .05) 1px, transparent 1px),
            linear-gradient(rgba(23, 33, 31, .05) 1px, transparent 1px),
            var(--paper);
          background-size: 28px 28px;
          color: var(--ink);
          font-family: "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif;
          overflow: hidden;
        }

        button {
          font: inherit;
          color: inherit;
        }

        .deck {
          width: 100vw;
          height: 100vh;
          position: relative;
          display: grid;
          place-items: center;
          padding: 28px;
        }

        .slide {
          width: min(1280px, calc(100vw - 56px));
          aspect-ratio: 16 / 9;
          max-height: calc(100vh - 56px);
          background: var(--panel);
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
          border-radius: 10px;
          padding: 46px 54px;
          position: absolute;
          opacity: 0;
          transform: translateX(42px) scale(.985);
          pointer-events: none;
          transition: opacity .28s ease, transform .28s ease;
          overflow: hidden;
        }

        .slide.active {
          opacity: 1;
          transform: translateX(0) scale(1);
          pointer-events: auto;
        }

        .slide::before {
          content: "";
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(38, 51, 49, .12);
          border-radius: 7px;
          pointer-events: none;
        }

        .slide::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 10px;
          background: linear-gradient(90deg, var(--green), var(--teal), var(--blue), var(--amber));
        }

        .kicker {
          color: var(--green);
          text-transform: uppercase;
          letter-spacing: .08em;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        h1, h2, h3, p { margin: 0; }

        h1 {
          font-family: Georgia, "Songti SC", serif;
          font-size: clamp(42px, 5vw, 78px);
          line-height: 1.02;
          letter-spacing: 0;
          max-width: 860px;
        }

        h2 {
          font-family: Georgia, "Songti SC", serif;
          font-size: clamp(32px, 3.5vw, 54px);
          line-height: 1.04;
          max-width: 980px;
          letter-spacing: 0;
        }

        h3 {
          font-size: 21px;
          line-height: 1.25;
          margin-bottom: 10px;
        }

        .lead {
          margin-top: 22px;
          color: var(--muted);
          font-size: 22px;
          line-height: 1.55;
          max-width: 880px;
        }

        .meta-row {
          position: absolute;
          left: 54px;
          right: 54px;
          bottom: 34px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--muted);
          font-size: 13px;
          z-index: 3;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, .5);
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
          color: var(--charcoal);
        }

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 99px;
          background: var(--green);
        }

        .two-col {
          display: grid;
          grid-template-columns: 1.04fr .96fr;
          gap: 30px;
          margin-top: 30px;
        }

        .three-col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 28px;
        }

        .card {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: rgba(255, 255, 255, .44);
          padding: 20px;
          min-height: 150px;
        }

        .card strong {
          color: var(--green);
        }

        .card p, .note p, li {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.48;
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .tag {
          border: 1px solid rgba(31, 107, 85, .22);
          background: rgba(31, 107, 85, .08);
          color: var(--green);
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 13px;
          font-weight: 700;
        }

        .architecture {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 1fr 44px 1fr 44px 1fr;
          gap: 10px;
          align-items: stretch;
        }

        .layer-stack {
          display: grid;
          gap: 9px;
        }

        .layer {
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, .52);
          border-radius: 8px;
          padding: 12px 14px;
          min-height: 54px;
        }

        .layer b {
          display: block;
          color: var(--charcoal);
          font-size: 16px;
          margin-bottom: 3px;
        }

        .layer span {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.25;
        }

        .arrow {
          display: grid;
          place-items: center;
          color: var(--green);
          font-size: 28px;
          font-weight: 800;
        }

        .matrix {
          width: 100%;
          border-collapse: collapse;
          margin-top: 24px;
          font-size: 15px;
          overflow: hidden;
          border-radius: var(--radius);
        }

        .matrix th, .matrix td {
          border: 1px solid var(--line);
          padding: 12px 13px;
          vertical-align: top;
          text-align: left;
        }

        .matrix th {
          background: rgba(31, 107, 85, .12);
          color: var(--charcoal);
        }

        .matrix td {
          color: var(--muted);
          background: rgba(255, 255, 255, .46);
          line-height: 1.38;
        }

        .matrix td:first-child {
          color: var(--ink);
          font-weight: 800;
          width: 18%;
        }

        .callout {
          margin-top: 22px;
          border-left: 5px solid var(--green);
          background: rgba(31, 107, 85, .08);
          padding: 16px 18px;
          border-radius: 0 var(--radius) var(--radius) 0;
          color: var(--charcoal);
          font-size: 18px;
          line-height: 1.5;
        }

        .timeline {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .phase {
          position: relative;
          border-top: 4px solid var(--green);
          background: rgba(255, 255, 255, .48);
          border-radius: var(--radius);
          border-left: 1px solid var(--line);
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          padding: 18px;
          min-height: 260px;
        }

        .phase:nth-child(2) { border-top-color: var(--blue); }
        .phase:nth-child(3) { border-top-color: var(--amber); }

        ul {
          margin: 12px 0 0;
          padding-left: 20px;
        }

        li { margin: 7px 0; }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 28px;
        }

        .metric {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: rgba(255, 255, 255, .5);
          padding: 18px;
          min-height: 140px;
        }

        .metric .num {
          font-family: Georgia, serif;
          font-size: 38px;
          color: var(--green);
          line-height: 1;
          margin-bottom: 8px;
        }

        .metric p {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.38;
        }

        .flow {
          margin-top: 26px;
          display: grid;
          gap: 9px;
        }

        .flow-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 12px;
          align-items: center;
        }

        .flow-name {
          font-weight: 800;
          color: var(--green);
          font-size: 16px;
        }

        .flow-items {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pill {
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, .54);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 14px;
          color: var(--charcoal);
          font-weight: 700;
        }

        .controls {
          position: fixed;
          right: 24px;
          bottom: 22px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 250, 240, .82);
          border: 1px solid var(--line);
          backdrop-filter: blur(12px);
          border-radius: 999px;
          padding: 8px;
          box-shadow: 0 10px 30px rgba(24, 33, 31, .12);
        }

        .controls button {
          width: 34px;
          height: 34px;
          border-radius: 99px;
          border: 1px solid var(--line);
          background: white;
          cursor: pointer;
          font-weight: 900;
        }

        .counter {
          min-width: 58px;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
          font-weight: 800;
        }

        .source-list {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 18px;
        }

        .source-list a {
          color: var(--blue);
          text-decoration: none;
          font-size: 15px;
          line-height: 1.35;
          border-bottom: 1px solid rgba(36, 92, 154, .26);
          width: fit-content;
        }

        .stamp {
          position: absolute;
          right: 54px;
          top: 48px;
          color: rgba(31, 107, 85, .12);
          font-size: 120px;
          font-weight: 900;
          line-height: 1;
        }

        .back-link {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 250, 240, .82);
          border: 1px solid var(--line);
          backdrop-filter: blur(12px);
          border-radius: 999px;
          padding: 10px 16px;
          box-shadow: 0 10px 30px rgba(24, 33, 31, .12);
          font-size: 14px;
          font-weight: 700;
          color: var(--charcoal);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .back-link:hover {
          background: rgba(255, 250, 240, .95);
          box-shadow: 0 12px 36px rgba(24, 33, 31, .16);
        }

        @media print {
          html, body {
            overflow: visible;
            background: white;
          }
          .deck {
            display: block;
            padding: 0;
            height: auto;
          }
          .slide {
            position: relative;
            opacity: 1;
            transform: none;
            pointer-events: auto;
            page-break-after: always;
            width: 100vw;
            max-height: none;
            border-radius: 0;
            box-shadow: none;
          }
          .controls { display: none; }
          .back-link { display: none; }
        }
      `}</style>

      <Link href="/solutions" className="back-link">
        ← 返回解决方案
      </Link>

      <main className="deck" aria-live="polite">
        {/* Slide 1: Title */}
        <section className={`slide ${index === 0 ? 'active' : ''}`}>
          <div className="kicker">Private AI Agent Platform</div>
          <h1>私有化 Agent 平台建设方案</h1>
          <p className="lead">一套覆盖开源大模型私有化部署、RAG 知识库、Agent 管理编排、可观测与审计治理的企业级架构建议。</p>
          <div className="tag-row">
            <span className="tag">模型层</span>
            <span className="tag">RAG 知识库</span>
            <span className="tag">Agent 平台</span>
            <span className="tag">观测审计</span>
            <span className="tag">私有化部署</span>
          </div>
          <div className="meta-row">
            <span>建议版本：2026-05</span>
            <span>目标：从 MVP 到企业级平台演进</span>
          </div>
        </section>

        {/* Slide 2: Executive Summary */}
        <section className={`slide ${index === 1 ? 'active' : ''}`}>
          <div className="kicker">Executive Summary</div>
          <h2>推荐采用"平台 + 引擎 + 网关 + 治理"的分层架构</h2>
          <div className="three-col">
            <div className="card">
              <h3>平台入口</h3>
              <p><strong>Dify</strong> 作为 Agent 应用管理平台，负责应用、Prompt、Workflow、知识库入口、工具和发布管理。</p>
            </div>
            <div className="card">
              <h3>能力引擎</h3>
              <p><strong>vLLM + Xinference + RAGFlow</strong> 分别承载生产推理、多类型模型管理和高质量知识库。</p>
            </div>
            <div className="card">
              <h3>企业治理</h3>
              <p><strong>LiteLLM、Langfuse、Keycloak、OpenSearch</strong> 统一处理模型路由、观测、权限与审计。</p>
            </div>
          </div>
          <div className="callout">核心原则：Agent 负责理解和决策，Workflow/Tool Server 负责确定性执行，网关和审计层负责把风险关进笼子。</div>
        </section>

        {/* Slide 3: Target Architecture */}
        <section className={`slide ${index === 2 ? 'active' : ''}`}>
          <div className="kicker">Target Architecture</div>
          <h2>完整私有化部署架构</h2>
          <div className="architecture">
            <div className="layer-stack">
              <div className="layer"><b>业务入口</b><span>Web / API / 飞书 / 企业微信 / 门户</span></div>
              <div className="layer"><b>认证权限</b><span>Keycloak / SSO / RBAC / 租户</span></div>
              <div className="layer"><b>Agent 管理</b><span>Dify 为主，FastGPT 作为中文知识库场景备选</span></div>
              <div className="layer"><b>复杂编排</b><span>LangGraph / 平台 Workflow / Human-in-the-loop</span></div>
            </div>
            <div className="arrow">→</div>
            <div className="layer-stack">
              <div className="layer"><b>模型网关</b><span>LiteLLM / OneAPI：鉴权、路由、限流、成本统计</span></div>
              <div className="layer"><b>模型推理</b><span>vLLM：生产主力 LLM 推理</span></div>
              <div className="layer"><b>模型管理</b><span>Xinference：Embedding、Rerank、多类型模型</span></div>
              <div className="layer"><b>研发试验</b><span>Ollama：本地 PoC 与模型验证</span></div>
            </div>
            <div className="arrow">→</div>
            <div className="layer-stack">
              <div className="layer"><b>RAG 知识层</b><span>RAGFlow：解析、切分、检索、重排、引用</span></div>
              <div className="layer"><b>数据底座</b><span>PostgreSQL / Qdrant / Milvus / MinIO / Redis</span></div>
              <div className="layer"><b>工具执行</b><span>Tool Server / n8n / API Gateway / BPM</span></div>
              <div className="layer"><b>观测审计</b><span>Langfuse / Prometheus / Grafana / Loki / OpenSearch</span></div>
            </div>
          </div>
        </section>

        {/* Slide 4: Recommended Stack */}
        <section className={`slide ${index === 3 ? 'active' : ''}`}>
          <div className="kicker">Recommended Stack</div>
          <h2>推荐组件清单</h2>
          <table className="matrix">
            <thead>
              <tr><th>层级</th><th>推荐组件</th><th>选择理由</th><th>备选</th></tr>
            </thead>
            <tbody>
              <tr><td>Agent 平台</td><td>Dify</td><td>应用、Workflow、Prompt、RAG、工具和发布管理相对完整，适合先平台化。</td><td>FastGPT</td></tr>
              <tr><td>复杂编排</td><td>LangGraph</td><td>适合状态机、多 Agent、人工确认、长任务和失败恢复。</td><td>LlamaIndex / AutoGen</td></tr>
              <tr><td>RAG 层</td><td>RAGFlow</td><td>复杂文档解析、切分、检索、重排和引用溯源更完整。</td><td>Dify Knowledge / FastGPT Knowledge</td></tr>
              <tr><td>模型推理</td><td>vLLM</td><td>高吞吐、OpenAI API 兼容、适合生产多用户并发。</td><td>SGLang / TGI</td></tr>
              <tr><td>模型管理</td><td>Xinference</td><td>统一管理 LLM、Embedding、Rerank、多模态模型。</td><td>独立 TEI / vLLM 服务</td></tr>
              <tr><td>研发测试</td><td>Ollama</td><td>本地安装和试模型体验最佳，适合 PoC 和边缘验证。</td><td>LM Studio</td></tr>
            </tbody>
          </table>
        </section>

        {/* Slide 5: Model Layer */}
        <section className={`slide ${index === 4 ? 'active' : ''}`}>
          <div className="kicker">Model Layer</div>
          <h2>模型层采用"三角色分工"</h2>
          <div className="three-col">
            <div className="card">
              <h3>vLLM：生产主力</h3>
              <p>部署 Qwen、DeepSeek、Mistral 等主力 LLM，面向高并发和高吞吐；由模型网关统一暴露 OpenAI-compatible API。</p>
              <div className="tag-row"><span className="tag">GPU 利用率</span><span className="tag">并发</span><span className="tag">生产</span></div>
            </div>
            <div className="card">
              <h3>Xinference：模型中心</h3>
              <p>管理 Embedding、Reranker、语音、多模态和小模型；适合把 RAG 所需模型统一运维。</p>
              <div className="tag-row"><span className="tag">Embedding</span><span className="tag">Rerank</span><span className="tag">多后端</span></div>
            </div>
            <div className="card">
              <h3>Ollama：研发试验</h3>
              <p>给研发和业务 PoC 快速验证模型效果，降低试错成本；不作为核心生产推理底座。</p>
              <div className="tag-row"><span className="tag">本地</span><span className="tag">PoC</span><span className="tag">边缘</span></div>
            </div>
          </div>
          <div className="callout">建议模型：Qwen 系列作为中文通用主力，DeepSeek-R1 Distill 承载推理任务，BGE-M3 / Qwen Embedding 负责向量化，BGE Reranker / Qwen Reranker 负责重排。</div>
        </section>

        {/* Slide 6: RAG Layer */}
        <section className={`slide ${index === 5 ? 'active' : ''}`}>
          <div className="kicker">RAG Layer</div>
          <h2>RAGFlow 做知识库引擎，Chroma 不作为主方案</h2>
          <div className="two-col">
            <div className="card">
              <h3>为什么选 RAGFlow</h3>
              <ul>
                <li>覆盖文档解析、切分、索引、检索、重排和引用溯源。</li>
                <li>更适合 PDF、Word、Excel、PPT、制度、合同和报告等复杂知识库。</li>
                <li>业务人员可以参与知识维护，减少研发手写 pipeline 的负担。</li>
              </ul>
            </div>
            <div className="card">
              <h3>Chroma 的位置</h3>
              <ul>
                <li>适合研发 PoC、小型 RAG、自研 pipeline。</li>
                <li>更偏向量库，不承担完整知识库生命周期。</li>
                <li>生产向量库更建议 Qdrant、Milvus 或 pgvector。</li>
              </ul>
            </div>
          </div>
          <div className="flow">
            <div className="flow-row">
              <div className="flow-name">知识入库</div>
              <div className="flow-items"><span className="pill">文档上传</span><span className="pill">OCR/解析</span><span className="pill">Chunking</span><span className="pill">Embedding</span><span className="pill">索引</span></div>
            </div>
            <div className="flow-row">
              <div className="flow-name">知识检索</div>
              <div className="flow-items"><span className="pill">Hybrid Search</span><span className="pill">Rerank</span><span className="pill">上下文组装</span><span className="pill">引用溯源</span><span className="pill">权限过滤</span></div>
            </div>
          </div>
        </section>

        {/* Slide 7: Agent Layer */}
        <section className={`slide ${index === 6 ? 'active' : ''}`}>
          <div className="kicker">Agent Layer</div>
          <h2>Dify 做平台入口，LangGraph 承接复杂 Runtime</h2>
          <table className="matrix">
            <thead>
              <tr><th>能力</th><th>Dify</th><th>LangGraph</th><th>建议边界</th></tr>
            </thead>
            <tbody>
              <tr><td>应用管理</td><td>强</td><td>弱</td><td>Dify 负责应用创建、发布、Prompt、Workflow。</td></tr>
              <tr><td>业务编排</td><td>中到强</td><td>强</td><td>普通流程放 Dify，复杂状态机放 LangGraph。</td></tr>
              <tr><td>多 Agent</td><td>中</td><td>强</td><td>协作式 Agent、循环任务、人工确认用 LangGraph。</td></tr>
              <tr><td>业务系统调用</td><td>通过工具</td><td>通过工具</td><td>统一走 Tool Server，不直接暴露核心系统。</td></tr>
              <tr><td>治理</td><td>平台内置一部分</td><td>需自建</td><td>用网关、审计和观测层统一补齐。</td></tr>
            </tbody>
          </table>
          <div className="callout">平台不是越低代码越好。低代码负责规模化交付，代码级 Runtime 负责复杂性，二者组合更稳。</div>
        </section>

        {/* Slide 8: Governance */}
        <section className={`slide ${index === 7 ? 'active' : ''}`}>
          <div className="kicker">Governance</div>
          <h2>可观测与审计必须独立成层</h2>
          <div className="metric-grid">
            <div className="metric">
              <div className="num">01</div>
              <h3>Trace</h3>
              <p>记录用户问题、Prompt、RAG 命中文档、模型输出、工具调用和最终答案。</p>
            </div>
            <div className="metric">
              <div className="num">02</div>
              <h3>Metrics</h3>
              <p>监控 QPS、延迟、Token、GPU 利用率、错误率、知识库命中率。</p>
            </div>
            <div className="metric">
              <div className="num">03</div>
              <h3>Audit</h3>
              <p>审计谁在何时调用哪个 Agent、访问哪些知识、触发哪些工具动作。</p>
            </div>
            <div className="metric">
              <div className="num">04</div>
              <h3>Eval</h3>
              <p>建立问答集、RAG 评测、Prompt 版本和模型对比，避免上线后盲飞。</p>
            </div>
          </div>
          <div className="callout">建议组合：Langfuse 负责 LLM Trace 与评测；Prometheus/Grafana 负责指标；Loki 负责日志；OpenSearch 或 PostgreSQL 审计表负责合规追溯。</div>
        </section>

        {/* Slide 9: Security Model */}
        <section className={`slide ${index === 8 ? 'active' : ''}`}>
          <div className="kicker">Security Model</div>
          <h2>安全边界：用户、知识、模型、工具四类权限分开管</h2>
          <div className="two-col">
            <div className="card">
              <h3>权限与隔离</h3>
              <ul>
                <li>SSO 登录，Keycloak 对接 AD/LDAP/企业身份源。</li>
                <li>RBAC 控制平台角色，知识库 ACL 控制文档可见性。</li>
                <li>模型网关按用户、部门、Agent 限流和路由。</li>
                <li>工具调用需审批，危险动作必须 human-in-the-loop。</li>
              </ul>
            </div>
            <div className="card">
              <h3>数据与合规</h3>
              <ul>
                <li>敏感信息入库前脱敏，输出前做 DLP 检查。</li>
                <li>全链路审计，保留请求、引用、工具动作和审批记录。</li>
                <li>知识库按部门/项目/密级分区，避免越权检索。</li>
                <li>Prompt、Agent、工具版本纳入发布流程。</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Slide 10: Deployment Plan */}
        <section className={`slide ${index === 9 ? 'active' : ''}`}>
          <div className="kicker">Deployment Plan</div>
          <h2>三阶段落地路线</h2>
          <div className="timeline">
            <div className="phase">
              <h3>阶段一：MVP 验证</h3>
              <p className="badge"><span className="dot"></span> 2-4 周</p>
              <ul>
                <li>Dify + vLLM + RAGFlow</li>
                <li>Qwen/DeepSeek 主模型</li>
                <li>Qdrant + PostgreSQL + MinIO</li>
                <li>完成 2-3 个业务 Agent 试点</li>
              </ul>
            </div>
            <div className="phase">
              <h3>阶段二：治理补齐</h3>
              <p className="badge"><span className="dot"></span> 4-8 周</p>
              <ul>
                <li>接入 LiteLLM/OneAPI</li>
                <li>接入 Keycloak 与权限体系</li>
                <li>接入 Langfuse、监控与日志</li>
                <li>建立知识库评测与发布流程</li>
              </ul>
            </div>
            <div className="phase">
              <h3>阶段三：平台增强</h3>
              <p className="badge"><span className="dot"></span> 8-12 周</p>
              <ul>
                <li>引入 LangGraph Runtime</li>
                <li>建设 Tool Server 与审批流</li>
                <li>多模型路由和灰度</li>
                <li>审计中心、成本中心、SLA</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Slide 11: Infrastructure Sizing */}
        <section className={`slide ${index === 10 ? 'active' : ''}`}>
          <div className="kicker">Infrastructure Sizing</div>
          <h2>资源规格建议</h2>
          <table className="matrix">
            <thead>
              <tr><th>规模</th><th>用户与场景</th><th>推荐资源</th><th>模型建议</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>试点</td>
                <td>50-200 人，知识库问答、内部助手、少量 Agent。</td>
                <td>1-2 台 GPU 服务器；Qdrant 单节点；PostgreSQL + MinIO + Redis。</td>
                <td>Qwen 14B/32B，DeepSeek Distill 32B，BGE-M3。</td>
              </tr>
              <tr>
                <td>部门级</td>
                <td>200-1000 人，多部门知识库、多个业务 Agent。</td>
                <td>多 GPU 节点；vLLM 多实例；Qdrant 集群；Langfuse 与监控独立部署。</td>
                <td>Qwen 32B/72B，推理模型独立路由，Reranker 常驻。</td>
              </tr>
              <tr>
                <td>企业级</td>
                <td>1000+ 人，跨系统工具调用，合规审计要求高。</td>
                <td>Kubernetes；Milvus/Qdrant 集群；OpenSearch；多租户网关；高可用数据库。</td>
                <td>多规格模型池，按任务路由，支持灰度与成本控制。</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Slide 12: Operating Model */}
        <section className={`slide ${index === 11 ? 'active' : ''}`}>
          <div className="kicker">Operating Model</div>
          <h2>平台上线后要用"产品化"方式运营</h2>
          <div className="three-col">
            <div className="card">
              <h3>Agent 生命周期</h3>
              <ul>
                <li>需求登记</li>
                <li>Prompt/Workflow 评审</li>
                <li>灰度发布</li>
                <li>版本回滚</li>
              </ul>
            </div>
            <div className="card">
              <h3>知识库生命周期</h3>
              <ul>
                <li>数据源登记</li>
                <li>解析质检</li>
                <li>权限标注</li>
                <li>问答评测</li>
              </ul>
            </div>
            <div className="card">
              <h3>模型生命周期</h3>
              <ul>
                <li>模型准入</li>
                <li>压测评估</li>
                <li>路由策略</li>
                <li>成本与效果复盘</li>
              </ul>
            </div>
          </div>
          <div className="callout">真正的护城河不是"装好了哪些开源软件"，而是知识治理、工具权限、评测体系和持续运营能力。</div>
        </section>

        {/* Slide 13: Final Recommendation */}
        <section className={`slide ${index === 12 ? 'active' : ''}`}>
          <div className="kicker">Final Recommendation</div>
          <h2>最终推荐方案</h2>
          <div className="flow">
            <div className="flow-row"><div className="flow-name">Agent 平台</div><div className="flow-items"><span className="pill">Dify</span><span className="pill">FastGPT 备选</span></div></div>
            <div className="flow-row"><div className="flow-name">复杂编排</div><div className="flow-items"><span className="pill">LangGraph</span><span className="pill">n8n / Tool Server</span></div></div>
            <div className="flow-row"><div className="flow-name">RAG 知识库</div><div className="flow-items"><span className="pill">RAGFlow</span><span className="pill">Qdrant 起步</span><span className="pill">Milvus 扩展</span></div></div>
            <div className="flow-row"><div className="flow-name">模型层</div><div className="flow-items"><span className="pill">vLLM</span><span className="pill">Xinference</span><span className="pill">Ollama</span><span className="pill">Qwen / DeepSeek</span></div></div>
            <div className="flow-row"><div className="flow-name">治理层</div><div className="flow-items"><span className="pill">LiteLLM / OneAPI</span><span className="pill">Langfuse</span><span className="pill">Keycloak</span><span className="pill">Prometheus</span><span className="pill">OpenSearch</span></div></div>
          </div>
          <div className="callout">建议先用 Dify + vLLM + RAGFlow + Qdrant 跑通业务闭环，再补齐模型网关、观测审计、复杂 Agent Runtime 和企业权限治理。</div>
        </section>

        {/* Slide 14: References */}
        <section className={`slide ${index === 13 ? 'active' : ''}`}>
          <div className="kicker">References</div>
          <h2>参考资料与后续验证点</h2>
          <div className="source-list">
            <a href="https://docs.dify.ai/en" target="_blank" rel="noopener noreferrer">Dify Docs：Agentic Workflow、RAG、工具与观测</a>
            <a href="https://github.com/infiniflow/ragflow" target="_blank" rel="noopener noreferrer">RAGFlow：开源 RAG 引擎与文档理解</a>
            <a href="https://docs.vllm.ai/en/stable/" target="_blank" rel="noopener noreferrer">vLLM Docs：高性能 LLM 推理服务</a>
            <a href="https://inference.readthedocs.io/en/stable/" target="_blank" rel="noopener noreferrer">Xinference Docs：统一模型服务平台</a>
            <a href="https://docs.ollama.com/" target="_blank" rel="noopener noreferrer">Ollama Docs：本地模型运行与 API</a>
            <a href="https://www.langchain.com/langgraph" target="_blank" rel="noopener noreferrer">LangGraph：可控 Agent 编排框架</a>
            <a href="https://langfuse.com/docs" target="_blank" rel="noopener noreferrer">Langfuse Docs：LLM Observability 与评测</a>
            <a href="https://www.litellm.ai/" target="_blank" rel="noopener noreferrer">LiteLLM：统一模型网关与 OpenAI API 兼容</a>
          </div>
          <div className="callout">下一步建议：选 2 个真实业务场景做试点，例如"制度知识库问答"和"运维工单 Agent"，用真实文档、真实权限和真实评测集验证架构。</div>
        </section>
      </main>

      <nav className="controls" aria-label="幻灯片控制">
        <button onClick={() => show(index - 1)} aria-label="上一页">‹</button>
        <div className="counter">{index + 1} / 14</div>
        <button onClick={() => show(index + 1)} aria-label="下一页">›</button>
      </nav>
    </>
  )
}