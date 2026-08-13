# Feature Specification: New OryxOS Website

**Feature Branch**: `002-oryxos-website`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Create a completely new official OryxOS website for the k-oryxos project. Do not read or reuse the retired .website.bak site. Present OryxOS honestly as a pre-alpha, Java-oriented, self-hosted Agent OS foundation; use English at the root, Chinese under /zh/, deploy as a GitHub Pages project site, and use a light enterprise visual direction."

## Clarifications

### Session 2026-08-14

- Q: Which Agent definition should the website use as its canonical public concept? → A: Skill defines what an Agent does, Profile defines how it runs, and Skill + Profile together define an Agent. The YAML Profile remains the authoritative runtime configuration entry and declares or references the selected Skill.
- Q: Should this website feature also modify README.md and authoritative project documents to resolve conflicting product claims? → A: No. This feature changes only the new website and records verified documentation conflicts in a follow-up register for a separate feature. Formal publication remains blocked by any unresolved contradiction that would violate Constitution v1.1.0.
- Q: Should the first website release create a new foundational OryxOS brand asset set? → A: Yes. Create an original, restrained logo, English wordmark, favicon, basic social-sharing image, and architecture illustrations that share one visual language; a comprehensive brand system is outside this feature.
- Q: Should the first Documentation release remain a concise conceptual set or include dedicated pages for the full planned runtime surface? → A: Include dedicated pages for Provider, ReAct Loop, Tool, Memory, Skill/Profile, CLI, and REST API in addition to the conceptual and contributor pages. Each page must separate verified current behavior from target design and limitations; incomplete capabilities must not be presented as runnable.
- Q: How should GitHub Pages deployment behave before a separate documentation feature resolves blocking claim discrepancies? → A: Permit only manually triggered validation deployments and disable automatic publication from the main branch. A release review is required before every manual deployment because the resulting Pages address may be publicly accessible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand OryxOS and Its Current Status (Priority: P1)

A first-time visitor can quickly understand what OryxOS is, how an Agent OS differs from an Agent Runtime or framework, why the project focuses on Java and self-hosting, and what is actually available today. The visitor sees that OryxOS is pre-alpha and that the current focus is the single-node runtime kernel, while distributed collaboration remains a long-term vision.

**Why this priority**: The website is the public front door of the project. If visitors cannot distinguish the current product from its long-term vision, every later architecture, roadmap, and community message becomes misleading.

**Independent Test**: Show only the English home page to a first-time visitor. The visitor can accurately describe the project category, target ecosystem, current maturity, current development focus, and long-term direction without consulting another source.

**Acceptance Scenarios**:

1. **Given** a visitor opens the website for the first time, **When** the home page becomes readable, **Then** the visitor sees the OryxOS value proposition, Java orientation, self-hosted positioning, and a prominent pre-alpha status statement.
2. **Given** a visitor is comparing OryxOS with an Agent framework, **When** the visitor reads the positioning content, **Then** the visitor can identify that frameworks help build an Agent while OryxOS is building the environment in which multiple Agents run.
3. **Given** the site mentions distributed Agent collaboration, **When** the visitor reads that statement, **Then** it is labeled as a vision rather than a currently available capability.
4. **Given** a capability has not been implemented or verified, **When** it appears on the site, **Then** it is not described as available, production-ready, security-certified, or proven by enterprise adoption.

---

### User Story 2 - Evaluate Architecture and Roadmap (Priority: P2)

A Java developer or enterprise architect can inspect the conceptual architecture, module boundaries, design principles, capability status, known limitations, and staged roadmap to decide whether to follow, evaluate, or contribute to the project.

**Why this priority**: At pre-alpha stage, transparent architecture and a credible roadmap are the project's primary trust signals.

**Independent Test**: Starting from the home page, a visitor reaches the Architecture and Roadmap content, identifies the main runtime concepts and modules, and distinguishes Available, In development, Planned, and Vision capabilities.

**Acceptance Scenarios**:

1. **Given** a visitor wants to understand the system, **When** the visitor opens Architecture, **Then** the page explains that Skill defines what an Agent does, Profile defines how it runs, and the two work together with Provider, ReAct Loop, Tool, Memory, Channel, Storage, Web/API, and the Java module boundaries without claiming unfinished behavior is operational.
2. **Given** a visitor wants to assess delivery risk, **When** the visitor opens Roadmap, **Then** the page separates current foundations, active runtime-kernel work, later enterprise hardening, and the distributed Agent OS vision.
3. **Given** a visitor is on any core page, **When** the visitor uses the primary navigation, **Then** Architecture and Roadmap are each reachable within no more than two navigation actions.
4. **Given** project documentation and source code disagree about a capability, **When** the capability status is published, **Then** the verifiable source code and released artifacts determine the displayed status.
5. **Given** an existing repository document still contradicts a verified website claim, **When** this feature reaches release review, **Then** the conflict is recorded for a separate documentation feature and the contradictory claim is not formally published until reconciliation is complete.
6. **Given** blocking documentation discrepancies remain unresolved, **When** a change is merged into the main branch, **Then** no automatic GitHub Pages deployment is started.
7. **Given** the team needs to validate the real GitHub Pages project path, **When** an authorized maintainer approves release review and manually starts deployment, **Then** the site is deployed for validation with the unresolved-discrepancy status recorded.

