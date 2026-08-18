# Data Model: OryxOS GitHub Pages Publication

**Feature**: `003-oryxos-pages-publication`

**Date**: 2026-08-18

The Feature remains a static website. These entities are repository records, build-time validation models, or
GitHub publication records; they do not introduce a database or Website server runtime.

## 1. Qualifying Release Baseline

Represents the published OryxOS Runtime release whose capabilities, commands, endpoints, version, and maturity may
be described as available on the official Website.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `repository` | string | yes | Exactly `KI9I9/oryxos` for this Feature |
| `releaseId` | integer/null | conditional | Required for verified/stale; null pending or when absent in a rejected observation |
| `releaseUrl` | absolute HTTPS URL/null | conditional | Required for verified/stale; null pending or when invalid/absent in rejected metadata |
| `tagName` | string/null | conditional | Required for verified/stale; null pending or when missing is a rejection reason |
| `tagCommitSha` | 40-character SHA/null | conditional | Required for verified/stale; null pending or when tag resolution failed in a rejected observation |
| `releaseName` | string/null | conditional | Null pending; may be null for a nameless GitHub Release; public display falls back to `tagName` |
| `publishedAt` | timestamp/null | conditional | Required for verified/stale; null pending or when invalid/absent in rejected metadata |
| `isDraft` | boolean/null | conditional | Required for verified/stale; may be `true` in a rejected observation; null pending/unknown |
| `isPrerelease` | boolean/null | conditional | Required for verified/stale; null pending/unknown rejected metadata |
| `maturityLabel` | enum/null | conditional | `pre-alpha`, `prerelease`, or `stable`; required for verified/stale; null pending or when maturity cannot be assigned to rejected metadata |
| `verifiedAt` | timestamp/null | conditional | Required for every non-pending live result; null while pending |
| `verificationStatus` | enum | yes | `pending`, `verified`, `rejected`, `stale` |
| `evidenceSource` | enum/null | conditional | Null while pending; otherwise `github-release-api` |
| `failureReasons` | string[] | yes | Empty for pending/verified; non-empty for rejected/stale |

### Validation rules

- A `pending` record must set every Release-identity, maturity, verification-time, and evidence field to `null`, set
  `failureReasons` to an empty array, and never invent placeholders that resemble a real Release.
- `verified` and `stale` records require every Release-identity field except `releaseName`, which may be null, plus
  `evidenceSource`. Public display uses non-empty `releaseName` and otherwise falls back to `tagName`.
- A `rejected` record preserves every value actually observed, permits null only for missing/malformed identity
  fields that caused rejection, and requires `evidenceSource`, `verifiedAt`, and non-empty `failureReasons`.
- `isDraft` must be `false` before a candidate can become deployable.
- The tag must exist on the target `origin`; a local-only or upstream-only tag is invalid.
- `tagCommitSha` must match the target repository tag resolution.
- If `isPrerelease` is `true`, `maturityLabel` must be `pre-alpha` or `prerelease`, never `stable`.
- The selected Release must have the greatest `publishedAt` among all qualifying target Releases; equal timestamps
  are ordered by greater numeric `releaseId`. An older otherwise-valid selection has status `stale`.
- If no record reaches `verified`, publication remains blocked.
- Static builds may consume the tracked snapshot offline; only the live publication gate can set the candidate's
  live verification result.

### Relationships

- One Qualifying Release Baseline supports many Claim Evidence Records.
- Every Publication Candidate references exactly one Qualifying Release Baseline.
- Every Public Release records the baseline used for its content.

## 2. Claim Evidence Record

Represents one high-risk public statement and the evidence or decision that permits its publication.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `claimId` | string | yes | Unique stable identifier |
| `category` | enum | yes | `positioning`, `maturity`, `version`, `build`, `cli`, `api`, `provider`, `react-loop`, `tool`, `memory`, `skill-profile`, `security-property`, `governance`, `affiliation`, `adoption`, `asset` |
| `rootStatement` | string | yes | Approved English meaning |
| `zhStatement` | string | yes | Approved equivalent Chinese meaning |
| `affectedPageIds` | string[] | yes | At least one manifest Page ID |
| `state` | enum | yes | `available`, `in-development`, `planned`, `vision`, `unavailable` |
| `evidenceType` | enum | yes | `release-source`, `release-artifact`, `release-note`, `owner-decision`, `license-file` |
| `releaseTag` | string/null | conditional | Required for `available` and release-specific statements |
| `evidenceReferences` | object[] | yes | Repository paths, symbols, release assets, checks, or authoritative decision references |
| `publicHandling` | enum | yes | `publish`, `publish-with-prerelease-label`, `publish-as-unavailable`, `publish-as-design-example`, `omit` |
| `verificationStatus` | enum | yes | `pending`, `verified`, `rejected`, `stale` |
| `verifiedAt` | timestamp/null | conditional | Null while pending; required for verified, rejected, and stale observations |

### Validation rules

- `available` requires a verified Qualifying Release Baseline and release evidence.
- `in-development`, `planned`, and `vision` must not use wording that implies released availability.
- `unavailable` must identify the current release boundary.
- English and Chinese statements must share the same state and public handling.
- Every Feature 002 blocking discrepancy must map to at least one Claim Evidence Record or an explicit omission.
- A stale or rejected claim blocks affected routes from publication.

