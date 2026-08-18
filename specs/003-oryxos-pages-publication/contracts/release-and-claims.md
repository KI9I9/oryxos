# Contract: Release Baseline and Public Claims

**Feature**: `003-oryxos-pages-publication`

## Purpose

Define the evidence boundary that must be satisfied before OryxOS Website content may describe behavior as
available in the current official release.

## Qualifying release contract

A qualifying baseline MUST satisfy all of the following:

1. The release belongs to `KI9I9/oryxos`.
2. It is a published GitHub Release, not a draft.
3. It names an explicit Git tag that exists on the target repository remote.
4. The tracked tag commit SHA matches the target repository tag.
5. Its tracked snapshot matches live GitHub Release metadata at publication time.
6. It is the latest qualifying Release by descending `publishedAt`, then descending numeric GitHub Release ID when
   qualifying publication timestamps tie.
7. If it is a prerelease, every relevant English and Chinese page visibly identifies the release and maturity as
   pre-alpha or prerelease.
8. If no release satisfies these conditions, publication MUST stop before artifact upload or environment approval.

Local-only tags, upstream-only tags, current `main` source, and draft Releases MUST NOT satisfy this contract.
An older otherwise-valid tracked Release MUST become `stale` when a newer qualifying Release exists.

## Release snapshot contract

The repository-owned release snapshot is status-discriminated.

A `pending` snapshot MUST contain:

```text
schemaVersion
repository
verificationStatus = pending
release identity fields = null
verifiedAt = null
evidenceSource = null
failureReasons = []
```

A `verified` or `stale` snapshot MUST contain at least:

```text
repository
releaseId
releaseUrl
tagName
tagCommitSha
releaseName
publishedAt
isDraft
isPrerelease
maturityLabel
verifiedAt
verificationStatus
evidenceSource
failureReasons
```

`releaseName` MAY be null because GitHub permits a Release with no separate display name. Public presentation MUST
use a non-empty `releaseName` when present and otherwise use the required `tagName`.

A `rejected` snapshot MUST contain `verifiedAt`, `evidenceSource`, non-empty `failureReasons`, and every Release
field actually observed. A field whose absence or malformed value caused rejection MAY remain null; it MUST NOT be
replaced with a plausible-looking placeholder.

Pending snapshots MUST NOT contain invented Release placeholders. Only a `verified` snapshot for the latest
qualifying Release may support an automatic official candidate; the narrowly defined restore-mode exception below
uses separately verified historical and latest identities.

The static build consumes the snapshot without network access. Publication performs a separate live verification.
Immediately after protected approval and before deployment, automatic mode MUST repeat latest-selection and require
the candidate's exact Release ID, publication timestamp, tag, and tag SHA to remain current. Any difference makes
the built candidate stale and requires a rebuild before public bytes may change.

### Restore-mode historical baseline exception

Automatic candidates always require the latest qualifying Release. A restore candidate may reference the
historical Release baseline recorded by its selected previously passed deployment even when that Release is no
longer latest, but only when live verification proves that it still exists in `KI9I9/oryxos`, remains published and
non-draft, and retains the recorded Release ID, publication timestamp, tag, and target tag SHA. Restore mode MUST
also resolve and record the actual latest qualifying Release with the same complete identity.

When the historical and latest Release identities differ:

- the candidate baseline policy MUST be `historical-restoration`;
- every generated public HTML page, including translation-recovery and bilingual 404 output, MUST render a
  prominent bilingual restoration notice naming both Releases;
- the notice MUST state that the restored Website describes the historical Release rather than the latest Runtime
  Release;
- the historical snapshot MUST NOT replace the tracked latest baseline used by automatic publication; and
- post-restoration verification MUST prove the notice and both Release identities.

A missing, draft, or ID/publication-time/tag/SHA-mismatched historical Release remains ineligible for restoration.
Immediately after protected approval, restore mode MUST repeat the historical verification and latest-selection
comparison. A changed historical or latest identity invalidates the built notice and requires a rebuilt candidate.

## Claim contract

Each high-risk public claim MUST have one stable `claimId`, equivalent English and Chinese meaning, affected Page
IDs, a capability state, evidence references, and public handling. The inventory MUST explicitly cover
security-property, affiliation, and adoption claims in addition to capability, interface, maturity, governance, and
asset claims; these classes MUST NOT be left to unstructured prose review.

### State rules

| State | Evidence requirement | Public wording requirement |
|---|---|---|
| `available` | Verified qualifying-release source, artifact, or release note | May describe released behavior; must name or inherit the current release boundary |
| `in-development` | Current project decision or source evidence | Must say it is not part of the current release |
| `planned` | Approved project decision | Must not imply an implementation or delivery date |
| `vision` | Approved long-term direction | Must not imply commitment, affiliation, or current capability |
| `unavailable` | Release absence plus approved handling | Must clearly state that the current release does not provide it |

Security certification/readiness, organizational affiliation, and project adoption claims require direct Release,
license/governance, or independently approved evidence appropriate to the claim. Repository ownership, an
aspiration, a logo, or current source code alone MUST NOT be treated as proof of certification, affiliation, or
adoption.

### Planned syntax rules

Commands or endpoints absent from the qualifying release MAY appear only when:

- the surrounding page state is `planned` or `unavailable`;
- an adjacent English/Chinese warning states that the syntax is a non-executable design example;
- the warning states that the current release does not provide the syntax;
- the example is not labeled Run, Try, Execute, Test, Quick Start, or Installation;
- the example is excluded from operational build and verification instructions.

## Authoritative-document synchronization

Before publication, all designated authoritative documents MUST use compatible statements for:

- repository and organization identity;
- positioning and current maturity;
- release version;
- build and launch instructions;
- CLI and REST availability;
- Provider, ReAct Loop, Tool, Memory, and Skill/Profile status;
- governance, license, and ASF aspiration.

The claim inventory MUST identify every authoritative path checked for each category. Runtime source MUST NOT be
changed solely to satisfy Website prose.

The read-only Website CI and official Pages candidate workflow MUST trigger when `README.md`, `CLAUDE.md`, or
`LICENSE` changes, in addition to Website, Feature 003, and Website-workflow paths. Other evidence files inspected
at a historical Runtime release tag do not become current-branch Website triggers merely because they are evidence.

## Discrepancy closure

Every Feature 002 public-deployment blocker MUST be represented in Feature 003 with:

```text
source discrepancy ID
resolution type
affected Page IDs
supporting claim IDs
resolution notes
status
public deployment blocked flag
```

All blockers MUST be resolved before the publication review can become `approved-for-publication`.
