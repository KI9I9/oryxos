# Research: OryxOS GitHub Pages Publication

**Feature**: `003-oryxos-pages-publication`

**Date**: 2026-08-18

## Decision 1: Publish only to the target repository project site

**Decision**: Use the default GitHub Pages project site for `KI9I9/oryxos`, with the approved public base
`https://ki9i9.github.io/oryxos/`. Keep the existing `/oryxos/` VitePress base and do not introduce a custom
domain in this Feature.

**Rationale**: The current site, route helpers, assets, locale switching, build validators, and Playwright tests
already model `/oryxos/`. A project site is the smallest publication change and avoids DNS, certificate, redirect,
and ownership work unrelated to the requested first official release.

**Alternatives considered**:

- **Custom domain**: deferred because the user did not request one and no domain-ownership or DNS policy exists.
- **User/organization site at the domain root**: does not match the target repository or current route model.
- **Publish a separate preview repository**: rejected because the user selected the official website, not a public
  preview.

## Decision 2: A live GitHub Release, not a local tag, is the claim baseline

**Decision**: Select the latest qualifying release from the target `KI9I9/oryxos` GitHub repository. It must be a
published, non-draft GitHub Release bound to an explicit tag. Prereleases qualify only when the public site labels
the corresponding maturity as pre-alpha or prerelease in both locales. Order qualifying Releases by descending
`publishedAt`, then by descending numeric GitHub Release ID when timestamps tie. Snapshot the selected release in
a repository-owned baseline record and verify both its identity and latest-selection status against live GitHub
metadata in the publication gate.

**Rationale**: Local tags alone do not prove that the target repository publicly released a version. The website
must build reproducibly from tracked data, while the publication workflow must also prove that the tracked release
record still matches the target repository.

**Planning evidence**:

- The local clone contains lightweight tags `v0.1.0-RELEASE`, `v0.1.1-RELEASE`, and `v0.1.2-RELEASE`.
- `v0.1.2-RELEASE` resolves locally to commit `fbe8c87e17cfad58391bfc399b0f72902c6bc2b1`.
- The target `origin` is `https://github.com/KI9I9/oryxos.git`.
- `git ls-remote --tags origin` returned no matching release tags.
- The local `v0.1.2-RELEASE` commit is not an ancestor of the current Feature branch; the histories differ by
  111 commits on the tag side and 6 commits on the Feature-branch side.
- The current environment has no `gh` executable, so live Release and Pages metadata could not be queried during
  planning. This does not justify treating local tags as releases.

**Consequences**:

- First publication is blocked until the target repository contains a qualifying GitHub Release.
- Imported or upstream-only tags are not acceptable evidence for `KI9I9/oryxos`.
- A tracked otherwise-valid Release becomes `stale` when a newer qualifying target Release exists.
- The Website implementation can be completed and locally validated while the live release gate remains closed,
  but the Feature cannot record a successful official publication until that external prerequisite is satisfied.

**Alternatives considered**:

- **Use the latest local tag**: rejected because it is not present on the target remote and does not prove a target
  GitHub Release.
- **Use the current `main` commit**: rejected by clarification; unreleased behavior cannot support availability
  claims.
- **Call the GitHub API during every static build**: rejected because ordinary local builds must remain
  reproducible and not depend on network availability.

## Decision 3: Keep build-time release data in a tracked snapshot

**Decision**: Add a tracked release-baseline record under `website/data/` as a status-discriminated snapshot. A
`pending` record contains the target repository and null Release identity fields without inventing a tag, SHA, URL,
name, publication time, or maturity. `verified` and `stale` records contain the complete observed GitHub Release
identity, tag, release commit SHA, publication timestamp, prerelease flag, public URL, verification time, and
evidence provenance. A `rejected` record preserves all metadata actually observed, keeps genuinely missing or
malformed identity fields null, and records explicit rejection reasons rather than inventing values. Static content
and metadata read only this snapshot. A separate publication check compares it with all live qualifying Releases
and the selected target tag before deployment.

**Rationale**: This separates deterministic static generation from live external verification. It also makes
content reviews and rollbacks explainable because every Website revision names the exact Runtime release whose
capabilities it describes.

**Alternatives considered**:

- **Embed version strings independently in Markdown**: creates drift across locales and pages.
- **Fetch release data client-side**: makes core content network-dependent and exposes visitors to inconsistent
  content.
- **Generate the snapshot only as a CI artifact**: prevents local validation and loses repository review history.

## Decision 4: Use a claim-evidence inventory for high-risk public statements