## 3. Planned Syntax Example

Represents a command or endpoint design illustration for a capability absent from the qualifying release.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `exampleId` | string | yes | Unique within the Website |
| `pageId` | string | yes | Must resolve to an English/Chinese page pair |
| `kind` | enum | yes | `command` or `endpoint` |
| `syntax` | string | yes | Display-only planned syntax |
| `currentReleaseAvailable` | boolean | yes | Must be `false` |
| `executionPolicy` | enum | yes | Must be `non-executable-design-example` |
| `rootWarning` | string | yes | States that the current release does not provide the syntax and it must not be executed |
| `zhWarning` | string | yes | Equivalent Chinese warning |
| `claimId` | string | yes | Links to an unavailable/planned claim |

### Validation rules

- The warning must render adjacent to or within the same semantic container as the syntax.
- The example must not be exposed through copy labels such as “Run”, “Try”, “Execute”, or “Test”.
- It must not be included in Build from Source or Quick Start as an operational step.
- If a later qualifying release provides the syntax, the record must be converted to release evidence or removed.

## 4. Public Page Record

Extends the existing page manifest entry from prototype status to official-publication status.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `pageId` | string | yes | Existing stable Page ID |
| `locale` | enum | yes | `root` or `zh` |
| `route` | string | yes | Existing full root-locale route beginning with `/`; Chinese routes begin with `/zh/` |
| `contentStatus` | enum | yes | `public-reviewed`, `public-prerelease`, or `not-indexable` |
| `counterpartPageId` | string/null | yes | Required for locale-owned public pages |
| `pagePurposeId` | string | yes | Stable bilingual purpose identity used for all-pair comparison |
| `claimIds` | string[] | yes | All high-risk claims rendered by the page |
| `plannedExampleIds` | string[] | yes | May be empty |
| `maturityClaimId` | string | conditional | Required for locale-owned public pages; both counterparts resolve to equivalent maturity meaning |
| `capabilityBoundaryClaimIds` | string[] | yes | Stable claim set used for all-pair capability-boundary comparison |
| `primaryActionIds` | string[] | yes | Stable actions; counterpart pages must expose equivalent action purpose |
| `externalDestinationIds` | string[] | yes | Stable approved destinations; counterpart pages must expose equivalent targets |
| `semanticImageIds` | string[] | yes | Content-bearing images that require appropriate localized alternative text |
| `decorativeImageIds` | string[] | yes | Decorative images that must be excluded from assistive technology |
| `indexable` | boolean | yes | Controls sitemap and crawler handling |
| `canonicalPath` | string | conditional | Required when indexable |
| `requiredSectionKeys` | string[] | yes | Uses final public section keys rather than placeholders |
| `releaseStatusVisibility` | enum | yes | `global`, `page`, or `none`; prerelease locale pages require visible status |
| `socialImage` | string | yes | Approved locale image |
| `socialImageAlt` | string | yes | Localized alternative text for the sharing image |

### Validation rules

- Required English and Chinese route pairs must retain equivalent purpose, maturity meaning, capability-boundary
  claims, primary-action purposes, and external-destination identities.
- Every rendered image must appear in exactly one of `semanticImageIds` or `decorativeImageIds`. Semantic images
  require appropriate localized alternative text; decorative images require empty alternative text or equivalent
  exclusion from the accessibility tree.
- Prototype status and draft-notice keys are invalid for official publication.
- Test fixtures and non-public fallback fixtures must set `indexable: false`.
- Indexable pages must have an absolute canonical URL after public-origin resolution.

## 5. Publication Discrepancy

Carries a Feature 002 public-deployment blocker into Feature 003 without rewriting the historical prototype record.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `discrepancyId` | string | yes | New Feature 003 identifier |
| `sourceDiscrepancyId` | string | yes | Corresponding Feature 002 ID |
| `category` | string | yes | Preserves source category |
| `affectedPageIds` | string[] | yes | Current route impact |
| `resolutionType` | enum | yes | `release-evidence`, `owner-decision`, `content-removal`, `design-example`, `authoritative-sync` |
| `claimIds` | string[] | yes | Evidence records used for resolution |
| `status` | enum | yes | `open`, `in-review`, `resolved`, `reopened` |
| `publicDeploymentBlocked` | boolean | yes | `false` if and only if `status` is `resolved`; `true` otherwise |
| `resolutionNotes` | string | conditional | Required for resolved entries |
| `resolvedAt` | timestamp/null | conditional | Required for resolved entries |

### Lifecycle

```text
open -> in-review -> resolved
                    -> reopened -> in-review
```

- Any open, in-review, or reopened blocking discrepancy prevents publication approval.
- Feature 002 remains unchanged as the historical source snapshot.

## 6. Publication Candidate

