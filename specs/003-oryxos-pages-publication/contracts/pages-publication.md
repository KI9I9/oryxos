# Contract: GitHub Pages Publication Workflow

**Feature**: `003-oryxos-pages-publication`

## Workflow boundary

Exactly one active workflow MAY possess GitHub Pages deployment capability. All other workflows MUST remain
non-deploying.

The publication workflow supports:

- automatic candidates created by relevant changes reaching `main`;
- manual restoration of the most recent prior eligible distinct public Website revision.

Read-only validation paths MUST include `website/**`, `specs/003-oryxos-pages-publication/**`,
`.github/workflows/website-*.yml`, `.github/workflows/ci.yml`, `README.md`, `CLAUDE.md`, and `LICENSE`. Automatic
publication paths MUST include the same set except `.github/workflows/ci.yml`, whose policy-only changes do not alter
the public artifact. Audit-only changes to `website/data/publication-review.json`,
`website/data/deployment-history/**`, or `website/data/publication-history/**` MUST remain validation-visible but
MUST NOT create a new automatic publication candidate.

Pull requests and ordinary feature-branch runs MUST NOT deploy.

Because this Feature changes `.github/workflows/ci.yml`, Feature completion also requires a separate successful
Runtime `./mvnw verify` result after that policy change. The Runtime gate is not part of the Website build job and
MUST NOT make Maven a Website dependency; it is independent cross-project compliance evidence.

## Restoration preflight job

Manual restore mode MUST first run a non-deploying preflight job after the workflow becomes the active production
concurrency holder. It MUST:

- use only `contents: read`, `actions: read`, and `deployments: read`;
- authenticate and syntactically validate the actor, explicit restore mode, non-empty reason, and optional target
  confirmation, then create `acceptedAt` before eligibility resolution;
- read the default-branch append-only history, paginated GitHub deployments, and retained terminal artifacts;
- resolve the current deployment and most-recent-prior distinct passed deployment/Public Release with exact
  repository/run/attempt/candidate/artifact/digest agreement;
- reject a missing/mismatched confirmation when an eligible target exists, or produce linked
  `blocked-no-prior-release` eligibility state when none exists; and
- immediately upload an attempt-unique `sha256-evidence-payload-v1` preflight artifact containing the exact
  Restoration Request and eligibility summary, then emit its deterministic name/manifest digest, returned
  ID/upload-Action digest, and workflow run/attempt context for the conditional build and `if: always()` terminal
  finalizer without granting Pages/OIDC write access.

The restore build job runs only for an eligible confirmed target and checks out that immutable Website revision.
It MUST download and digest-verify the exact preflight artifact before creating a restore Candidate. Automatic mode
does not create a Restoration Request and does not require this preflight.

## Candidate build job

The build/validation job MUST:

1. Check out the exact candidate revision.
2. Use `website/.nvmrc` and the committed npm lockfile.
3. Install dependencies with `npm ci`.
4. Install only the locked Chromium browser required by the Feature.
5. For automatic mode, verify the tracked baseline is the latest qualifying live target GitHub Release and target
   tag. For restore mode, verify the selected historical Release remains published/non-draft with the expected
   Release ID/publication timestamp/tag/SHA, resolve the latest qualifying Release separately, and require the
   historical-restoration notice when they differ.
6. Verify every blocking discrepancy is resolved.
7. Run content, claim, authoritative-document, requirement-coverage, publishable-source safety, asset, type,
   static-build, metadata, route, accessibility, responsive, and workflow-policy checks.
8. Build the Pages output exactly once for that candidate and generate `/oryxos/publication.json` containing only
   the candidate SHA, Runtime release tag/SHA, candidate ID, and approved public origin.
9. Scan the complete generated output for secret-like credentials, private data patterns, internal network
   addresses, unapproved analytics/tracking, insecure active resources, and privileged Runtime API calls.
10. Compute `sha256-normalized-file-tree-v1`: sort generated POSIX relative paths, hash each file's exact bytes,
    serialize `<file-sha256>  <relative-path>\n`, then SHA-256 hash that UTF-8 manifest.
11. Record candidate SHA, workflow run/attempt, Release ID/publication timestamp/tag/SHA, validation results, digest
    algorithm/content digest, revision record, and a candidate-unique Pages artifact name.
12. Upload the unchanged generated directory under that name with the official Pages artifact action only after
    every blocking check passes, then record the returned GitHub Pages artifact ID.
13. Upload a separate ordinary provenance artifact containing `candidate.json`, the generated-tree digest manifest,
    and validation summary using `sha256-evidence-payload-v1`; encode its manifest digest in the candidate-unique
    artifact name and publish the deterministic name/manifest digest, returned artifact ID/upload-Action digest,
    and workflow run/attempt context as distinct job outputs. The ordinary evidence artifact MUST NOT be the Pages
    artifact and MUST NOT enter the generated public tree.