**Decision**: Maintain a bilingual claim-evidence inventory for positioning, maturity, version, build, CLI, REST,
Provider, ReAct Loop, Tool, Memory, Skill/Profile, security-property, governance, affiliation, and adoption
statements. Each public claim records its routes/locales, availability state, release evidence or authoritative
decision, and public handling. `available` requires qualifying-release evidence. `in-development`, `planned`, and
`vision` require explicit non-availability handling and must not imply release support, certification,
organizational affiliation, or adoption evidence that the qualifying Release does not establish.

**Rationale**: Feature 002 intentionally avoided assigning real states. Official publication needs a reviewable
bridge between public prose and evidence, but a full CMS or runtime-generated claim service would be excessive.

**Alternatives considered**:

- **Trust free-form prose review only**: too easy for bilingual or page-level drift to reintroduce unsupported
  claims.
- **Require evidence for every sentence**: too costly and noisy; the inventory targets claims that can alter user
  expectations about maturity or usability.
- **Infer available capabilities from current source**: rejected because the selected baseline is the qualifying
  GitHub Release, not unreleased `main`.

## Decision 5: Preserve unavailable topic routes with non-executable examples

**Decision**: Keep the existing bilingual CLI, REST API, and other unavailable-capability routes. Replace prototype
placeholders with public status content. Planned command or endpoint syntax may remain only inside a dedicated
design-example treatment that states, in the active locale, that the current release does not provide it and that
it must not be executed.

**Rationale**: This preserves stable navigation and deep links while satisfying the user's desire to show the
future documentation form. A machine-readable example classification lets content validators distinguish a
non-executable design illustration from released instructions.

**Alternatives considered**:

- **Delete unavailable pages**: loses stable routes and hides the intended product surface.
- **Hide pages from navigation**: creates inconsistent discovery and does not remove the risk for deep-link users.
- **Show examples as runnable**: violates the Constitution and the selected formal-release evidence rule.

## Decision 6: Replace prototype state with public release state

**Decision**: Remove global draft notices, prototype-only page status, placeholder labels, and prototype wording.
Introduce a public release-status treatment driven by the release baseline. When the baseline is a prerelease, show
a consistent pre-alpha/prerelease notice on every locale-owned page and use release-aware status sections on
capability pages. Keep limitations visible as public content rather than placeholders.

**Rationale**: The user selected an official site rather than a public prototype. Removing the draft notice without
adding a release status would overstate maturity; the release-driven notice communicates an official but
pre-release project accurately.

**Alternatives considered**:

- **Retain “Draft visual prototype” publicly**: contradicts the selected official-site mode.
- **Remove every status notice**: makes a prerelease look stable.
- **Use a manually duplicated version banner in Markdown**: risks locale and route drift.

## Decision 7: Generate absolute public metadata and discovery files

**Decision**: Centralize the public origin and produce absolute canonical URLs, `hreflang` alternatives,
`x-default`, `og:url`, absolute social-image URLs, sitemap entries, and a repository-owned `robots.txt` that points
to the sitemap. Exclude test fixtures, translation test routes not intended for indexing, ordinary artifacts, and
retired paths. Preserve the bilingual custom `404.html` without prototype language.

**Rationale**: Feature 002 deliberately used relative metadata because no origin was approved. Official
publication now has an approved origin and requires deterministic crawler and social-sharing behavior.

**Alternatives considered**:

- **Relative canonical URLs**: invalid for canonical and sharing identity.
- **Canonicalize Chinese pages to English**: collapses distinct localized pages and harms language discovery.
- **Rely on GitHub Pages defaults for sitemap and robots**: does not encode the project route inventory or locale
  exclusions.

## Decision 8: Separate validation from privileged deployment

**Decision**: Keep a read-only Website validation workflow for pull requests and pushes that affect Website source,
Feature 003 governance, Website workflows, Runtime CI policy (`.github/workflows/ci.yml`), or the fixed
authoritative-document trigger set (`README.md`, `CLAUDE.md`, and `LICENSE`). Add one explicitly whitelisted Pages
publication workflow whose `main` automatic trigger set includes the publication-relevant paths but excludes the
Runtime-only CI workflow and audit-only publication-review/deployment-history/publication-history transitions, plus
protected manual restoration. Restore mode first uses a non-deploying preflight with `contents/actions/deployments`
read access to accept the active request and resolve eligible history. The build job uses only `contents/actions`
read permissions and runs the complete publication quality gate against the current repository, including Runtime
CI Wrapper compliance. Only the deploy job receives `pages: write` and `id-token: write`; it uses the protected
`github-pages` environment, runs Pages configuration, and consumes the exact artifact name produced for that
candidate. An `if: always()` read-only terminal finalizer performs public verification after deployment or records
state-conditional Request/Result-only evidence for a restoration that ended earlier.