Represents one exact Website source revision proposed for official publication.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `candidateId` | string | yes | Unique run-attempt/deployment candidate identity |
| `workflowRunId` | integer | yes | GitHub Actions run that created the candidate |
| `workflowRunAttempt` | integer | yes | Positive `github.run_attempt`; prevents rerun artifact/evidence ambiguity |
| `mode` | enum | yes | `automatic` or `restore` |
| `restorationRequestId` | string/null | conditional | Required for restore mode; null for automatic mode |
| `restorationTargetDeploymentId` | string/integer/null | conditional | Required for a restore candidate; null for automatic mode |
| `restorationTargetPublicReleaseId` | string/null | conditional | Exact successful Public Release behind the restore target; required for restore mode |
| `websiteCommitSha` | SHA | yes | Exact Website source revision |
| `sourceBranch` | string | yes | `main` for automatic; recorded default-workflow branch for restore |
| `releaseId` | integer | yes | GitHub Release ID for the content baseline |
| `releasePublishedAt` | timestamp | yes | Publication timestamp used in deterministic latest-selection comparison |
| `releaseTag` | string | yes | Qualifying Runtime release baseline |
| `releaseCommitSha` | SHA | yes | May differ from Website source SHA |
| `baselinePolicy` | enum | yes | `latest-qualifying` or `historical-restoration` |
| `latestReleaseId` | integer | yes | Latest qualifying GitHub Release ID observed at candidate time |
| `latestReleasePublishedAt` | timestamp | yes | Latest qualifying Release publication timestamp observed at candidate time |
| `latestReleaseTag` | string | yes | Latest qualifying Runtime Release observed at candidate time |
| `latestReleaseCommitSha` | SHA | yes | Target tag SHA for the latest qualifying Runtime Release |
| `historicalRestorationNotice` | object/null | conditional | Required for `historical-restoration`; contains `rootText`, `zhText`, and historical/latest Release ID, publication time, tag, and SHA |
| `publicOrigin` | URL | yes | Exactly `https://ki9i9.github.io/oryxos/`; includes the project base and trailing slash |
| `validationResults` | object | yes | Named results for content, claims, assets, metadata, Chromium, workflow, requirement coverage, and build checks |
| `artifactDigestAlgorithm` | enum | conditional | `sha256-normalized-file-tree-v1` after the generated tree is complete |
| `artifactDigest` | string | conditional | SHA-256 digest of the normalized generated file-tree manifest |
| `pagesArtifactName` | string/null | conditional | Candidate-unique official Pages artifact name; required after upload |
| `pagesArtifactId` | string/integer/null | conditional | Required after official Pages artifact upload |
| `revisionRecordPath` | string | yes | Exactly `/oryxos/publication.json` |
| `freshnessStatus` | enum | yes | `current`, `stale`, or `restore-exempt` |
| `state` | enum | yes | `created`, `validating`, `rejected`, `awaiting-approval`, `approved`, `deploying`, `deployed-awaiting-verification`, `verified`, `degraded`, `failed`, `cancelled` |
| `createdAt` | timestamp | yes | Candidate creation time |

### State transitions

```text
created -> validating
validating -> rejected | awaiting-approval | cancelled
awaiting-approval -> approved | rejected | cancelled
approved -> deploying | cancelled
deploying -> failed | deployed-awaiting-verification
deployed-awaiting-verification -> verified | degraded
```

### Validation rules

- Automatic candidates must use `main` and pass a final current-`main` freshness check.
- Restore candidates must reference the most recent prior eligible passed Pages Deployment Record with a Website
  SHA different from the currently deployed revision, its exact Public Release, and the accepted Restoration
  Request; they use `restore-exempt` freshness. All three restoration linkage fields are null in automatic mode.
- Automatic candidates require `baselinePolicy: latest-qualifying` and identical `releaseTag`/`latestReleaseTag`.
- Restore candidates may use `historical-restoration` only when the historical Release remains published,
  non-draft, and tag-SHA matching; the latest qualifying Release is verified separately and the bilingual
  historical-restoration notice is mandatory on every generated public HTML page, including recovery/404 output.
- The digest is computed after `/oryxos/publication.json` is generated and before upload. The deploy job must consume
  `pagesArtifactName` after the Actions Artifacts API proves its exact `pagesArtifactId` and `workflowRunId`. Because
  the artifact API record does not supply an independent run-attempt assertion, the name MUST encode run/attempt and
  those parsed values MUST equal `workflowRunId`, `workflowRunAttempt`, trusted build outputs, and the current
  workflow context. The candidate and generated-tree digest must also agree, and no generated file may change
  between digest computation and upload.
- Immediately after approval and before deployment, automatic mode must still observe the candidate's exact latest
  Release ID, publication timestamp, tag, and tag SHA. Restore mode must still observe the historical Release as
  published/non-draft/tag-SHA-matching and the exact latest Release identity recorded by the candidate. Any change
  rejects the candidate before deployment and requires a rebuilt candidate/notice.
- A stale automatic candidate or rejected approval transitions to `rejected`; explicit workflow cancellation
  transitions to `cancelled`. A smoke failure maps to Candidate `degraded`, Pages Deployment Record
  `postDeployVerificationStatus: failed`, and restore-mode Restoration Result `status: degraded`.
- Any failed mandatory check prevents `awaiting-approval`.

## 7. Publication Approval

