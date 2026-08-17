# Feature Specification: OryxOS Website Visual Prototype

**Feature Branch**: `002-oryxos-website`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Create a completely new OryxOS website visual prototype for the k-oryxos project. Do not read or reuse the retired .website.bak site. Prioritize page presentation, layout, responsive behavior, bilingual navigation, and an original light enterprise visual direction. Content may remain provisional when clearly labeled, and this feature must not publish the prototype to a public website."

## Clarifications

### Session 2026-08-14

- Q: Which Agent definition should the website use as its canonical public concept? → A: One YAML Profile completely defines an Agent. The Profile may declare or reference a Skill, which supplies behavioral instructions and is loaded as prompt context rather than acting as a separately executable Agent component.
- Q: Should this website feature also modify README.md and authoritative project documents to resolve conflicting product claims? → A: No. This feature changes only the new website and records verified documentation conflicts in a follow-up register for a separate feature. Formal publication remains blocked by any unresolved contradiction that would violate Constitution v1.1.0.
- Q: Should the first website release create a new foundational OryxOS brand asset set? → A: Yes. Create an original, restrained logo, English wordmark, favicon, basic social-sharing image, and architecture illustrations that share one visual language; a comprehensive brand system is outside this feature.
- Q: Should the first Documentation prototype remain a concise conceptual set or include dedicated page forms for the full planned runtime surface? → A: Include dedicated page templates for Provider, ReAct Loop, Tool, Memory, Skill/Profile, CLI, and REST API in addition to conceptual and contributor pages. Copy may be provisional, but every provisional page must be visibly labeled and must not present commands, endpoints, or unfinished capabilities as runnable.
- Q: How should deployment behave while this feature remains a visual prototype? → A: Do not deploy the prototype to GitHub Pages or any other public address. Disable automatic Pages publication, validate the `/oryxos/` project base locally and in non-deploying CI, and defer all public deployment to a separate content-and-publication feature.
- Q: How accurate must prototype copy be? → A: Layout copy, headings, summaries, and examples may be provisional to support visual review. Provisional wording must be clearly labeled, must stay conservative about maturity and availability, and must not contradict Constitution-defined concepts or claim that unverified behavior is available.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand OryxOS and Its Current Status (Priority: P1)

A first-time visitor can quickly understand what OryxOS is, how an Agent OS differs from an Agent Runtime or framework, why the project focuses on Java and self-hosting, and what is actually available today. The visitor sees that OryxOS is pre-alpha and that the current focus is the single-node runtime kernel, while distributed collaboration remains a long-term vision.

**Why this priority**: The website is intended to become the public front door of the project. The prototype must first prove that its hierarchy distinguishes current focus from long-term vision.

**Independent Test**: Show only the English home page to a first-time visitor. The visitor can accurately describe the project category, target ecosystem, current maturity, current development focus, and long-term direction without consulting another source.

**Acceptance Scenarios**:

1. **Given** a visitor opens the website for the first time, **When** the home page becomes readable, **Then** the visitor sees the OryxOS value proposition, Java orientation, self-hosted positioning, and a prominent pre-alpha status statement.
2. **Given** a visitor is comparing OryxOS with an Agent framework, **When** the visitor reads the positioning content, **Then** the visitor can identify that frameworks help build an Agent while OryxOS is building the environment in which multiple Agents run.
3. **Given** the prototype mentions distributed Agent collaboration, **When** the visitor reads that statement, **Then** it is described in prose as a long-term direction rather than shown with a real capability-state badge or as currently available.
4. **Given** a capability has not been implemented or verified, **When** it appears on the site, **Then** it is not described as available, production-ready, security-certified, or proven by enterprise adoption.

---

### User Story 2 - Evaluate Architecture and Roadmap (Priority: P2)

A Java developer or enterprise architect can inspect the provisional architecture, module boundaries, design principles, capability-status visual language, known limitations, and staged-roadmap presentation to evaluate the proposed website form.

**Why this priority**: At pre-alpha stage, transparent architecture and a credible roadmap are the project's primary trust signals.