Because Feature 003 changes Runtime CI policy, the implementation also runs and records the Runtime gate through
the committed `./mvnw verify` independently from the Website publication gate. The Website build remains independent
of Maven; the separate Runtime result proves the cross-project policy edit rather than making Runtime a Website
build dependency.

**Rationale**: Job-level permissions preserve least privilege and make it impossible for ordinary validation to
publish. A single official deployment workflow is easier to audit than multiple deploy-capable paths.

**Alternatives considered**:

- **Add deployment permissions to website CI**: unnecessarily grants PR/push validation a publication credential.
- **Publish a `gh-pages` branch with Git**: adds mutable branch state and broader repository-write behavior.
- **Manually upload built files outside Actions**: weakens traceability and reproducibility.

## Decision 9: Protected environment permits self-approval

**Decision**: Configure the `github-pages` environment with at least one authorized maintainer reviewer and leave
“prevent self-review” disabled. All required checks must pass before the deploy job reaches the environment gate,
but an authorized change author may approve their own publication.

**Rationale**: This implements the user's explicit choice and supports a single-maintainer repository while still
preventing unapproved automatic publication.

**Alternatives considered**:

- **No approval gate**: rejected by the selected protected-publication mode.
- **Require an independent reviewer**: rejected by clarification.
- **Require two reviewers**: unnecessary for the current maintenance model.

## Decision 10: Serialize production runs and verify freshness after approval

**Decision**: Use one workflow-level production concurrency group with `cancel-in-progress: false`, shared by
automatic and restoration runs through post-deployment verification. GitHub may replace an older pending group
entry when another run queues, so restoration `acceptedAt` is created only after its run becomes the active group
holder; a merely pending dispatch has no Restoration Request or timing metric. After environment approval and
immediately before deployment, verify
that an automatic candidate still represents current `main` and the same latest qualifying Runtime Release
ID/publication time/tag/SHA used by its artifact. Restore mode is exempt from the current-`main` check but reverifies
its historical Release and the exact latest Release identity used by its notice. A stale run fails without changing
the site and must rebuild. Native stale-run cancellation is not used because GitHub concurrency cannot make its
decision from the mode of the already-running workflow and could cancel a protected restoration.

**Rationale**: Environment approval can leave a run waiting while newer commits or Releases arrive. Serialization
prevents overlapping deploy/verification windows, while final source and Release checks close the race without
cancelling an accepted restoration that is waiting for approval, deploying, or verifying.

**Alternatives considered**:

- **Cancel stale automatic runs in the shared group**: can cancel a restoration because the existing run's mode is
  not available to the new run's concurrency expression.
- **Rely on approval timing alone**: not machine-verifiable.
- **Block restoration because its SHA is not current `main`**: makes rollback impossible.

## Decision 11: Restore by rebuilding a previously successful deployment revision

**Decision**: Provide a protected manual restoration path for the most recent prior eligible deployment whose
Website revision differs from the currently deployed revision. Resolve that target from paginated GitHub deployment
metadata plus matching terminal evidence in a retained authenticated workflow artifact or append-only tracked
deployment/publication history. The immutable post-deployment verification must have passed, regardless of
automatic/restore mode or current/superseded lifecycle, ordered by descending completion time then descending
numeric GitHub deployment ID when times tie. The manual deployment identity or SHA is a confirmation input and must
match the resolved target. Check out that immutable revision, re-run the Website quality gates, rebuild the static
artifact, require environment approval, and redeploy. Do not reuse an old Pages artifact or permit an arbitrary
older successful revision.

Restore mode verifies two Release identities separately. It always resolves the latest qualifying Runtime Release.
It also verifies that the historical baseline recorded by the selected Website deployment still exists, remains
published and non-draft, and retains the expected Release ID/publication timestamp/tag/SHA. If those Releases
differ, restoration is allowed only
as an emergency historical-baseline deployment: every generated public HTML page, including recovery/404 output,
renders a prominent notice that names the restored historical baseline and the latest qualifying Runtime Release and
states that the restored Website does not describe the latest Runtime release. The restored historical baseline is
not promoted to the tracked automatic-publication baseline and does not weaken latest-Release selection for normal
publication.

**Rationale**: Git history is the durable source for static source, while append-only terminal evidence proves that
the revision actually crossed the protected environment and passed public smoke verification. Rebuilding proves
that the target remains reproducible and avoids relying solely on short artifact-retention periods.

