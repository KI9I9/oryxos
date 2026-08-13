<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Bump rationale: MINOR — adds repository-wide governance for the independent static website
  without redefining or weakening the existing Runtime principles.
- Core principles preserved without semantic changes (8):
    I.   自实现 ReAct 循环 (NON-NEGOTIABLE)
    II.  Spring AI 仅做协议转换与 Schema 生成 (NON-NEGOTIABLE)
    III. Provider 显式映射
    IV.  SKILL.md 由 ContextLoader 加载，不作为 Tool
    V.   审计 Day One 落库 (NON-NEGOTIABLE)
    VI.  安全是地基：强制沙箱白名单，不用 SecurityManager (NON-NEGOTIABLE)
    VII. 同步执行 + 虚拟线程，不引入异步编程模型
    VIII.配置即 Agent，实例无状态、状态外置
- Added sections:
    - 仓库治理范围
    - 官网内容真实性与安全约束
- Modified sections:
    - 技术栈与架构约束（区分 Runtime 与 Website 技术及构建边界）
    - 开发流程与质量门禁（增加 Website 独立质量门禁）
    - Governance（增加跨子项目合规与文档一致性要求）
- Removed sections: none
- Templates checked:
    ✅ .specify/templates/plan-template.md      (dynamic Constitution Check; no edit needed)
    ✅ .specify/templates/spec-template.md      (generic feature template; no edit needed)
    ✅ .specify/templates/tasks-template.md     (generic task template; no edit needed)
    ✅ .specify/templates/checklist-template.md (generic checklist template; no edit needed)
- Follow-up TODOs: none
-->

# OryxOS Constitution

OryxOS 是面向 Java 生态的分布式 AI Agent OS——运行一群业务 Agent 的企业级底座。本宪法定义
同一仓库内 OryxOS Runtime 与 OryxOS Website 不可违背的工程、内容与治理规则，凌驾于个人偏好
与临时便利之上；所有代码、Spec、Plan 与实现都必须遵守其适用范围内的规则。原则冲突时以本文件
为准。

## Core Principles

### I. 自实现 ReAct 循环 (NON-NEGOTIABLE)

`ReActLoop` MUST 由项目自己实现，完整掌握「思考 → 调工具 → 回填结果 → 再思考」的每一步。
MUST NOT 使用 Spring AI 的 Agent 抽象或 `ChatClient` 的自动工具执行。工具的调度与执行由
`ReActLoop` + `ToolExecutor` 独占控制，循环行为（迭代上限、终止条件、上下文裁剪）必须可定制。

**Rationale**: Agent 的核心竞争力在运行机制本身；把循环交给外部框架会丧失控制权，且会导致
工具被重复调用。

### II. Spring AI 仅做协议转换与 Schema 生成 (NON-NEGOTIABLE)

Spring AI（Alibaba）在 OryxOS 中只允许做两件事：(1) 各家 LLM Provider 的协议差异吸收；
(2) `@Tool` 注解的 JSON Schema 生成。MUST 禁用其自动 tool 执行与 eager 模型自动装配
（如 `DashScopeAutoConfiguration`）。调用方式必须是 `chatModel.call(new Prompt(...))`，
返回的 tool call 由项目自己解析并执行。

**Rationale**: 与原则 I 一致——只借管道，不交控制权；自动装配还会在无 API key 时阻断启动。

### III. Provider 显式映射

多 Provider 并存时 MUST 维护显式的 `provider name → ChatModel` 映射表。MUST NOT 依赖扫描
Spring 容器中的 `ChatModel` Bean 类型来区分 Provider（类型相同会路由错乱）。

**Rationale**: 显式映射是多模型可预测路由的唯一可靠方式。

### IV. SKILL.md 由 ContextLoader 加载，不作为 Tool

`SKILL.md` 是注入 system prompt 的指令模板，MUST 由 `oryxos-core` 的 `ContextLoader` 加载，
与 Bootstrap 文件（`AGENTS.md`、`SOUL.md`、`USER.md`）同类。MUST NOT 注册进 `ToolRegistry`
或放入 `oryxos-tool` 模块。内置 Tool 与 MCP Client MUST 合并在单一 `oryxos-tool` 模块，不拆分。

**Rationale**: Skill 是上下文而非可执行工具；混淆两者会在执行期报错、并让模块依赖混乱。

### V. 审计 Day One 落库 (NON-NEGOTIABLE)

`tool_invocations` 与 `llm_calls` 两张审计表 MUST 从核心阶段起就写入 SQLite（无需查询接口，
但写入不可省）。MUST NOT 以「日志足够」为由跳过落库。

**Rationale**: 可审计是 OryxOS 的核心差异化能力；事后从日志反解析代价高且不可靠。