**Independent Test**: Starting from the home page, a visitor reaches the Architecture and Roadmap content, identifies the main runtime concepts and modules, understands the visual definitions of Available, In development, Planned, and Vision, and does not mistake the legend for real capability classification.

**Acceptance Scenarios**:

1. **Given** a visitor wants to understand the system, **When** the visitor opens Architecture, **Then** the page explains that one YAML Profile completely defines an Agent, that the Profile may declare or reference a Skill loaded as behavioral prompt context, and how Provider, ReAct Loop, Tool, Memory, Channel, Storage, Web/API, and the Java module boundaries fit into the provisional architecture without claiming unfinished behavior is operational.
2. **Given** a visitor wants to assess the proposed information hierarchy, **When** the visitor opens Roadmap, **Then** the page separates provisional horizons for current foundations, active runtime-kernel work, later enterprise hardening, and the distributed Agent OS long-term direction without real capability-state badges.
3. **Given** a visitor is on any core page, **When** the visitor uses the primary navigation, **Then** Architecture and Roadmap are each reachable within no more than two navigation actions.
4. **Given** project documentation and source code disagree about a capability, **When** the capability appears in the prototype, **Then** the page uses neutral draft wording instead of assigning an unverified availability state.
5. **Given** an existing repository document conflicts with the intended final website copy, **When** this prototype is reviewed, **Then** the conflict is recorded for a separate content-alignment feature and the prototype uses neutral or clearly provisional wording.
6. **Given** the prototype is merged into the main branch, **When** repository workflows run, **Then** no GitHub Pages deployment is started automatically or manually by this feature.
7. **Given** the team needs to validate the GitHub Pages project-path shape, **When** the production build is served locally, **Then** all required routes and assets work below `/oryxos/` without uploading the build to a public address.

---

### User Story 3 - Browse Equivalent English and Chinese Content (Priority: P2)

An English-speaking or Chinese-speaking visitor can browse the same core website journeys in the preferred language. English is the default site language, Chinese is available under `/zh/`, and switching language keeps the visitor on the equivalent page whenever that page exists.

**Why this priority**: OryxOS aims to participate in the global open-source ecosystem while retaining accessibility for its Chinese-speaking community. Core product meaning must not diverge across languages.

**Independent Test**: Review every core English page and its Chinese counterpart, switch languages from each page, and confirm that product status, capability labels, calls to action, and roadmap meaning remain equivalent.

**Acceptance Scenarios**:

1. **Given** a visitor opens the root website address, **When** no language-specific path is selected, **Then** the English site is shown.
2. **Given** a visitor chooses Chinese, **When** an equivalent Chinese page exists, **Then** the visitor reaches that page under `/zh/` rather than being sent to an unrelated landing page.
3. **Given** a core statement is updated in one language, **When** the change is prepared for prototype review, **Then** the equivalent core statement in the other language is reviewed and updated in the same feature.
4. **Given** a translation is unexpectedly unavailable, **When** a visitor attempts to switch languages, **Then** the site presents a clear fallback instead of silently displaying semantically different content.

---

### User Story 4 - Learn and Join the Project (Priority: P3)

A developer can inspect complete visual page forms for conceptual documentation, build-from-source guidance, project governance, license information, and contribution channels. The page hierarchy and interaction are reviewable even where final copy is deferred.

**Why this priority**: The prototype should demonstrate how a future website can convert interest into informed participation without promising unavailable product workflows.

**Independent Test**: A reviewer can move from the home page to documentation and community content, inspect every required page form in both languages, identify provisional-copy labels, and verify that no unavailable command or API is presented as runnable.

**Acceptance Scenarios**:

1. **Given** a reviewer opens the documentation area, **When** the reviewer inspects the prototype, **Then** it includes page forms for project concepts, Java rationale, architecture, design principles, current status, build from source, contributing, Provider, ReAct Loop, Tool, Memory, Skill/Profile, CLI, and REST API.
2. **Given** a CLI command, REST endpoint, MCP integration, or runtime workflow has not been verified, **When** its prototype page is displayed, **Then** the page is visibly labeled as provisional and contains no runnable command, endpoint, or availability claim.
3. **Given** a visitor wants to participate, **When** the visitor opens Community, **Then** the visitor can find the project repository, issue or discussion destinations, license, governance information, and the relationship to oryx-labs.
4. **Given** the Apache Software Foundation is mentioned, **When** the visitor reads the statement, **Then** it is clearly presented as a long-term aspiration and not as current affiliation or endorsement.

### Edge Cases

- A reviewer enters a deep English or Chinese URL directly under the locally simulated GitHub Pages project path.
- A visitor browses with JavaScript delayed or disabled and still needs access to the core static content.
- A page contains a long module name, code sample, table, or URL on a narrow mobile viewport.
- A keyboard-only visitor opens and closes navigation, changes locale, and follows calls to action.
- A visitor uses reduced-motion preferences or high browser zoom.
- An English page and its Chinese counterpart temporarily differ during editing.
- A required image, internal link, or target section is renamed or removed.
- An external GitHub destination is unavailable or changed.
- README, Roadmap, documentation, and source code contain conflicting maturity or capability claims.
- The site is served below the `/oryxos/` project path instead of the domain root.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The website MUST identify OryxOS as an open, self-hosted Agent OS foundation oriented toward Java teams.
- **FR-002**: The home page MUST prominently identify the project as pre-alpha and state that the current focus is the single-node runtime kernel.
- **FR-003**: The prototype MUST demonstrate a clearly explained visual legend using the exact capability states **Available**, **In development**, **Planned**, and **Vision**. This Feature MUST NOT assign any of these states to a real capability; real capability classification is deferred to the content-and-publication Feature.
- **FR-004**: The home page MUST explain the difference between an Agent Runtime or framework and an Agent OS in language understandable without reading the technical design documents.
- **FR-005**: The first release MUST provide core destinations for Home, Architecture, Roadmap, Documentation, and Community.
- **FR-006**: The primary navigation MUST provide predictable access to all core destinations and the official source repository.
- **FR-007**: English MUST be the default language at the site root, and Chinese core content MUST be available under `/zh/`.
- **FR-008**: Every core English page MUST have a Chinese counterpart with equivalent product meaning, capability state, primary actions, and roadmap intent.
- **FR-009**: A language switcher MUST navigate to the equivalent page when available and MUST provide a clear fallback when equivalence cannot be established.
- **FR-010**: All pages, navigation destinations, static resources, and direct-entry links MUST work when the production build is previewed below the future `/oryxos/` GitHub Pages project path.
- **FR-011**: The visual system MUST use a light, restrained enterprise-technology direction with strong readability, consistent hierarchy, and an original OryxOS identity created for this new website.
- **FR-012**: The first release MUST include an original OryxOS logo, English wordmark, favicon, basic social-sharing image, and architecture illustrations using a consistent visual language. These assets MUST be newly created for this website and MUST NOT reproduce assets from the retired site.
- **FR-013**: The site MUST adapt to mobile, tablet, and desktop viewports without hiding essential content or producing unintended horizontal overflow.
- **FR-014**: All primary journeys MUST be operable by keyboard, with visible focus states and logical focus order.
- **FR-015**: Text and essential controls MUST meet WCAG 2.2 AA contrast requirements; informative images MUST have meaningful alternative text, and decorative images MUST be ignored by assistive technology.
- **FR-016**: Every prototype page MUST provide a unique, descriptive title, a concise description, and basic social-sharing metadata appropriate to its language.
- **FR-017**: The production-preview build MUST contain no broken internal links, missing required assets, or navigation targets that resolve outside the intended locale without explanation.
- **FR-018**: Architecture content MUST state that one YAML Profile completely defines an Agent. The Profile MAY declare or reference a Skill that supplies behavioral instructions and is loaded as prompt context. The same page MUST present the remaining runtime concepts and Java module boundaries as provisional architecture content without claiming unfinished behavior is operational.
- **FR-019**: Roadmap content MUST expose provisional visual horizons for current foundations, active runtime-kernel work, later enterprise-hardening goals, the distributed long-term direction, and known limitations without assigning a real capability-state badge.
- **FR-020**: The prototype MUST provide an entry page and dedicated English and Chinese page forms for What is OryxOS, Why Java, Design Principles, Project Status, Build from Source, Contributing, Provider, ReAct Loop, Tool, Memory, Skill/Profile, CLI, and REST API.
- **FR-021**: Every prototype page MUST display a visible **Draft visual prototype** notice that makes clear its copy is provisional and not public documentation. Every documentation page MUST additionally use a consistent visual structure for overview, intended design, status placeholder, limitations placeholder, and related navigation.
- **FR-022**: Prototype copy MAY be approximate for visual evaluation, but it MUST remain conservative about maturity and availability. Unverified commands, APIs, examples, and workflows MUST be omitted or rendered as non-executable labeled placeholders; they MUST NOT be presented as working interfaces.
- **FR-023**: The site MUST link to the official repository, license, and approved contribution destinations, and MUST label external destinations clearly.
- **FR-024**: The site MUST remain fully usable for its core informational journeys without an OryxOS Runtime instance, account system, database, online Agent demo, or private API access.
- **FR-025**: The public site MUST NOT contain secrets, private credentials, personal data, internal network addresses, or unapproved analytics and tracking scripts.
- **FR-026**: The site MUST NOT directly invoke internal Agent execution, Tool, Memory, or Profile-management capabilities.
- **FR-027**: This feature MUST NOT modify `README.md` or existing authoritative project documents. It MUST maintain a follow-up discrepancy register covering product positioning, maturity, versions, build instructions, capability status, and broken website-related references that require resolution before final content publication.
- **FR-028**: The prototype MUST NOT be published to a public address. A later content-and-publication feature MUST resolve or explicitly validate blocking discrepancies before enabling public deployment.
- **FR-029**: New website content, components, visual assets, and information architecture MUST be created from scratch and MUST NOT read, copy, adapt, or depend on `.website.bak`.
- **FR-030**: The prototype MUST present any relationship to oryx-labs accurately and MUST describe any Apache Software Foundation goal only as a future aspiration.
- **FR-031**: The website MUST provide a clear not-found experience that helps visitors return to a valid core destination in the active language.
- **FR-032**: This feature MUST disable automatic GitHub Pages publication and MUST NOT provide a manual public deployment path. CI MAY build and upload a non-Pages artifact for review, but it MUST NOT use Pages write permissions or `actions/deploy-pages`.
- **FR-033**: Completion of this prototype MUST require a locked Chromium local visual review confirming build results, route integrity, responsive presentation, bilingual navigation, accessibility basics, provisional-copy labeling, and known discrepancy records. Firefox is not required for this visual-prototype approval. Public release review is deferred to a later feature.

