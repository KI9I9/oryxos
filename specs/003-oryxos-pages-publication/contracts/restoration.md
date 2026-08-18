# Contract: Public Website Restoration

**Feature**: `003-oryxos-pages-publication`

## Eligible target

A restoration target MUST be the most recent prior `github-pages` Pages Deployment Record for `KI9I9/oryxos` whose
immutable post-deployment verification result passed and whose Website commit SHA differs from the currently
deployed Website SHA. Its deployment mode may be automatic or restore, and its lifecycle may be current or
superseded. Resolve it by
descending deployment completion time, then descending numeric GitHub deployment ID when completion timestamps
tie, while excluding the current deployment and repeated deployments of the same Website revision. Arbitrary
commits, older non-most-recent eligible deployments, failed/unverified candidates, ordinary artifacts, and
revisions that never crossed the protected environment are not eligible in this Feature.

Eligibility MUST be proven from paginated GitHub deployment metadata plus matching terminal evidence from either a
retained authenticated workflow artifact or the append-only tracked records under
`website/data/deployment-history/` and `website/data/publication-history/`. The exact repository, workflow
run/attempt, candidate, Website SHA, deployment ID, Pages artifact name/ID, terminal status, and evidence-manifest
digest must agree; retained evidence additionally requires the exact terminal artifact name/ID/upload-Action
digest/run/attempt. Expired evidence without tracked reconciliation, ambiguous matches, or contradictory records
are ineligible.

## Manual input

The restoration request MUST collect:

- optional target prior deployment identity or exact Website commit SHA confirmation; it is required before an
  eligible candidate can be created but may be omitted when the request is allowed only to resolve and record that
  no prior eligible distinct deployment exists;
- non-empty restoration reason;
- requesting maintainer identity supplied by GitHub;
- explicit restoration mode.

If a SHA or deployment ID is supplied, the workflow MUST resolve it back to the most recent prior eligible distinct
deployment before proceeding. A different older eligible target is rejected rather than treated as an override. If
an eligible target exists but no confirmation is supplied, the request is rejected before candidate creation. If no
target exists, the request terminates as `blocked-no-prior-release` regardless of the supplied confirmation.

## Restoration sequence

1. Resolve the currently deployed record and the most recent prior eligible distinct deployment, then validate the
   requested target matches it.
2. Check out the exact immutable Website revision.
3. Load the release baseline and claim evidence recorded by that revision.
4. Resolve the latest qualifying Runtime Release and separately re-verify that the historical referenced Release
   still exists, is non-draft, and has the expected Release ID, publication time, tag, and tag SHA.
5. If the historical Release is not latest, select `historical-restoration` baseline policy and generate a
   prominent bilingual notice on every generated public HTML page, including recovery/404 output, naming both the
   restored and latest Releases.
6. Run the same Website publication quality gate used for automatic candidates, plus historical-restoration notice
   and dual-Release identity checks when applicable.
7. Rebuild the static output; do not reuse an expiring historical artifact.
8. Create a restore-mode Publication Candidate with `restore-exempt` freshness.
9. Wait for `github-pages` environment approval; self-approval remains permitted.
10. Immediately after approval, reverify the historical Release and the exact latest Release ID, publication time,
    tag, and tag SHA used by the candidate/notice. Any change requires a rebuilt candidate before deployment.
11. Deploy and run the read-only post-deployment route/asset/metadata/security/revision smoke checks.
12. Preserve `website/.publication/restoration-request.json` and create
    `website/.publication/restoration-result.json` using their exact schemas. The Result references the
    Request-owned reason/actor and records acceptance, approval-wait start/end, structured excluded GitHub outage
    intervals, verification completion, restored deployment identity, Website SHA, historical/latest Release
    IDs/publication times/tags/SHAs, and completion status. Record `smokePassedAt` and
    `restorationEffectiveDurationSeconds` only on pass; on failure keep pass fields null and record structured
    `failureDetails`.

The accepted request records the exact target Public Release as well as the target deployment and is uploaded
immediately in a digest-verified preflight artifact. A read-only `if: always()` terminal finalizer authenticates
that artifact and creates the Request/Result-only terminal bundle for `blocked-no-prior-release`,
eligibility/approval rejection, observable cancellation, or failed-before-deployment outcomes; Candidate, Pages
Deployment Record, and Public Release objects are included only when those lifecycle events actually occurred. If
a platform hard-cancel prevents the finalizer from running, later audit reconciliation records incomplete
terminalization from the retained preflight evidence and GitHub run status without fabricating a Result.

## Failure handling

- An ineligible target fails before environment approval.
- A target that is eligible history but is not the most recent prior distinct revision fails before approval.
- A missing, draft, or ID/publication-time/tag/SHA-mismatched historical Runtime Release blocks restoration. A
  historical Release that is valid but no longer latest requires `historical-restoration` policy and the mandatory
  bilingual notice; it is not rejected merely for being older.
- A build or validation failure leaves the current public site unchanged.
- A rejected approval leaves the current public site unchanged.
- A failed restoration deployment is recorded and does not make an arbitrary fallback revision eligible.
- If no most-recent-prior distinct passed deployment has complete terminal evidence, preserve both request/result
  records with Result `status: blocked-no-prior-release`, null target/candidate/deployment identity, and no success
  metric rather than fabricating restoration eligibility.

## Completion target

From acceptance of an authenticated, syntactically valid manual request after its run becomes the active
production-concurrency holder to the first complete public smoke pass, the most recent prior eligible
distinct Website revision SHOULD be restorable within 15 minutes after subtracting recorded GitHub platform outage
intervals and the single protected-environment approval-wait interval.

Each outage exclusion MUST record start/end timestamps, a GitHub Status incident URL or equivalent repository-owner
evidence, recording actor, reason, and overlap seconds within `[acceptedAt, smokePassedAt]`. Exclusions MUST NOT
overlap one another or the approval-wait interval, and `restorationEffectiveDurationSeconds` MUST be recomputable
from the stored timestamps. Failed, rejected, cancelled, degraded, and blocked-no-prior-release results do not have
a restoration duration and MUST keep both `excludedOutageSeconds` and `restorationEffectiveDurationSeconds` null.

## Permanent correction

Restoration is an operational recovery action, not a substitute for fixing `main`. After recovery, maintainers
SHOULD prepare the source correction through the normal pull-request and publication path.
