# Prototype Content Contract

## Scope

This Feature produces a local visual prototype. Page layout, headings, summaries, and explanatory copy may be
provisional when they support presentation review. Provisional copy is not final project documentation and must
not be deployed to a public address by this Feature.

## Constitution-aligned Agent concept

The prototype uses this canonical concept:

> One YAML Profile completely defines an Agent. The Profile may declare or reference a Skill that supplies
> behavioral instructions and is loaded as prompt context.

The prototype must not describe Skill as a separately executable Tool or as a second configuration object that is
required alongside Profile to define an Agent.

## Draft notice

Every prototype page displays a visually prominent and programmatically discoverable notice:

```text
Draft visual prototype — content is provisional and not public documentation.
```

The Chinese page displays an equivalent localized notice. The notice is supplied by the SSR-rendered shared
layout, appears before substantive page content, and is not hidden by CSS or client-only rendering.

## Required provisional page form

Each provisional documentation page additionally contains these sections:

1. Overview
2. Intended design
3. Status placeholder
4. Limitations placeholder
5. Related navigation

These sections exist to review information hierarchy. They do not imply that the content has passed final source,
release, or authoritative-document verification.

## Allowed provisional variation

The following may differ from final publication content:

- marketing phrasing and section summaries;
- illustrative labels and short examples that are not executable;
- diagram annotations and page ordering;
- localized wording, provided route purpose and draft status remain equivalent.

## Prohibited prototype claims

The prototype must not:

- describe an unverified capability as Available, production-ready, secure-certified, or enterprise-proven;
- present `init`, `chat`, `serve`, REST endpoints, MCP flows, or other unverified interfaces as runnable;
- include real or placeholder secrets, personal data, internal network addresses, or tracking scripts;
- call Agent, Tool, Memory, Profile-management, or other Runtime APIs;
- use copy or assets from `.website.bak`;
- publish provisional content to GitHub Pages or another public address.

## Capability-state visual legend

The design may demonstrate the exact labels Available, In development, Planned, and Vision as a visual legend.
Legend items explain how future verified content will be categorized. This Feature must not assign those states
to any real capability.

## Documentation discrepancies

`discrepancy-register.yaml` records issues to resolve before final content publication. All unresolved
content/governance discrepancies block public deployment. The prototype handles them with one of:

- neutral copy;
- a visible draft label;
- omission of disputed detail.

The register is a handoff artifact, not a waiver of Constitution requirements.

## Automated checks

The prototype content validator fails when:

- a required route or locale counterpart is missing;
- any page lacks the global draft notice;
- a provisional documentation page lacks the required section form;
- the source contains prohibited runnable-command or endpoint presentation;
- a page assigns an availability state to any real capability;
- likely secrets, personal data, internal addresses, tracking, CMS, or Runtime API calls are present;
- any workflow contains Pages write permissions, Pages artifact upload, or Pages deployment actions.

## Manual checks

The local prototype review confirms:

- provisional wording is visually obvious and conservative;
- the Agent/Profile/Skill concept matches the Constitution;
- no page appears to be final public documentation;
- English and Chinese page forms have equivalent purpose;
- diagrams and alt text communicate the intended visual structure;
- all unresolved final-content discrepancies remain blocked from public deployment.