### Key Entities

- **Locale**: A supported language context with a route prefix, language label, metadata defaults, navigation labels, and links to equivalent pages.
- **Core Page**: A prototype destination identified by purpose, locale, title, description, primary journey, content status, and equivalent page in the other locale.
- **Documentation Topic**: A localized subject page form with a visible draft notice, required prototype sections, related navigation, and an equivalent page in the other locale.
- **Agent Definition**: The Constitution-aligned concept in which one YAML Profile completely defines an Agent and may declare or reference a Skill loaded as behavioral prompt context.
- **Capability Legend Item**: One of the four required state labels shown as a visual-design example without assigning an unverified state to a real capability.
- **Roadmap Stage**: A provisional visual horizon containing goals and limitations without implying an approved date or delivery commitment.
- **Navigation Entry**: A labeled route or external destination with locale behavior, keyboard behavior, and a defined position in primary or secondary navigation.
- **Prototype Page Template**: A reusable documentation-page form defining the draft notice and required placeholder sections.
- **Documentation Discrepancy**: A recorded final-content conflict with its affected prototype routes, safe prototype handling, public-deployment impact, and follow-up action.
- **Brand Asset**: An original logo, English wordmark, favicon, social-sharing image, diagram, or illustration with purpose, language dependency where applicable, visual relationship to the foundational asset set, and accessibility treatment.
- **Site Recovery Artifact**: The shared bilingual `404.html` output with root-language document metadata, SSR-rendered recovery options for both locales, and optional retained-path prioritization.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A recorded internal visual review confirms that the English home page visibly presents all five positioning cues: Java-oriented, self-hosted, Agent OS foundation, pre-alpha, and current single-node runtime-kernel focus.
- **SC-002**: 100% of Home, Architecture, Roadmap, Documentation, and Community pages are available in both English and Chinese with equivalent capability-legend meaning, provisional horizons, and primary actions.
- **SC-003**: 100% of prototype pages visibly include the localized Draft visual prototype notice, and 100% of required conceptual and runtime topics have English and Chinese page forms with the agreed content-section skeleton.
- **SC-004**: A visitor can reach Architecture, Roadmap, Documentation, Community, and the source repository from any core page in no more than two navigation actions.
- **SC-005**: 100% of primary navigation, locale switching, and primary calls to action can be completed using only a keyboard with a visible focus indicator.
- **SC-006**: Automated and manual prototype checks find zero broken internal links, zero missing required assets, and zero core-page routes that fail under the `/oryxos/` project path.
- **SC-007**: Core pages display without unintended horizontal overflow at viewport widths from 320 through 1440 CSS pixels and remain understandable at 200% browser zoom.
- **SC-008**: 100% of prototype pages have a unique localized title, localized description, and basic social-sharing metadata; 100% of informative images have appropriate alternative text.
- **SC-009**: The logo, wordmark, favicon, social-sharing image, and architecture illustrations are present, remain identifiable at their intended display sizes, and pass a review confirming that they are original and visually consistent.
- **SC-010**: A clean checkout can produce the complete static site and serve every core journey without starting any OryxOS Runtime service or providing private credentials.
- **SC-011**: A prototype review finds zero unverified commands or endpoints presented as runnable, zero unfinished capabilities presented as Available, and a follow-up discrepancy entry for every identified final-content conflict outside this feature.
- **SC-012**: All official repository, license, issue, discussion, and community links used by the prototype are reviewed and valid at prototype review time.
- **SC-013**: Merging website changes starts zero automatic or manual Pages deployments from this feature, while the production build can be served locally with all required routes working below `/oryxos/`.