**Alternatives considered**:

- **Reuse an old Actions artifact**: artifacts expire and may not retain sufficient provenance.
- **Revert source and merge a new commit first**: useful for permanent correction but too slow for the specified
  15-minute restoration goal.
- **Deploy any arbitrary SHA**: allows unapproved content to bypass publication history.

## Decision 12: Replace the blanket deployment prohibition with an allowlist policy

**Decision**: Refactor workflow policy validation so all workflows remain non-deploying by default. Permit Pages
actions, the `github-pages` environment, and deployment permissions only in the named publication workflow and
only in the deploy job. Require the expected trigger, branch, environment, permissions, job dependency, concurrency,
release gate, and artifact handoff. Continue rejecting third-party Pages deployment actions and branch-push
publication.

**Rationale**: Deleting the old test would remove a valuable security control. A narrow allowlist preserves the
Feature 002 safety intent while authorizing the new, reviewed publication path.

**Alternatives considered**:

- **Remove workflow-policy tests**: weakens regression protection.
- **Allow Pages actions in every workflow**: violates least privilege.
- **Keep the blanket prohibition**: makes this Feature impossible.

## Decision 13: Extend the existing Chromium-only quality gate

**Decision**: Keep Node script tests, content validation, deterministic asset generation, type checking, VitePress
build validation, Playwright Chromium, and axe. Replace prototype-specific assertions with publication assertions
for release evidence, public status, canonical metadata, sitemap/robots, design-example labeling, workflow
authorization, and no-JavaScript public content. Add a dedicated scanner over publishable Website source and the
generated static output for secret-like credentials, private data patterns, internal network addresses, unapproved
analytics/tracking integrations, insecure active resources, and privileged Runtime API calls. Run post-deployment
checks against the real Pages URL in the publication workflow as well as the final maintainer review.

Accessibility evidence is not limited to representative axe results. Generated-output checks enumerate semantic
images across every public page, require appropriate localized alternative text, and require decorative images to
be excluded from assistive technology. Shared theme tokens and every published text/key-control interaction state
are checked against WCAG 2.2 AA contrast thresholds, with focused manual verification for states that cannot be
reliably derived from static output.

**Rationale**: Feature 002 already has broad structural and browser coverage. Extending it is lower risk than
starting a second test stack and respects the clarified Chromium-only policy.

**Alternatives considered**:

- **Add Firefox as a release requirement**: explicitly rejected by the user.
- **Validate only the deployed home page**: misses deep links, locale behavior, metadata, and resources.
- **Use screenshots as the primary gate**: brittle for bilingual content and weak for semantic correctness.

## Decision 14: Reconcile authoritative documents without changing Runtime behavior

**Decision**: Audit the release baseline first, then synchronize `README.md` and only the authoritative documents
that contain public positioning, maturity, version, build, interface, capability, governance, or asset statements.
Do not edit Runtime source to make a website claim true. Preserve Feature 002 as historical evidence and create a
Feature 003 discrepancy closure record that references each prior discrepancy.

**Rationale**: The current README contains old organization links, retired asset paths, a `1.0.0-SNAPSHOT` badge,
and broad capability statements. The current working-tree Runtime is also materially different from the local
`v0.1.2-RELEASE` tree, proving that current prose and source cannot be treated interchangeably. The new Feature
must make the evidence boundary explicit rather than rewriting history.

**Alternatives considered**:

- **Modify Feature 002 discrepancy history in place**: loses the original prototype review snapshot.
- **Rewrite all class/tutorial documents**: unnecessarily broad; only documents designated authoritative for
  public claims belong in this Feature.
- **Implement missing Runtime capabilities**: outside Website publication scope.

## Decision 15: Keep the Website independent and free of runtime secrets

**Decision**: Continue producing static files with no Runtime process, API, database, account, CMS, analytics, or
tracking dependency. GitHub publication credentials remain ephemeral GitHub-issued permissions; no deploy token,
API key, or private credential is stored in Website source or configuration.

**Rationale**: This follows the Constitution and limits the public attack surface. GitHub Pages' official OIDC
deployment path does not require a repository secret for Pages publication.

**Alternatives considered**:

- **Use a personal access token**: broader, long-lived credential with avoidable rotation risk.
- **Fetch Runtime status dynamically**: would couple public content to an internal service and expose operational
  state.
- **Add analytics during publication**: not requested or approved.

## Decision 16: Use deterministic artifact and public revision evidence