---

### User Story 3 - Browse Equivalent English and Chinese Content (Priority: P2)

An English-speaking or Chinese-speaking visitor can browse the same core website journeys in the preferred language. English is the default site language, Chinese is available under `/zh/`, and switching language keeps the visitor on the equivalent page whenever that page exists.

**Why this priority**: OryxOS aims to participate in the global open-source ecosystem while retaining accessibility for its Chinese-speaking community. Core product meaning must not diverge across languages.

**Independent Test**: Review every core English page and its Chinese counterpart, switch languages from each page, and confirm that product status, capability labels, calls to action, and roadmap meaning remain equivalent.

**Acceptance Scenarios**:

1. **Given** a visitor opens the root website address, **When** no language-specific path is selected, **Then** the English site is shown.
2. **Given** a visitor chooses Chinese, **When** an equivalent Chinese page exists, **Then** the visitor reaches that page under `/zh/` rather than being sent to an unrelated landing page.
3. **Given** a core statement is updated in one language, **When** the change is prepared for publication, **Then** the equivalent core statement in the other language is reviewed and updated in the same feature.
4. **Given** a translation is unexpectedly unavailable, **When** a visitor attempts to switch languages, **Then** the site presents a clear fallback instead of silently displaying semantically different content.

---

### User Story 4 - Learn and Join the Project (Priority: P3)

A developer can find trustworthy conceptual documentation, build-from-source guidance that matches the repository, project governance, license information, and clear links to the source repository and contribution channels.

**Why this priority**: The first website release should convert interest into informed participation rather than promise unavailable product workflows.

**Independent Test**: A visitor can move from the home page to documentation and community content, identify how to inspect or build the current source, understand the Apache 2.0 license, and reach the official project contribution destinations.

**Acceptance Scenarios**:

1. **Given** a visitor opens the documentation area, **When** the visitor reviews the first-release content, **Then** it includes project concepts, Java rationale, architecture, design principles, current status, verified source-build guidance, contribution guidance, and dedicated pages for Provider, ReAct Loop, Tool, Memory, Skill/Profile, CLI, and REST API.
2. **Given** a CLI command, REST endpoint, MCP integration, or runtime workflow is not currently usable, **When** its dedicated documentation page is published, **Then** the page separates verified current behavior, target design, publication state, and known limitations and does not present the unavailable workflow as runnable.
3. **Given** a visitor wants to participate, **When** the visitor opens Community, **Then** the visitor can find the project repository, issue or discussion destinations, license, governance information, and the relationship to oryx-labs.
4. **Given** the Apache Software Foundation is mentioned, **When** the visitor reads the statement, **Then** it is clearly presented as a long-term aspiration and not as current affiliation or endorsement.

### Edge Cases