## Assumptions

- OryxOS remains pre-alpha, and this feature optimizes for evaluating visual presentation, information architecture, responsive behavior, and bilingual navigation rather than final public content.
- English is served from the site root, Chinese is served under `/zh/`, and both languages cover the same five core destinations.
- The future deployment target remains the GitHub Pages project path `/oryxos/`, but this feature validates that path only through local production preview and non-deploying CI.
- The website is informational and static. Account management, dynamic content management, online Agent execution, analytics, and runtime administration are outside this feature.
- The current source tree and released artifacts are authoritative for implementation status. Product and design documents remain useful for intent and architecture only when they do not contradict verifiable behavior.
- The prototype includes dedicated page forms for CLI, REST API, Provider, ReAct Loop, Tool, Memory, Skill/Profile, and related planned surfaces. It omits runnable commands and endpoints until they are verified in a later content Feature.
- The canonical concept states that one YAML Profile completely defines an Agent. The Profile may declare or reference a Skill loaded as behavioral prompt context.
- The foundational asset set is intentionally limited to the assets needed by the first website release; typography licensing, downloadable brand kits, extensive usage rules, and a comprehensive brand manual are outside this feature.
- This feature does not edit `README.md` or existing authoritative project documents. A separate documentation feature will resolve the discrepancy register before any contradictory claims are formally published.
- The existing Pages workflow is revised within this Feature to remove all public deployment behavior. A later content-and-publication Feature may introduce an approved protected deployment design.
- Existing deletions under the tracked `website/` path represent retirement of the old site. The new site will replace that path later during implementation without restoring retired content.
- `.website.bak` is intentionally excluded from all research, specification, planning, implementation, and review activities.