**Decision**: Use the same normalized sorted-path/file-hash manifest technique for two distinct SHA-256 identities.
`sha256-publication-source-tree-v1` covers publication-relevant Website, Feature 003, Website workflow, README,
CLAUDE, and LICENSE inputs while excluding generated/dependency/report paths, `.publication/`, and the tracked
`website/data/publication-review.json`, `website/data/deployment-history/**`, and
`website/data/publication-history/**` audit evidence. Workflow
recomputes it to bind human review to the exact candidate without self-reference. After all generated files,
including public revision metadata, are present and before Pages upload, `sha256-normalized-file-tree-v1` covers the
complete generated tree. Record the generated content digest, digest algorithm, run-attempt-unique Pages artifact
name, returned artifact ID, candidate SHA, Runtime release tag/SHA, and workflow run/attempt identity outside the
Pages tree.
Generate `/oryxos/publication.json` inside the public tree with the non-secret candidate SHA, Runtime release
tag/SHA, candidate ID, and approved origin. Transfer restore-preflight, candidate, pending-deployment, and terminal
evidence between isolated jobs through ordinary artifacts using `sha256-evidence-payload-v1`. For each upload,
record the deterministic name/payload-manifest digest, returned artifact ID/upload-Action digest, and workflow
run/attempt context as distinct out-of-payload values. Before deployment, use the Actions Artifacts API to prove
that the exact Pages artifact name resolves to the recorded ID and workflow run, then separately require the
run/attempt encoded in the name to equal the Candidate, trusted build outputs, and current workflow context.
`actions/deploy-pages` consumes the name, not the numeric ID.

**Rationale**: GitHub's uploaded artifact packaging is implementation-controlled, so a repository-defined file-tree
digest provides deterministic content identity while the GitHub artifact ID proves which uploaded object was
deployed. Generated public metadata avoids the impossible requirement for a committed file to contain the SHA of
the commit that contains itself.

**Alternatives considered**:

- **Hash the compressed GitHub artifact**: packaging metadata may not be reproducible or available to later jobs.
- **Commit the candidate SHA into `publication-review.json` before the candidate commit exists**: self-referential
  and impossible to make exact.
- **Expose workflow tokens or internal evidence**: unnecessary and unsafe; only non-secret revision identity is
  public.

## Decision 17: Measure publication and restoration with explicit timestamps

**Decision**: Publication duration starts at contractual `approvalReleasedAt`, the exact protected deployment's
earliest `in_progress` status timestamp, and ends at the first complete post-deployment smoke pass; it is stored as
`publicationEffectiveDurationSeconds`. Restoration duration starts when an active production-concurrency holder
accepts an authenticated, syntactically valid manual request before eligibility resolution and ends at its first
complete smoke pass; the recorded
single environment-approval waiting interval and GitHub platform outage intervals are subtracted and the result is
stored as `restorationEffectiveDurationSeconds`. A dispatch still pending in GitHub's replaceable concurrency slot
is not accepted and has no metric. Each excluded outage is a structured interval with start/end timestamps,
a GitHub Status incident URL or equivalent repository-owner evidence, recording actor, reason, and overlap seconds
within the restoration window. The effective duration is recomputed from those intervals; free-form or overlapping
deductions are rejected.

**Rationale**: The 10-minute and 15-minute goals are otherwise not reproducible or auditable. Explicit timestamps
separate workflow performance from human approval delay and external platform outages.

**Alternatives considered**:

- **Measure from commit push**: conflates unrelated queue and review time with publication execution.
- **Use an unrecorded stopwatch**: cannot support the final publication review.

## Decision 18: Separate Pages deployment from verified Public Release

**Decision**: A completed `actions/deploy-pages` operation creates a Pages Deployment Record with post-deployment
verification initially pending. A complete smoke pass promotes that deployment to a successful Public Release. A
smoke failure changes the public site but remains a degraded deployment, records structured failure evidence, and
does not enter Successful Release History. The preceding passed Public Release remains the last known good recovery
target. Validation failure, approval rejection, cancellation, or Pages deployment failure before a new deployment
completes must preserve the current public deployment identity exactly.

**Rationale**: Deployment and verification happen at different times. Treating an unverified or failed-smoke
deployment as a successful release contradicts the recovery model and hides the fact that public bytes may already
have changed.

**Alternatives considered**:

- **Call every completed deploy action a Public Release**: conflates public exposure with verified success.
- **Claim post-deployment smoke failure causes no public change**: operationally false because deployment completed.
- **Automatically deploy an arbitrary fallback**: bypasses the protected approval and restoration contracts.
