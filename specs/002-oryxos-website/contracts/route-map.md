# Route Map Contract

## Public base

- Deployment origin: `https://oryx-labs.github.io`
- VitePress base: `/oryxos/`
- English is the root locale.
- Simplified Chinese uses `/zh/`.
- Internal Markdown and theme routes omit `/oryxos/`; VitePress or `withBase()` applies it.
- Leaf pages use clean URLs without `.html`; directory indexes retain their trailing slash.

## Required routes

Every required Page ID has exactly one English and one Chinese source page.

| Page ID | Kind | English route | Chinese route | Source pattern |
|---|---|---|---|---|
| `home` | core | `/` | `/zh/` | `index.md`, `zh/index.md` |
| `architecture` | core | `/architecture` | `/zh/architecture` | `architecture.md`, `zh/architecture.md` |
| `roadmap` | core | `/roadmap` | `/zh/roadmap` | `roadmap.md`, `zh/roadmap.md` |
| `docs-index` | core | `/docs/` | `/zh/docs/` | `docs/index.md`, `zh/docs/index.md` |
| `community` | core | `/community` | `/zh/community` | `community.md`, `zh/community.md` |
| `docs-what-is-oryxos` | documentation | `/docs/concepts/what-is-oryxos` | `/zh/docs/concepts/what-is-oryxos` | Mirrored Markdown |
| `docs-why-java` | documentation | `/docs/concepts/why-java` | `/zh/docs/concepts/why-java` | Mirrored Markdown |
| `docs-design-principles` | documentation | `/docs/concepts/design-principles` | `/zh/docs/concepts/design-principles` | Mirrored Markdown |
| `docs-project-status` | documentation | `/docs/project/project-status` | `/zh/docs/project/project-status` | Mirrored Markdown |
| `docs-build-from-source` | documentation | `/docs/getting-started/build-from-source` | `/zh/docs/getting-started/build-from-source` | Mirrored Markdown |
| `docs-contributing` | documentation | `/docs/contributing` | `/zh/docs/contributing` | Mirrored Markdown |
| `docs-provider` | documentation | `/docs/runtime/provider` | `/zh/docs/runtime/provider` | Mirrored Markdown |
| `docs-react-loop` | documentation | `/docs/runtime/react-loop` | `/zh/docs/runtime/react-loop` | Mirrored Markdown |
| `docs-tool` | documentation | `/docs/runtime/tool` | `/zh/docs/runtime/tool` | Mirrored Markdown |
| `docs-memory` | documentation | `/docs/runtime/memory` | `/zh/docs/runtime/memory` | Mirrored Markdown |
| `docs-skill-profile` | documentation | `/docs/runtime/skill-profile` | `/zh/docs/runtime/skill-profile` | Mirrored Markdown |
| `docs-cli` | documentation | `/docs/interfaces/cli` | `/zh/docs/interfaces/cli` | Mirrored Markdown |
| `docs-rest-api` | documentation | `/docs/interfaces/rest-api` | `/zh/docs/interfaces/rest-api` | Mirrored Markdown |

## Defensive fallback routes

| Page ID | English route | Chinese route | Rule |
|---|---|---|---|
| `translation-unavailable` | `/translation-unavailable` | `/zh/translation-unavailable` | Only for future non-required pages; required routes may not use fallback to pass build |
| `not-found` | `/404.html` | Shared root output | The rendered page detects the retained request path and prioritizes the matching locale without hiding the other recovery option |

## Primary navigation contract

Both locales expose the same semantic entries in this order:

1. Architecture
2. Roadmap
3. Documentation
4. Community
5. GitHub repository (external)

The logo/wordmark links to the active locale home page. The language switcher resolves its target through the
Page manifest, not by adding or removing `/zh/` from an arbitrary URL.

## Sidebar contract

Documentation navigation is grouped identically in both locales:

1. Concepts
2. Project
3. Getting Started
4. Runtime
5. Interfaces
6. Contributing

Labels are localized; Page IDs, grouping, ordering, claim references, and route relationships remain equivalent.

## Build validation

The content validator and Playwright suite must prove:

- all required source pages and built outputs exist;
- no duplicate normalized route exists;
- all internal navigation stays under `/oryxos/` in built output;
- deep English and Chinese routes load directly;
- every required page switches to its counterpart;
- `404.html` exists and offers valid locale-aware recovery links;
- VitePress dead-link checking remains enabled.