Represents the protected-environment decision for one candidate.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `candidateId` | string | yes | One-to-one with candidate approval attempt |
| `environment` | string | yes | `github-pages` |
| `approver` | string | yes | Authorized maintainer identity |
| `approverIsChangeAuthor` | boolean | yes | May be `true` |
| `independentReviewRequired` | boolean | yes | Must be `false` for this Feature |
| `decision` | enum | yes | `approved`, `rejected`, `pending` |
| `decidedAt` | timestamp/null | conditional | Required when approved/rejected |

### Validation rules

- At least one authorized maintainer approval is required.
- Self-approval is permitted.
- Validation success does not imply approval.

## 8. Pages Deployment Record

Represents one completed GitHub Pages deployment action. Completion means public bytes may have changed; it does
not mean post-deployment verification passed.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `deploymentId` | string/integer | yes | GitHub deployment identity |
| `candidateId` | string | yes | Source candidate |
| `workflowRunId` | integer | yes | Exact GitHub Actions run that built and deployed the candidate |
| `workflowRunAttempt` | integer | yes | Exact run attempt that produced the artifact/deployment evidence |
| `websiteCommitSha` | SHA | yes | Exact published Website revision |
| `releaseId` | integer | yes | GitHub Release ID for the deployed content baseline |
| `releasePublishedAt` | timestamp | yes | Baseline publication timestamp used for latest selection |
| `releaseTag` | string | yes | Runtime claim baseline |
| `releaseCommitSha` | SHA | yes | Exact tag SHA for the Runtime claim baseline |
| `baselinePolicy` | enum | yes | `latest-qualifying` or `historical-restoration` |
| `latestReleaseId` | integer | yes | Latest qualifying GitHub Release ID immediately before deployment |
| `latestReleasePublishedAt` | timestamp | yes | Latest qualifying publication timestamp immediately before deployment |
| `latestReleaseTag` | string | yes | Latest qualifying Runtime Release verified immediately before deployment |
| `latestReleaseCommitSha` | SHA | yes | Exact latest qualifying tag SHA verified immediately before deployment |
| `artifactDigestAlgorithm` | enum | yes | `sha256-normalized-file-tree-v1` |
| `artifactDigest` | string | yes | Published generated-tree digest |
| `pagesArtifactName` | string | yes | Candidate-unique artifact name passed to `actions/deploy-pages` |
| `pagesArtifactId` | string/integer | yes | Exact official Pages artifact proven for the consumed name/run/attempt |
| `publicUrl` | absolute HTTPS URL | yes | Approved Pages URL |
| `revisionMetadataUrl` | absolute HTTPS URL | yes | Exactly the deployed `/oryxos/publication.json` URL |
| `deploymentMode` | enum | yes | `automatic` or `restore` |
| `lifecycleStatus` | enum | yes | `current` or `superseded`; does not erase immutable verification outcome |
| `deploymentCompletedAt` | timestamp | yes | Completion time of the Pages deployment action |
| `approvalReleasedAt` | timestamp | yes | Earliest `in_progress` status time for the exact protected `github-pages` deployment; contractual proxy for approval release |
| `postDeployVerificationStatus` | enum | yes | `pending`, `passed`, or `failed` |
| `verificationCompletedAt` | timestamp/null | conditional | Required when verification passes or fails |
| `smokePassedAt` | timestamp/null | conditional | Required only when verification passes; null otherwise |
| `publicationEffectiveDurationSeconds` | integer/null | conditional | Required only for a pass; `smokePassedAt - approvalReleasedAt` |
| `verificationFailureDetails` | object/null | conditional | Required for failed verification; null for pending/passed |
| `workflowRunUrl` | absolute HTTPS URL | yes | Run-level traceability; `workflowRunAttempt` disambiguates reruns |

### Relationships

- One Pages Deployment Record is produced when one Publication Candidate completes the GitHub Pages deployment
  action; post-deployment verification is then recorded as pending, passed, or failed.
- `pending -> passed` or `pending -> failed` is the only permitted verification transition. The terminal value and
  terminal evidence are immutable.
- A Pages Deployment Record with `postDeployVerificationStatus: passed` creates exactly one successful Public
  Release. Its Public Release `publishedAt` is `smokePassedAt`, not `deploymentCompletedAt`.
- A record with `postDeployVerificationStatus: failed` is a degraded deployment, not a Public Release, and must
  retain structured failure evidence.
- A passed Pages Deployment Record may be the target of many Restoration Requests.
- Only passed Pages Deployment Records are eligible restoration targets; `lifecycleStatus: superseded` does not
  remove eligibility. Degraded deployments may be current but never enter Successful Release History.
- `deploymentId` is resolved after `actions/deploy-pages` through the paginated GitHub Deployments and deployment-
  statuses APIs by exact environment, Website SHA, current-run `log_url` correlation, and deployment time window.
  Zero or multiple matches invalidate the record rather than permitting guessed identity.

## 9. Public Release