### VI. 安全是地基：强制沙箱白名单，不用 SecurityManager (NON-NEGOTIABLE)

工具调用 MUST 经 `SandboxChecker` 白名单校验：文件走路径白名单、Shell 走命令首 token 白名单、
HTTP 走域名通配白名单。MUST NOT 使用 `SecurityManager`（JDK 21 已不可用）。凭证 MUST 走
环境变量 / 企业密钥体系，MUST NOT 明文写入代码、配置、日志或提交历史。最小权限、来源受控、
全链路可审计从第一天就在架构里，不是补丁。

**Rationale**: 企业私有部署对安全零容忍；安全若非地基，后期无法补齐。

### VII. 同步执行 + 虚拟线程，不引入异步编程模型

核心阶段 MUST 全程同步阻塞，靠 Java 21 虚拟线程处理并发。MUST NOT 引入 Reactor / WebFlux /
`CompletableFuture` 等异步编程模型（SSE 流式等留待扩展阶段，且不得侵入核心循环）。

**Rationale**: 虚拟线程已让同步代码扛住高并发；异步会让复杂度激增、调试困难。

### VIII. 配置即 Agent，实例无状态、状态外置

一个 Agent MUST 完全由一份 YAML Profile 定义，不需要写代码。运行实例 MUST 无状态，会话与
记忆等状态 MUST 外置（SQLite / 文件），为走向分布式预留路径。表结构变更 MUST NOT 依赖
Hibernate 自动迁移（SQLite `ALTER TABLE` 支持弱），需手工建表脚本或 Flyway。

**Rationale**: 「配置即 Agent」降低接入门槛；「状态外置」是未来分布式化不大改设计的前提。

## 仓库治理范围

本仓库包含两类具有独立技术边界的子项目：

- **OryxOS Runtime**：根目录下全部 `oryxos-*` Java 模块。上述八项 Core Principles 直接治理
  Runtime；任何 Website 需求或实现 MUST NOT 改变、绕过或侵入这些原则。
- **OryxOS Website**：`website/` 下的公开官网与开发者文档站点。Website MUST 遵守本宪法的
  独立构建、内容真实性、质量、可访问性和安全约束，但不受仅适用于 Runtime 内部实现的 Java
  架构细节约束。

跨越两类子项目的特性 MUST 在 Spec 与 Plan 中分别标明影响范围、验证命令和交付物。Website
不得成为 Runtime 的隐式构建依赖，Runtime 也不得成为浏览 Website 基础静态内容的运行时依赖。

## 技术栈与架构约束

### OryxOS Runtime

- 语言 / 运行时 MUST 为 Java 21（虚拟线程），框架 MUST 为 Spring Boot 3.x，构建 MUST 使用仓库
  提交的 Maven Wrapper 与 Maven 多模块结构。
- Runtime HTTP MUST 使用 Spring MVC + 虚拟线程；持久化 MUST 使用 SQLite + Spring Data JPA；
  日志 MUST 使用 Logback + SLF4J，生产环境使用 JSON 结构化日志并禁用 `System.out`。
- Runtime 以单可执行 fat JAR 交付，可部署到企业自有 K8s、虚拟机或物理机，不锁定云厂商。
- 开放标准优先：工具用 MCP、Agent 协作用 A2A、技能用 `SKILL.md`，不得无必要另立协议。
- 模块必须解耦：新增 Channel 或 Tool 只增加新模块，不得为此修改 `oryxos-core`。
- 底座优先于 Agent：最重要的交付是让任意 Agent 可靠运行的环境，而非某个强大的 Agent。

### OryxOS Website

- `website/` MUST 是独立的纯静态网站子项目，技术基线为 Node.js 24 LTS、npm、VitePress、Vue 3
  与 TypeScript，并 MUST 提交 `package-lock.json`。
- Node.js 版本 MUST 通过仓库配置与 CI 固定。依赖安装 MUST 使用 `npm ci`，不得以无法复现的
  全局依赖作为构建前提。
- Website MUST 输出可独立托管的静态文件。未经新的 Feature Spec 和 Constitution 合规审查，
  MUST NOT 引入服务端运行时、动态 CMS、数据库、登录系统或用户数据存储。
- 视觉风格、页面结构、语言路径、静态站点 `base` 与具体部署地址属于 Feature Spec 或 Plan，
  MUST NOT 作为长期技术偏好固化进本宪法。

### 独立构建与部署边界

- Runtime MUST 使用 `./mvnw verify` 完成构建与质量验证；Website MUST 使用 `npm ci` 与
  `npm run docs:build` 完成可复现安装和静态构建。