The build job MUST use `contents: read` and `actions: read` only and MUST NOT have Pages, OIDC, deployment, or other
write permission.

## Deploy job

The deploy job MUST:

- depend on the successful build job;
- use the `github-pages` protected environment;
- receive `pages: write` and `id-token: write` only at job scope, plus only `contents: read`, `actions: read`, and
  `deployments: read` needed for freshness and evidence resolution;
- wait for at least one authorized maintainer approval;
- permit an authorized change author to approve their own deployment;
- download and verify the exact candidate provenance artifact by workflow run/attempt, candidate ID, and manifest
  digest;
- prove through the Actions Artifacts API that the candidate-unique Pages artifact name resolves to the recorded
  artifact ID in the exact workflow run; separately parse the run and attempt encoded in that name and require
  them to equal the Candidate, trusted build-job outputs, and current `github.run_id`/`github.run_attempt`; zero,
  duplicate, expired, wrong-run, wrong-attempt-name, or otherwise mismatched results MUST fail;
- invoke the official Pages deployment action with that exact artifact name and preserve its recorded content
  digest; the action does not consume the numeric artifact ID directly;
- expose the resulting Pages URL, then resolve the exact GitHub deployment through the paginated Deployments and
  deployment-statuses APIs by `github-pages` environment, Website SHA, current-run `log_url` correlation, and
  completion window; zero or multiple matches MUST fail;
- set `approvalReleasedAt` to the earliest `in_progress` status timestamp for that exact protected deployment;
- initialize a pending Pages Deployment Record and upload it with the unchanged candidate evidence as a separate
  `sha256-evidence-payload-v1` pending-deployment artifact for the verification job, with digest-encoded name and
  separate deterministic-name/manifest-digest, returned-ID/upload-Action-digest, and run/attempt outputs.

For automatic mode, after approval and before deployment, the job MUST verify that the candidate SHA still equals
the target repository's current `main` SHA and that the candidate's exact latest Release ID, publication timestamp,
tag, and tag SHA are still latest and valid. Restore mode MUST reverify both its historical Release and the exact
latest Release identity used to render its notice. Any stale source or Release identity MUST fail without modifying
the site and require a rebuilt candidate.

## Post-deployment verification and terminal-finalization job

A read-only terminal job MUST:

- declare build/preflight and deploy dependencies and use `if: always()` so accepted restoration requests can
  receive a terminal Result even when no candidate or Pages deployment was created;
- use only `contents: read`, `actions: read`, and `deployments: read`, with no Pages/OIDC write permission;
- when deployment completed, download and digest-verify the candidate provenance and pending-deployment evidence
  artifacts rather than assuming a shared filesystem between jobs;
- in restore mode, always download and digest-verify the exact preflight artifact; when the request terminates
  before deployment, use its authenticated Request/eligibility payload to create the exact Request/Result-only
  terminal bundle and require Candidate/Pages/Public Release evidence only if those lifecycle events actually
  occurred;
- when deployment completed, use the exact URL returned by the deploy job; verify required English/Chinese routes,
  deep links, assets, canonical/alternate/social metadata, sitemap, robots, security expectations, Runtime Release
  identity, and `/oryxos/publication.json`; prove the public revision record matches the candidate SHA, Runtime
  release tag/SHA, candidate ID, and approved origin from build evidence;
- when deployment completed, consume the Pages Deployment Record created from the deploy-job outputs with
  verification initially pending and perform its one permitted transition to immutable terminal `passed` or
  `failed`; always record `approvalReleasedAt` and `verificationCompletedAt`; on pass also record `smokePassedAt`
  and `publicationEffectiveDurationSeconds` and promote the record to a Public Release, while on smoke failure keep
  pass fields null, record structured failure details, classify the record as degraded, and update Candidate state
  to `degraded` rather than creating a Public Release;
- upload one terminal evidence artifact containing the terminal Candidate, terminal Pages Deployment Record,
  conditional exact-schema Public Release, and both Restoration Request/Result records in deployed restore mode;
  for pre-candidate/pre-deployment restore termination, omit objects that never existed and include the exact
  Request/Result pair; compute `sha256-evidence-payload-v1`, encode its manifest digest in the attempt-unique artifact
  name, and record the deterministic name/manifest digest, returned ordinary artifact ID/upload-Action digest, and
  workflow run/attempt context outside the hashed payload;
- fail and preserve the degraded deployment evidence if any smoke check fails;
- direct maintainers to the same protected restoration workflow without automatically deploying another revision.