Represents the immutable success projection created only from one passed Pages Deployment Record and serialized as
`website/.publication/public-release.json`.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `publicReleaseId` | string | yes | Unique successful-publication identity |
| `sourceDeploymentId` | string/integer | yes | Exact passed Pages Deployment Record |
| `candidateId` | string | yes | Source candidate |
| `workflowRunId` | integer | yes | Exact GitHub Actions run copied from the deployment |
| `workflowRunAttempt` | integer | yes | Exact run attempt copied from the deployment |
| `websiteCommitSha` | SHA | yes | Exact public Website revision |
| `releaseId` | integer | yes | Runtime baseline GitHub Release ID |
| `releasePublishedAt` | timestamp | yes | Runtime baseline publication timestamp |
| `releaseTag` | string | yes | Runtime claim baseline |
| `releaseCommitSha` | SHA | yes | Runtime baseline tag SHA |
| `baselinePolicy` | enum | yes | Copied from the Pages Deployment Record |
| `latestReleaseId` | integer | yes | Latest qualifying GitHub Release ID at deployment time |
| `latestReleasePublishedAt` | timestamp | yes | Latest qualifying Release publication timestamp at deployment time |
| `latestReleaseTag` | string | yes | Latest qualifying Release at deployment time |
| `latestReleaseCommitSha` | SHA | yes | Latest qualifying Release tag SHA at deployment time |
| `artifactDigestAlgorithm` | enum | yes | `sha256-normalized-file-tree-v1` |
| `artifactDigest` | string | yes | Exact published generated-tree digest |
| `pagesArtifactName` | string | yes | Exact artifact name consumed by deployment |
| `pagesArtifactId` | string/integer | yes | Exact artifact ID proven for that name/run/attempt |
| `publicUrl` | absolute HTTPS URL | yes | Approved Pages URL |
| `revisionMetadataUrl` | absolute HTTPS URL | yes | Exact deployed `/oryxos/publication.json` URL |
| `deploymentMode` | enum | yes | `automatic` or `restore` |
| `approvalReleasedAt` | timestamp | yes | Copied timing start |
| `verificationCompletedAt` | timestamp | yes | Terminal smoke verification completion |
| `smokePassedAt` | timestamp | yes | First complete public smoke pass |
| `publicationEffectiveDurationSeconds` | integer | yes | `smokePassedAt - approvalReleasedAt` |
| `publishedAt` | timestamp | yes | Exactly equal to `smokePassedAt` |
| `workflowRunUrl` | absolute HTTPS URL | yes | Run-level source traceability; `workflowRunAttempt` disambiguates reruns |

### Validation rules

- Every field must equal the corresponding passed Pages Deployment Record or its source Candidate.
- One passed deployment creates exactly one Public Release; pending or failed verification creates none.
- `website/.publication/public-release.json` contains exactly this schema and is included in the terminal evidence
  bundle, not the generated public site. The containing bundle's name/digest are recorded outside this payload to
  avoid a self-referential hash.

## 10. Restoration Request

Represents a protected request to republish a previously successful Website revision.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `requestId` | string | yes | Unique manual workflow identity |
| `workflowRunId` | integer | yes | GitHub Actions run that accepted the request |
| `workflowRunAttempt` | integer | yes | Exact run attempt that accepted the request |
| `currentDeploymentId` | string/integer/null | conditional | Public deployment being replaced; null when no current Pages deployment exists |
| `currentWebsiteCommitSha` | SHA/null | conditional | Currently deployed Website revision; null when no current Pages deployment exists |
| `targetDeploymentId` | string/integer/null | conditional | Most recent prior eligible distinct deployment; null when none exists |
| `targetPublicReleaseId` | string/null | conditional | Exact Public Release for the passed target deployment; null when no target exists |
| `targetWebsiteCommitSha` | SHA/null | conditional | Immutable restoration source; null when no target exists |
| `reason` | string | yes | Non-empty maintainer explanation |
| `requestedBy` | string | yes | Authorized workflow actor |
| `acceptedAt` | timestamp | yes | Time an authenticated, syntactically valid manual request is accepted, before eligibility resolution |
| `eligibilityStatus` | enum | yes | `pending`, `eligible`, `rejected`, or `blocked-no-prior-release` |
| `candidateId` | string/null | conditional | Generated restore-mode candidate |
| `status` | enum | yes | `requested`, `validating`, `awaiting-approval`, `completed`, or `cancelled` |
| `approvalWaitStartedAt` | timestamp/null | conditional | Final active build/preflight timestamp after the candidate is ready and immediately before the protected deploy dependency becomes eligible |
| `approvalWaitEndedAt` | timestamp/null | conditional | On deployment success, exact `approvalReleasedAt`; otherwise the authenticated approval rejection/cancellation observation time when available |
| `resultId` | string/null | conditional | Links to the terminal Restoration Result when one exists |

### Validation rules

- Arbitrary SHAs are prohibited.
- A queued `workflow_dispatch` that has not become the active production-concurrency holder is not yet an accepted
  Restoration Request. `acceptedAt` is created only after the active run begins authenticated/syntactic intake;
  replacement of an older pending GitHub concurrency entry therefore creates no request/result record or metric.
- The target must be the most recent prior `github-pages` deployment with passed post-deployment verification whose
  Website SHA differs from the currently deployed Website SHA, ordered by descending completion timestamp then
  descending numeric GitHub deployment ID when timestamps tie. A superseded lifecycle remains eligible.
- A supplied deployment ID or SHA confirms that resolved target; arbitrary older eligible history is rejected.
- No eligible prior distinct deployment sets `eligibilityStatus: blocked-no-prior-release`, leaves target/candidate
  identity null, and creates a linked terminal Result rather than inventing a target or Public Release.