- `website/` MUST NOT 加入根 Maven modules，Maven 构建 MUST NOT 执行 Node 前端构建，Website
  构建产物 MUST NOT 打包进 Spring Boot JAR。
- 仅修改 Website 时 MUST NOT 要求重新打包 Runtime；仅修改 Runtime 时 MUST NOT 要求开发者
  安装 Node.js，除非同一变更明确同时影响 Website。
- Website 的基础内容 MUST 能在 OryxOS Runtime 未启动时完整浏览、构建与部署。

## 官网内容真实性与安全约束

### 内容真实性

- Website 的产品声明 MUST 以当前源码、自动化验证结果与正式发布物为事实依据，并明确区分
  **Available**、**In development**、**Planned** 与 **Vision** 四种状态。
- 尚未实现或未经验证的能力 MUST NOT 描述为已经可用、生产就绪、安全认证完成或已被企业采用。
- “Distributed AI Agent OS”可作为长期愿景；当当前版本仅具备单节点能力时，Website MUST 在
  显著位置说明实际开发阶段。
- `README.md`、Website、Roadmap 与权威技术文档中的产品定位、能力状态、版本、启动方式和接口
  说明 MUST 保持一致。发生冲突时 MUST 以可验证的源码和发布物为准，并建立明确的文档同步任务。

### 安全与数据边界

- Website 与其仓库内容 MUST NOT 包含 API Key、Access Token、私有凭证、用户隐私数据、内部
  网络地址或未经批准的遥测与用户追踪脚本。
- 公开 Website MUST NOT 直接暴露或调用具有 Agent 执行、Tool 调用、Memory 访问或 Profile 管理
  能力的内部 OryxOS API。
- 在线 Demo 如需引入，MUST 先通过独立 Feature Spec 定义隔离、认证、限流、数据处理与清理边界，
  并完成 Constitution 合规审查后方可实现。

## 开发流程与质量门禁

- Runtime 与 Website 均采用 Spec-Driven Development：constitution → specify → clarify → plan →
  tasks → analyze → implement。一次只推进一个活跃特性。
- 每个 Runtime 特性一份 Profile 化的最小完备实现；分阶段克制：先做运行时内核最小完备集，
  治理与重型分布式基础设施待真实使用数据验证后再做。
- Runtime 质量门禁 MUST 全绿方可合并：Spotless（Google 格式）+ 阿里 P3C 编码规约 +
  Checkstyle + SpotBugs/Find Security Bugs + OWASP Dependency-Check，全部接入 `./mvnw verify`。
- Website 变更 MUST 至少通过 `npm ci` 与 `npm run docs:build`，并验证不存在失效的必需静态资源
  和内部链接。
- Website 的英文与中文核心页面 MUST 保持语义一致；主要导航 MUST 可使用键盘完成且焦点状态
  清晰可见；文本与关键控件 MUST 满足 WCAG 2.2 AA 对比度要求；移动端 MUST NOT 出现非预期
  横向溢出。
- Website 图片 MUST 提供合理替代文本，纯装饰图片 MUST 被辅助技术忽略；每个公开页面 MUST
  提供明确标题、描述与基本社交分享元数据。
- Runtime CI 跑 `./mvnw verify`，Website CI 跑其独立静态构建和质量检查；任一适用门禁失败都
  MUST 阻断对应变更合并。
- Runtime 敏感配置一律 `${ENV_VAR}` 占位，`ConfigLoader` 启动校验必填项，缺失即清晰报错，
  不得静默失败。

## Governance

- 本宪法凌驾于其它一切实践之上；与个人偏好或临时便利冲突时，以本宪法为准。
- 修订流程：任何原则的新增 / 删除 / 重定义 MUST 通过 PR 提出，说明动机与影响，并同步更新受影响
  的模板（plan / spec / tasks）、Runtime 指南和 Website 指南。
- 版本策略（语义化）：MAJOR = 不兼容的治理 / 原则删除或重定义；MINOR = 新增原则或实质性扩充；
  PATCH = 澄清、措辞、笔误等非语义调整。
- 合规审查：所有 PR 与代码评审 MUST 验证是否符合本宪法；违背原则的复杂度 MUST 显式论证，否则
  优先选择更简单、更符合原则的方案。
- 跨子项目变更 MUST 分别验证 Runtime 与 Website 的适用门禁，并在 Spec、Plan 与 Tasks 中明确
  文档同步责任；不得以一个子项目构建成功代替另一个子项目的合规证明。
- 运行时开发指南以 `CLAUDE.md` 为准，其内容 MUST 与本宪法保持一致。

**Version**: 1.1.0 | **Ratified**: 2026-07-01 | **Last Amended**: 2026-08-14
