# Data Model: New OryxOS Website

The website has no database. These entities describe repository-owned static content, governance manifests, and
release-review records. JSON/YAML representations must be schema-validated by project scripts before build.

## 1. Locale

Represents a supported language context.

| Field | Type | Rules |
|---|---|---|
| `id` | enum | `root` or `zh` |
| `languageTag` | string | `en` for root; `zh-Hans` for Chinese |
| `routePrefix` | string | `/` for root; `/zh/` for Chinese |
| `label` | string | Human-readable language label |
| `defaultTitle` | string | Localized site title |
| `defaultDescription` | string | Localized default description |
| `socialLocale` | string | `en_US` or `zh_CN` |
| `fallbackPageId` | Page ID | Must resolve inside the same locale |

**Identity**: `id` is unique.

**Relationship**: Every Page belongs to exactly one Locale.

## 2. Page

Represents one localized public route.

| Field | Type | Rules |
|---|---|---|
| `pageId` | string | Stable semantic ID shared by locale counterparts |
| `locale` | Locale ID | Required |
| `kind` | enum | `core`, `documentation`, `fallback`, or `not-found` |
| `route` | string | Logical route without the `/oryxos/` base |
| `sourcePath` | string | Repository-relative Markdown path |
| `title` | string | Required and unique within a locale |
| `description` | string | Required, localized, concise |
| `counterpartPageId` | string | Same semantic page in the other locale |
| `required` | boolean | Required pages must exist in both locales |
| `translationStatus` | enum | `draft`, `review-required`, or `reviewed` |
| `claimIds` | string[] | Claims used by the page |
| `primaryActionKeys` | string[] | Stable semantic CTA identifiers |
| `ogImage` | Asset ID | Required directly or through locale default |

**Validation**:

- Required Page IDs have exactly one English and one Chinese record.
- Counterparts share `pageId`, claim set, capability state references, and primary action purpose.
- Formal publication forbids `translationStatus != reviewed`.
- Routes are unique after locale and clean-URL normalization.

## 3. Documentation Topic

Extends Page for a subject page.

| Field | Type | Rules |
|---|---|---|
| `topicGroup` | enum | `concepts`, `project`, `getting-started`, `runtime`, `interfaces`, `contributing` |
| `publicationState` | enum | `draft`, `review-required`, `validation-approved`, `publication-blocked`, `publishable` |
| `requiredSectionKeys` | string[] | Incomplete capabilities require status/current/target/limitations/unavailable/evidence |
| `evidenceReviewedRef` | string | Commit, tag, or release baseline |
| `evidenceReviewedAt` | ISO date | Required once validation-approved |

**Lifecycle**:

```text
draft -> review-required -> validation-approved
                         -> publication-blocked
validation-approved -> publishable (only after publication blockers close)
publication-blocked -> review-required (after evidence or documentation changes)
```

## 4. Capability

Represents a product capability at a sufficiently atomic scope.

| Field | Type | Rules |
|---|---|---|
| `capabilityId` | string | Stable ID such as `CAP-CLI-HELP` |
| `subject` | string | Provider, CLI, REST API, Memory, etc. |
| `state` | enum | `available`, `in-development`, `planned`, `vision` |
| `claimIds` | string[] | Claims explaining the capability |
| `affectedPageIds` | string[] | Every page displaying the state |
| `limitations` | string[] | Required unless state is fully verified Available |

**State transitions**:

- `vision -> planned` requires an approved design source.
- `planned -> in-development` requires verifiable current implementation activity.
- `in-development -> available` requires implementation evidence plus reproducible validation.
- Any state may move backward when evidence is invalidated; the discrepancy register records the reason.

## 5. Claim

Represents one factual public statement shared by both locales.

| Field | Type | Rules |
|---|---|---|
| `claimId` | string | Unique, immutable semantic identifier |
| `statementKey` | string | Locale-independent meaning key |
| `subject` | string | Capability or project concept |
| `scope` | enum | `working-tree`, `default-branch`, `release`, `target-design` |
| `capabilityState` | Capability state | Required for product capability claims |
| `evidenceState` | enum | `verified`, `partially-verified`, `unverified`, `contradicted` |
| `evidenceIds` | string[] | At least one for verified claims |
| `verifiedRef` | string | Commit/tag/release used as baseline |
| `verifiedAt` | ISO date | Required for reviewed claims |
| `affectedPageIds` | string[] | All pages publishing the claim |
| `publicationDecision` | enum | `allowed`, `validation-only`, `blocked` |

**Rules**:

- `available` requires implementation evidence and reproducible validation evidence.
- Design documents alone can support only `planned` or `vision`.
- English and Chinese pages reference the same Claim IDs.
- Contradicted claims cannot be published as facts.

## 6. Evidence

Represents an auditable source used to support or contradict a Claim.

| Field | Type | Rules |
|---|---|---|
| `evidenceId` | string | Unique identifier |
| `type` | enum | `source`, `automated-verification`, `release-artifact`, `config`, `governance`, `design`, `external-link` |
| `repository` | string | Must identify `k-oryxos` for local evidence |
| `ref` | string | Commit SHA, tag, version, or `working-tree` |
| `pathOrUrl` | string | Repository path or reviewed URL |
| `locator` | string | Symbol, section, command, or test name |
| `relation` | enum | `supports` or `contradicts` |
| `observedAt` | ISO timestamp/date | Required |
| `result` | string | Concise verification result |
| `notes` | string | Scope and limitations |

## 7. Documentation Discrepancy

Represents a conflict delegated to a follow-up feature.

| Field | Type | Rules |
|---|---|---|
| `discrepancyId` | string | Unique identifier |
| `category` | enum | `positioning`, `maturity`, `version`, `build`, `capability`, `cli`, `api`, `deployment`, `asset`, `community`, `governance` |
| `claimId` | string or null | Associated Claim when applicable |
| `sources` | object[] | At least two conflicting or incomplete sources |
| `observedFact` | string | Verifiable current conclusion |
| `affectedRoutes` | string[] | Website routes affected |
| `affectedLocales` | enum | `en`, `zh`, or `both` |
| `severity` | enum | `blocker`, `high`, `medium`, `low` |
| `validationDeployAllowed` | boolean | May be true with explicit review |
| `formalPublicationBlocked` | boolean | True for factual contradictions |
| `status` | enum | `open`, `triaged`, `accepted-for-validation`, `resolved`, `superseded` |
| `requiredAction` | string | Follow-up needed |
| `resolutionEvidence` | string[] | Evidence required to close |

**Lifecycle**:

```text
open -> triaged -> accepted-for-validation
                -> resolved
accepted-for-validation -> resolved
open/triaged -> superseded (only when replaced by a newer discrepancy)
```

Validation acceptance never implies factual resolution.

## 8. Navigation Entry

| Field | Type | Rules |
|---|---|---|
| `key` | string | Stable semantic key |
| `locale` | Locale ID | Required |
| `label` | string | Localized |
| `target` | route or URL | Internal route or approved external link |
| `location` | enum | `primary`, `sidebar`, `footer`, `cta` |
| `external` | boolean | External destinations must be visually/semantically identified |
| `order` | integer | Unique within location and locale |

## 9. Brand Asset

| Field | Type | Rules |
|---|---|---|
| `assetId` | string | Unique identifier |
| `kind` | enum | `logo-mark`, `wordmark`, `lockup`, `favicon`, `touch-icon`, `social`, `diagram` |
| `sourcePath` | string | Repository-relative file path |
| `format` | enum | `svg` or `png` |
| `locale` | enum/null | Null for language-neutral assets |
| `dimensions` | object/null | Required for raster assets |
| `altKey` | string/null | Required for informative assets |
| `decorative` | boolean | Decorative assets use empty alt and assistive-technology exclusion |
| `license` | string | Must confirm original project-owned work or approved license |

## 10. Release Review

Represents the manual approval record for a validation deployment.

| Field | Type | Rules |
|---|---|---|
| `reviewId` | string | Supplied to workflow input |
| `sourceRef` | commit SHA | Immutable deployment input |
| `reviewer` | string | Authorized maintainer |
| `reviewedAt` | ISO timestamp | Required |
| `buildResult` | enum | `passed` or `failed` |
| `claimReviewResult` | enum | `passed` or `failed` |
| `openDiscrepancyIds` | string[] | Snapshot of unresolved items |
| `publicAccessAcknowledged` | boolean | Must be true |
| `indexingMode` | enum | Fixed to `noindex` for this Feature |
| `decision` | enum | `approved` or `rejected` |
| `workflowRunId` | string/null | Filled after execution |
| `deployedUrl` | URL/null | Filled after success |

## Relationships

```text
Locale 1 --- * Page
Page * --- * Claim
Page 1 --- 0..1 Brand Asset (social image override)
Capability 1 --- * Claim
Claim * --- * Evidence
Claim 0..1 --- * Documentation Discrepancy
Documentation Discrepancy * --- * Page
Release Review * --- * Documentation Discrepancy
Navigation Entry * --- 1 Page or approved external link
```