- The target is rebuilt and revalidated rather than copied from an expiring artifact.
- The same protected environment approval applies.
- Terminal timing, outage, deployment, and verification evidence belongs to the linked Restoration Result rather
  than being duplicated in the request.
- Every restore-mode terminal evidence bundle preserves both `restoration-request.json` and
  `restoration-result.json`; automatic-mode bundles contain neither. The Result references, rather than duplicates,
  the Request-owned `reason` and `requestedBy` fields.

## 11. Restoration Result

Represents the terminal evidence for one restoration request, including blocked requests that cannot create a
candidate and deployed restorations whose smoke verification passes or fails.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `resultId` | string | yes | Unique restoration result identity |
| `requestId` | string | yes | Links to one Restoration Request |
| `workflowRunId` | integer | yes | Exact GitHub Actions run copied from the request |
| `workflowRunAttempt` | integer | yes | Exact run attempt copied from the request |
| `candidateId` | string/null | conditional | Null when no candidate was created |
| `pagesDeploymentId` | string/integer/null | conditional | Required after a Pages deployment completes |
| `targetWebsiteCommitSha` | SHA/null | conditional | Required when an eligible target was resolved |
| `historicalReleaseId` | integer/null | conditional | Historical baseline GitHub Release ID when a target exists |
| `historicalReleasePublishedAt` | timestamp/null | conditional | Historical Release publication timestamp when a target exists |
| `historicalReleaseTag` | string/null | conditional | Historical Website claim baseline when a target exists |
| `historicalReleaseCommitSha` | SHA/null | conditional | Expected historical Runtime tag SHA when a target exists |
| `latestReleaseId` | integer/null | conditional | Latest qualifying GitHub Release ID observed for the request |
| `latestReleasePublishedAt` | timestamp/null | conditional | Latest qualifying Release publication timestamp observed for the request |
| `latestReleaseTag` | string/null | conditional | Latest qualifying Runtime Release observed for the request |
| `latestReleaseCommitSha` | SHA/null | conditional | Latest qualifying Runtime tag SHA observed for the request |
| `baselinePolicy` | enum/null | conditional | `latest-qualifying` or `historical-restoration` when a candidate exists |
| `status` | enum | yes | `blocked-no-prior-release`, `rejected`, `cancelled`, `failed-before-deployment`, `degraded`, or `restored` |
| `acceptedAt` | timestamp | yes | Copied from the accepted Restoration Request |
| `approvalWaitStartedAt` | timestamp/null | conditional | Copied from the request when environment approval wait begins |
| `approvalWaitEndedAt` | timestamp/null | conditional | Copied when approval wait resolves |
| `approvalWaitSeconds` | integer | yes | Derived overlap of the approval-wait interval with `[acceptedAt, smokePassedAt]`; `0` when no successful smoke pass exists |
| `outageExclusions` | object[] | yes | Structured, non-overlapping GitHub outage intervals; may be empty |
| `excludedOutageSeconds` | integer/null | conditional | Derived sum for a restored result; null for every non-restored result |
| `verificationCompletedAt` | timestamp/null | conditional | Required after post-restore verification passes or fails |
| `smokePassedAt` | timestamp/null | conditional | Required only when `status` is `restored` |
| `restorationEffectiveDurationSeconds` | integer/null | conditional | Required only when restored |
| `failureDetails` | object/null | conditional | Required for rejected, cancelled, failed-before-deployment, and degraded; null for restored or blocked-no-prior-release |
| `workflowRunUrl` | absolute HTTPS URL | yes | Run-level workflow traceability; `workflowRunAttempt` disambiguates reruns |

### Validation rules

- Each outage entry requires `startedAt`, `endedAt`, `incidentUrl` or repository-owner evidence, `recordedBy`,
  `reason`, and derived `overlapSeconds`.
- For a restored result, every deducted outage interval must overlap `[acceptedAt, smokePassedAt]`, must not overlap
  another outage interval, and must not overlap the separately deducted approval-wait interval.
- `excludedOutageSeconds` and `approvalWaitSeconds` are derived values, never free-form inputs.
- This Feature has one protected-environment approval-wait interval per restoration attempt. A restored result
  derives `approvalWaitSeconds` from that interval's overlap with `[acceptedAt, smokePassedAt]`; every non-restored
  result records `approvalWaitSeconds: 0` because it has no success measurement window.
- `restorationEffectiveDurationSeconds` equals
  `smokePassedAt - acceptedAt - approvalWaitSeconds - excludedOutageSeconds` and cannot be negative.
- Every non-restored result keeps `smokePassedAt`, `restorationEffectiveDurationSeconds`, and
  `excludedOutageSeconds` null. It may preserve outage observations as evidence, but those observations are not
  deducted from a success metric and use `overlapSeconds: 0` because no successful measurement window exists.
- `workflowRunId` and `workflowRunAttempt` must equal the linked request and, when present, the candidate and Pages
  deployment. `workflowRunUrl` identifies the run; the explicit attempt field and attempt-encoded evidence names
  disambiguate reruns because the run URL alone does not.