- A visitor enters a deep English or Chinese URL directly under the GitHub Pages project path.
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
- **FR-003**: The website MUST distinguish current delivery from long-term ambition by using the exact capability states **Available**, **In development**, **Planned**, and **Vision**.
- **FR-004**: The home page MUST explain the difference between an Agent Runtime or framework and an Agent OS in language understandable without reading the technical design documents.
- **FR-005**: The first release MUST provide core destinations for Home, Architecture, Roadmap, Documentation, and Community.
- **FR-006**: The primary navigation MUST provide predictable access to all core destinations and the official source repository.
- **FR-007**: English MUST be the default language at the site root, and Chinese core content MUST be available under `/zh/`.
- **FR-008**: Every core English page MUST have a Chinese counterpart with equivalent product meaning, capability state, primary actions, and roadmap intent.
- **FR-009**: A language switcher MUST navigate to the equivalent page when available and MUST provide a clear fallback when equivalence cannot be established.
- **FR-010**: All pages, navigation destinations, static resources, and direct-entry links MUST work when the website is published below the `/oryxos/` GitHub Pages project path.
- **FR-011**: The visual system MUST use a light, restrained enterprise-technology direction with strong readability, consistent hierarchy, and an original OryxOS identity created for this new website.
- **FR-012**: The first release MUST include an original OryxOS logo, English wordmark, favicon, basic social-sharing image, and architecture illustrations using a consistent visual language. These assets MUST be newly created for this website and MUST NOT reproduce assets from the retired site.
- **FR-013**: The site MUST adapt to mobile, tablet, and desktop viewports without hiding essential content or producing unintended horizontal overflow.
- **FR-014**: All primary journeys MUST be operable by keyboard, with visible focus states and logical focus order.
- **FR-015**: Text and essential controls MUST meet WCAG 2.2 AA contrast requirements; informative images MUST have meaningful alternative text, and decorative images MUST be ignored by assistive technology.
- **FR-016**: Every public page MUST provide a unique, descriptive title, a concise description, and basic social-sharing metadata appropriate to its language.
- **FR-017**: The published site MUST contain no broken internal links, missing required assets, or navigation targets that resolve outside the intended locale without explanation.
- **FR-018**: Architecture content MUST use the canonical public model **Skill + Profile = Agent**: Skill defines what an Agent does, Profile defines how it runs and declares or references the selected Skill, and the YAML Profile remains the authoritative runtime configuration entry. The same content MUST explain the remaining principal runtime concepts and Java module boundaries while clearly identifying unfinished capabilities.
- **FR-019**: Roadmap content MUST expose current foundations, active runtime-kernel work, later enterprise-hardening goals, the distributed vision, and known limitations.
- **FR-020**: Documentation in the first release MUST provide an entry page and dedicated English and Chinese pages for What is OryxOS, Why Java, Design Principles, Project Status, Build from Source, Contributing, Provider, ReAct Loop, Tool, Memory, Skill/Profile, CLI, and REST API.
- **FR-021**: Every documentation page for an incomplete capability MUST visibly distinguish its publication state, verified current behavior, target design, and known limitations. Planned design content MUST NOT be phrased as an available implementation.
- **FR-022**: Runnable commands, APIs, examples, and feature claims MUST match the current repository and released artifacts; unavailable workflows MUST NOT be presented as working quick starts, executable examples, or callable interfaces.
- **FR-023**: The site MUST link to the official repository, license, and approved contribution destinations, and MUST label external destinations clearly.
- **FR-024**: The site MUST remain fully usable for its core informational journeys without an OryxOS Runtime instance, account system, database, online Agent demo, or private API access.
- **FR-025**: The public site MUST NOT contain secrets, private credentials, personal data, internal network addresses, or unapproved analytics and tracking scripts.
- **FR-026**: The site MUST NOT directly invoke internal Agent execution, Tool, Memory, or Profile-management capabilities.
- **FR-027**: This feature MUST NOT modify `README.md` or existing authoritative project documents. It MUST produce a follow-up discrepancy register covering conflicting product positioning, maturity, versions, build instructions, capability status, and broken website-related references found during website research or validation.
- **FR-028**: Formal website publication MUST remain blocked wherever an unresolved discrepancy would cause the website, `README.md`, Roadmap, or authoritative technical documentation to make contradictory factual claims, until a separate documentation feature resolves or explicitly validates that discrepancy.
- **FR-029**: New website content, components, visual assets, and information architecture MUST be created from scratch and MUST NOT read, copy, adapt, or depend on `.website.bak`.
- **FR-030**: The public website MUST present any relationship to oryx-labs accurately and MUST describe any Apache Software Foundation goal only as a future aspiration.
- **FR-031**: The website MUST provide a clear not-found experience that helps visitors return to a valid core destination in the active language.
- **FR-032**: GitHub Pages deployment MUST be manually triggered for this feature and MUST NOT run automatically when changes reach the main branch while blocking documentation discrepancies remain unresolved.
- **FR-033**: Every manual Pages deployment MUST require an explicit release review confirming build results, website claim accuracy, known discrepancy records, and acceptance of the fact that the validation address may be publicly accessible.

### Key Entities

