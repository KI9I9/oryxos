# Content Governance Contract

## Canonical public concept

The website uses the conceptual model:

> Skill defines what an Agent does. Profile defines how it runs. Skill + Profile together define an Agent.

The YAML Profile remains the authoritative runtime configuration entry and declares or references the selected
Skill. Until Runtime implementation verifies Skill loading, the website labels the behavior according to its
evidence-backed capability state.

## Capability states

Only these values are permitted:

| Machine value | Required English label | Meaning |
|---|---|---|
| `available` | Available | Implemented and backed by reproducible evidence for a stated ref |
| `in-development` | In development | Current implementation work or partial behavior exists, but the capability is not a stable workflow |
| `planned` | Planned | Approved target design exists without verified current implementation |
| `vision` | Vision | Long-term direction, not a delivery date or version commitment |

State must be assigned to atomic capabilities. A module, page, POM description, or design document does not make
all named behavior Available.

## Claim publication rules

1. Every factual product statement has a Claim ID.
2. English and Chinese pages reference the same Claim IDs.
3. An Available claim requires both implementation evidence and reproducible validation evidence.
4. Governance or design documents may support Planned or Vision claims but cannot alone support Available.
5. `contradicted` or `unverified` claims are blocked from factual publication.
6. A `validation-only` claim may appear only with explicit limitations and release-review approval.
7. Website prose may explain evidence but may not silently strengthen the registered state.

## Incomplete capability page contract

Provider, ReAct Loop, Tool, Memory, Skill/Profile, CLI, and REST API pages must visibly contain:

1. **Publication state**
2. **Verified current behavior**
3. **Target design**
4. **Known limitations**
5. **What is not currently available**
6. **Related evidence**
7. **Related concepts**

Illustrative designs and non-runnable examples must be labeled:

> Illustrative target design — not currently runnable.

Commands, API paths, and examples may be labeled runnable only after executing them against the exact reviewed
source or release ref.

## Evidence precedence

Use this order when claims conflict:

1. Reproducible verification against an identified release artifact or commit
2. Implemented source and configuration at an identified ref
3. Approved governance and Feature specifications
4. Technical design documents
5. README and other descriptive prose

Lower-precedence material can establish intent or a discrepancy, not override higher-precedence evidence.

## Discrepancy handling

- This Feature records conflicts in `discrepancy-register.yaml` and does not modify README or existing
  authoritative documents.
- Each discrepancy identifies sources, observed fact, impact, severity, follow-up action, and publication status.
- `accepted-for-validation` permits an approved validation deployment; it does not resolve the factual conflict.
- A contradiction that would create incompatible public facts blocks formal publication until a separate Feature
  resolves it or provides new validating evidence.
- Deployment and build configuration conflicts that are inside Feature 002 are resolved by Feature 002 tasks and
  closed only after validation.

## Initial evidence expectations

- CLI top-level help and version behavior may be evaluated independently from planned subcommands.
- REST response wrappers and exception handling may be described independently from unimplemented business
  endpoints.
- Module boundaries and dependencies may be Available while the runtime behavior named in module descriptions is
  still In development or Planned.
- Distributed collaboration remains Vision unless verified implementation evidence is added.

## Automated checks

The content validator fails when:

- a state is outside the four-value enum;
- the same Capability ID has different states on different pages;
- locale counterparts reference different Claim IDs or capability states;
- an Available Claim lacks required evidence types;
- an incomplete capability page lacks a required section;
- blocked Claim IDs are included in publishable content;
- a required discrepancy field is missing.

## Manual checks

Release review confirms:

- English and Chinese prose have equivalent strength and limitations;
- no target design is presented as implemented;
- alt text and diagrams communicate the intended information;
- open discrepancies are complete and accurately classified;
- current evidence references the exact source or release being described.