- `restored` requires a passed Pages Deployment Record. `degraded` requires a failed Pages Deployment Record and
  structured smoke-verification failure details inside `failureDetails`. `blocked-no-prior-release` requires null
  target/candidate/deployment identity. `failed-before-deployment` must not reference a completed deployment.

## 12. Terminal Evidence Bundle and Deployment History

Defines cross-job evidence transport and the durable, enumerable restoration source. Workflow workspaces are never
treated as shared or persistent.

### Evidence artifacts

- Every ordinary evidence artifact and the official Pages artifact name are unique across both `workflowRunId` and
  `workflowRunAttempt`; artifacts created after Candidate creation also encode `candidateId`, while restore
  preflight evidence instead encodes `requestId`. A rerun must never reuse an earlier attempt's name. Every ordinary
  evidence artifact uses `sha256-evidence-payload-v1`: sort its POSIX payload paths except the
  manifest file, hash each file's exact bytes, serialize `<file-sha256>  <relative-path>\n`, store that UTF-8
  manifest in the artifact, and SHA-256 hash the manifest bytes. Its artifact name ends with that manifest digest;
  the Actions Artifacts API authenticates the returned ordinary artifact ID/name/workflow-run association; the
  parsed attempt encoded in the name must separately equal the payload, trusted producer outputs, and current
  workflow context. Every upload records the contract-defined evidence-manifest digest, deterministic artifact
  name, returned artifact ID and upload-Action artifact digest, plus workflow run/attempt context as distinct values.
- Immediately after accepting a restore request, the preflight job uploads an attempt-unique ordinary artifact
  containing exact `restoration-request.json` and its eligibility summary. Conditional restore build and terminal
  jobs must download it by authenticated ID/name/run, verify both digests, and verify its name-encoded attempt.
- The build job uploads a candidate-unique ordinary provenance artifact after the official Pages upload. It contains
  `candidate.json`, the normalized generated-tree manifest, validation summary, and the recorded Pages artifact
  name/ID. Its evidence-manifest digest and deterministic artifact name, returned artifact ID and upload-Action
  artifact digest, and workflow run/attempt context are emitted as separate workflow outputs and are not inserted
  back into the hashed payload.
- The deploy job downloads and verifies that provenance artifact, then uploads a pending-deployment evidence
  artifact containing the unchanged candidate evidence and `pages-deployment.json` with verification `pending`;
  the same manifest-digest/name, returned ID/upload-Action digest, and run/attempt values are likewise emitted out
  of band.
- A read-only terminal finalizer runs with `if: always()` after restoration preflight/build and the protected deploy
  job. When deployment completed, it downloads and verifies both predecessor artifacts, performs the only permitted
  verification transition, and uploads one attempt-unique terminal evidence artifact containing Candidate, Pages
  Deployment Record, optional Public Release, and restore-mode Request/Result. When an accepted restore request
  terminates before candidate or deployment creation, it instead creates the exact Request/Result-only terminal
  bundle from the authenticated preflight artifact payload; Candidate and Pages/Public Release files are present
  only when their lifecycle events occurred. Its artifact name includes the evidence-manifest digest; the deterministic name and
  manifest digest, returned artifact ID and upload-Action artifact digest, and workflow run/attempt context are
  emitted as outputs/GitHub summary values and MUST NOT be inserted into a file covered by that manifest.
- Missing, duplicate, wrong-run/attempt, wrong-candidate, or digest-mismatched evidence artifacts that are required
  by the recorded terminal state are fatal. The official Pages artifact contains only generated public-site files
  and is never used as the evidence transport artifact.
- `if: always()` terminalization is required but cannot override a platform hard-cancel or infrastructure
  termination that prevents remaining jobs from being scheduled. Such a run keeps any already-uploaded
  preflight/provenance evidence, has no fabricated terminal bundle or Restoration Result, and is recorded later as
  an incomplete terminalization incident in Publication Review evidence. A `cancelled` Restoration Result exists
  only when the terminal finalizer actually runs and authenticates the cancellation outcome.

### Durable deployment history

- Terminal workflow artifacts are the immediate authenticated evidence source while retained by GitHub Actions.
- Audit reconciliation appends one immutable record per terminal deployment under
  `website/data/deployment-history/<deploymentId>.json` and, for a pass, one immutable Public Release under
  `website/data/publication-history/<publicReleaseId>.json`. Existing history files must never be rewritten to
  change terminal identity or outcome.
- Each deployment-history file is an envelope containing `schemaVersion`, `repository`, `workflowRunId`,
  `workflowRunAttempt`, `terminalEvidenceArtifactName`, `terminalEvidenceArtifactId`,
  `terminalEvidenceArtifactDigest`, `terminalEvidenceManifestDigest`, `reconciledAt`, exact Candidate and Pages
  Deployment Record objects, optional exact Public Release, and optional linked Restoration Request/Result. Each
  publication-history file contains `schemaVersion`, `sourceDeploymentHistoryPath`, and the exact Public Release.
- `website/data/deployment-history/**` and `website/data/publication-history/**` are validation-visible audit inputs
  but are excluded from automatic publication triggers and from `sha256-publication-source-tree-v1` to avoid an
  audit-only commit becoming a new Website candidate.