GitHub does not expose a separate stable approval-release timestamp for this contract. Therefore the earliest
`in_progress` status timestamp for the exact protected deployment is the contractual operational proxy stored as
`approvalReleasedAt`. The 10-minute publication target is measured from that value to the first complete smoke pass.

## Concurrency contract

- Automatic and restoration workflow runs share one `cancel-in-progress: false` workflow-level production
  concurrency group covering build, approval, deployment, and post-deployment verification. This prevents a second
  run from deploying while the active run's public verification is still pending and prevents a new automatic run
  from cancelling an accepted restoration that is waiting for approval, deploying, or verifying.
- GitHub permits at most one running and one pending run in a concurrency group and may replace the older pending
  run. Therefore Workflow request acceptance and `RestorationRequest.acceptedAt` occur only after the restoration
  becomes the active group holder and begins authenticated/syntactic intake; a merely queued dispatch has not yet
  created a Restoration Request or started the restoration metric.
- Queued or approved automatic candidates that are no longer current are rejected by the post-approval source and
  Release freshness checks; `cancel-in-progress` is not used because it cannot distinguish the mode of the active
  workflow. GitHub's documented replacement of an older pending entry remains outside accepted-request semantics.
- A stale automatic candidate cannot overwrite a newer approved publication.
- Restoration is explicit and may deploy only the most recent prior eligible distinct Website revision, and it
  still passes validation and approval. When its Runtime baseline is historical, it must pass the separate
  historical/latest Release checks and render the mandatory bilingual historical-restoration notice.

## Permission allowlist

The workflow policy MUST reject:

- `pages: write` or `id-token: write` outside the publication deploy job;
- Pages actions outside the publication workflow;
- third-party Pages/branch deploy actions;
- publication to a `gh-pages` branch;
- deployment environments other than the approved `github-pages` environment;
- pull-request deployment triggers;
- workflows that skip release-baseline or quality gates;
- multiple deploy-capable workflows.

The policy MUST require:

- official checkout, Node setup, Pages configuration/artifact/deployment actions;
- explicit `main` automatic scope;
- the fixed authoritative-document trigger set and every audit-only review/history exclusion;
- protected manual restoration inputs;
- a restore-only preflight job with exactly `contents: read`, `actions: read`, and `deployments: read`;
- build-to-deploy job dependency;
- build/preflight/deploy-to-terminal-finalizer dependencies with `if: always()` and state-conditional evidence;
- job-level least privilege;
- one `cancel-in-progress: false` production concurrency group, active-slot-only restoration acceptance, and
  post-approval stale-candidate handling;
- digest-verified restore-preflight, provenance, pending-deployment, and terminal evidence artifacts;
- automatic-trigger exclusions for `website/data/publication-review.json`,
  `website/data/deployment-history/**`, and `website/data/publication-history/**` while retaining validation
  visibility for those audit records.

## Repository environment contract

Before the first release, the repository owner MUST configure:

1. Pages source: GitHub Actions.
2. Environment name: `github-pages`.
3. At least one authorized maintainer reviewer.
4. Self-review prevention: disabled, so an authorized author may approve.
5. No unapproved branch-based Pages source.

If these settings cannot be verified, the candidate remains blocked.

## Failure contract

- Validation failure: no artifact enters deployment and the current public deployment identity remains unchanged.
- Approval missing or rejected: no deployment occurs and the current public deployment identity remains unchanged.
- Candidate cancellation before deployment completion: no deployment occurs and the current public deployment
  identity remains unchanged.
- Candidate becomes stale: no deployment occurs and the current public deployment identity remains unchanged.
- Pages deployment fails before completion: the current public deployment identity remains unchanged and the prior
  passed Public Release remains the last known good release.
- Post-deployment validation fails: public bytes may already have changed. Record a degraded Pages Deployment
  Record, do not create a Public Release, preserve the prior passed Public Release as the last known good recovery
  target, and initiate the protected restoration procedure without silently retrying another revision.

`if: always()` handles dependency failure, rejection, and cancellation when GitHub schedules the terminal job. A
platform hard-cancel or infrastructure termination can prevent all remaining jobs from running; in that case the
retained preflight/provenance artifact and GitHub run status are later reconciled as an incomplete terminalization
incident in the Publication Review, and no Restoration Result or terminal bundle is fabricated.

Workflow/state fixture tests MUST exercise validation rejection, approval rejection, cancellation, stale-candidate
rejection, and Pages deployment failure, comparing deployment ID, Website SHA, and public URL identity before and
after each pre-completion failure. Separate tests MUST prove the degraded-deployment behavior after a completed
deployment whose public smoke check fails.