- **Locale**: A supported language context with a route prefix, language label, metadata defaults, navigation labels, and links to equivalent pages.
- **Core Page**: A public destination identified by purpose, locale, title, description, primary journey, capability claims, and equivalent page in the other locale.
- **Documentation Topic**: A localized subject page with an explicit publication state, verified current behavior, target design where applicable, known limitations, related concepts, and an equivalent page in the other locale.
- **Agent Definition**: The canonical public concept in which Skill defines business behavior and instructions, Profile defines runtime choices and declares or references the selected Skill, and both together form the Agent while the Profile remains the authoritative runtime configuration entry.
- **Capability Statement**: A product capability paired with exactly one publication state, supporting evidence, and the page or section where it is explained.
- **Roadmap Stage**: A named delivery horizon containing goals, limitations, and capability statements without implying a release date unless one is formally approved.
- **Navigation Entry**: A labeled route or external destination with locale behavior, keyboard behavior, and a defined position in primary or secondary navigation.
- **Content Source**: A current repository artifact or released deliverable used to validate a public claim, build instruction, version, or architecture statement.
- **Documentation Discrepancy**: A recorded conflict between verified source or release behavior and an existing public-facing repository document, including affected claims, evidence, publication impact, and the required follow-up action.
- **Brand Asset**: An original logo, English wordmark, favicon, social-sharing image, diagram, or illustration with purpose, language dependency where applicable, visual relationship to the foundational asset set, and accessibility treatment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a representative first-visit review, at least 80% of participants can identify within 60 seconds that OryxOS is a Java-oriented, self-hosted Agent OS foundation in pre-alpha with a single-node runtime kernel under development.
- **SC-002**: 100% of Home, Architecture, Roadmap, Documentation, and Community pages are available in both English and Chinese with equivalent capability states and primary actions.
- **SC-003**: 100% of the required conceptual and runtime documentation topics have English and Chinese pages; every incomplete runtime topic visibly includes its state, verified current behavior, target design, and known limitations.
- **SC-004**: A visitor can reach Architecture, Roadmap, Documentation, Community, and the source repository from any core page in no more than two navigation actions.
- **SC-005**: 100% of primary navigation, locale switching, and primary calls to action can be completed using only a keyboard with a visible focus indicator.
- **SC-006**: Automated and manual publication checks find zero broken internal links, zero missing required assets, and zero core-page routes that fail under the `/oryxos/` project path.
- **SC-007**: Core pages display without unintended horizontal overflow at viewport widths from 320 through 1440 CSS pixels and remain understandable at 200% browser zoom.
- **SC-008**: 100% of public pages have a unique localized title, localized description, and basic social-sharing metadata; 100% of informative images have appropriate alternative text.
- **SC-009**: The logo, wordmark, favicon, social-sharing image, and architecture illustrations are present, remain identifiable at their intended display sizes, and pass a review confirming that they are original and visually consistent.
- **SC-010**: A clean checkout can produce the complete static site and serve every core journey without starting any OryxOS Runtime service or providing private credentials.
- **SC-011**: A release review finds zero website claims that contradict the verified source tree or released artifacts, zero unfinished capabilities presented as Available, and a documented follow-up entry for every discovered conflict outside the website scope.
- **SC-012**: All official repository, license, issue, discussion, and community links used by the site are reviewed and valid at publication time.
- **SC-013**: Merging website changes into the main branch starts zero automatic Pages deployments, while an authorized manual run can successfully deploy the validated site under the `/oryxos/` project path after release review.

## Assumptions

- OryxOS remains pre-alpha for this website release, and the first public website optimizes for architectural understanding and contributor trust rather than enterprise sales conversion.
- English is served from the site root, Chinese is served under `/zh/`, and both languages cover the same five core destinations.
- The initial production target is the GitHub Pages project site at `https://oryx-labs.github.io/oryxos/`; no custom domain is required for this feature.
- The website is informational and static. Account management, dynamic content management, online Agent execution, analytics, and runtime administration are outside this feature.
- The current source tree and released artifacts are authoritative for implementation status. Product and design documents remain useful for intent and architecture only when they do not contradict verifiable behavior.
- The first documentation release includes dedicated design-and-status pages for `init`, `chat`, `serve`, business REST endpoints, Provider, ReAct Loop, Tool, Memory, Skill/Profile, and related planned surfaces, but does not promise those capabilities are runnable until they are implemented and verified.
- The canonical public concept is **Skill + Profile = Agent**. This describes the intended conceptual composition; the Profile remains the single authoritative runtime configuration entry and any unfinished Skill-loading behavior must be labeled according to its verified capability state.
- The foundational asset set is intentionally limited to the assets needed by the first website release; typography licensing, downloadable brand kits, extensive usage rules, and a comprehensive brand manual are outside this feature.
- This feature does not edit `README.md` or existing authoritative project documents. A separate documentation feature will resolve the discrepancy register before any contradictory claims are formally published.
- The existing Pages workflow may be revised within this feature only to support manually approved validation deployment and to remove automatic main-branch publication; enabling automatic publication again belongs to the follow-up documentation reconciliation or release feature.
- Existing deletions under the tracked `website/` path represent retirement of the old site. The new site will replace that path later during implementation without restoring retired content.
- `.website.bak` is intentionally excluded from all research, specification, planning, implementation, and review activities.