- Restoration enumeration uses paginated GitHub deployments plus the tracked append-only history. A retained
  terminal artifact may bridge a not-yet-reconciled deployment only when its repository, workflow, run, candidate,
  deployment, Pages/terminal artifact names and IDs, upload-Action artifact digest, and evidence-manifest digest all
  verify. If tracked and retained evidence both exist, the envelope's stored manifest digest must equal the digest
  encoded in the authenticated retained artifact name, its stored artifact digest must equal the upload Action/API
  value, and its embedded objects must match the verified payload. Missing, expired-without-reconciliation,
  ambiguous, or contradictory terminal evidence makes that deployment ineligible.
- Degraded records remain enumerable as current-deployment evidence but are never restoration targets. Only a
  passed Pages Deployment Record with its matching Public Release enters Successful Release History.

## 13. Requirement Coverage Record

Represents one explicit requirement-to-implementation/test mapping stored in
`website/data/requirement-coverage.json`.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `requirementId` | string | yes | Exact `FR-*` or `SC-*` identifier parsed from `spec.md` |
| `requirementType` | enum | yes | `functional` or `success-criterion` |
| `taskIds` | string[] | yes | At least one exact `T###` implementation/verification task |
| `testReferences` | string[] | yes | At least one exact automated or manual verification path/instruction |
| `coverageStatus` | enum | yes | `mapped`, `implemented`, or `verified` |

### Validation rules

- The file contains a positive `schemaVersion` and one unique record for every identifier matched by
  `^(FR|SC)-[0-9]+[A-Z]*$` in `spec.md`.
- Alphabetic suffixes are identity-bearing. A numeric range or base identifier never covers a suffixed requirement.
- Unknown, duplicate, missing, empty-task, and empty-test records fail validation.
- `implemented` requires every mapped task to be complete; `verified` additionally requires every mapped test
  reference to have a recorded pass. Initial planning records use `mapped`.

## 14. Publication Review Record

Represents the final human and automated authorization snapshot for the Feature.

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Positive supported schema version |
| `reviewId` | string | yes | Unique Feature 003 review identity |
| `reviewedSourceTreeDigestAlgorithm` | enum/null | conditional | `sha256-publication-source-tree-v1` when approved/published |
| `reviewedSourceTreeDigest` | string/null | conditional | Null while blocked; stable reviewed-source digest when approved/published |
| `websiteCommitSha` | SHA/null | conditional | Null before Workflow candidate creation; required after published evidence is reconciled |
| `releaseBaseline` | object | yes | Qualifying Release identity and verification |
| `resolvedDiscrepancies` | string[] | yes | All source blocker mappings |
| `contentResults` | object | yes | English/Chinese truthfulness and parity results |
| `metadataResults` | object | yes | Canonical, sitemap, robots, social results |
| `browserResults` | object | yes | Chromium-only evidence |
| `workflowResults` | object | yes | Least privilege, approval, freshness, restoration tests |
| `externalLinkResults` | object | yes | Repository, issue, license, organization, governance, contribution links |
| `requirementCoverageResults` | object | yes | Explicit FR/SC mapping and verification result, including suffixed IDs |
| `publicOrigin` | URL | yes | Exactly `https://ki9i9.github.io/oryxos/` |
| `decision` | enum | yes | `blocked`, `changes-requested`, `approved-for-publication`, `published` |
| `reviewedAt` | timestamp | yes | Review time |
| `candidateEvidence` | object/null | conditional | Workflow candidate/run/artifact evidence; required after candidate creation |
| `pagesDeploymentEvidence` | object/null | conditional | Deployment and post-deployment result; required after a Pages deployment completes, including degraded results |
| `publicReleaseEvidence` | object/null | conditional | Deployment and post-deployment evidence; required when `published` |

### Lifecycle

```text
blocked -> changes-requested -> approved-for-publication -> published
   ^                |                    |
   +----------------+--------------------+ (new blocker or stale release)
```

- `approved-for-publication` does not bypass the protected environment.
- `blocked` and `changes-requested` records may have null source digest, candidate, and public-release identities.
- `sha256-publication-source-tree-v1` hashes a sorted POSIX-path manifest of `website/**`,
  `specs/003-oryxos-pages-publication/**`, `.github/workflows/website-*.yml`, `README.md`, `CLAUDE.md`, and `LICENSE`,
  excluding generated/dependency/report directories, `website/.publication/**`, and
  `website/data/publication-review.json`, `website/data/deployment-history/**`, and
  `website/data/publication-history/**`; each manifest line is `<file-sha256>  <relative-path>\n`.
- `approved-for-publication` requires `reviewedSourceTreeDigest` and complete review results but does not fabricate a
  commit SHA. The Workflow binds that reviewed tree to an exact `main` candidate and emits canonical candidate
  evidence outside the candidate source tree.
- `published` requires a passed Pages Deployment Record that qualifies as a successful Public Release at the
  approved origin. A degraded deployment may populate `pagesDeploymentEvidence` but cannot set `published` or
  populate successful `publicReleaseEvidence`.
- A later audit-only commit may reconcile the exact deployed `websiteCommitSha` and public evidence. That audit
  commit is excluded from automatic publication triggers and is not presented as the deployed candidate.
