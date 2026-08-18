# Quickstart: Validate and Publish the OryxOS Official Website

This guide describes the intended end-to-end validation for Feature 003. Commands for new scripts become runnable
after implementation. The guide does not authorize publication until the qualifying Release, content, workflow,
and protected-environment gates all pass.

## 1. Prerequisites

- Repository checkout of `KI9I9/oryxos`
- Node.js version matching `website/.nvmrc`
- npm matching `website/package.json`
- Playwright Chromium
- Git
- GitHub CLI authenticated to the target repository for live Release, Pages, environment, and deployment checks
- Repository-owner or maintainer access for Pages and environment configuration

Confirm the target repository:

```bash
git remote get-url origin
```

Expected:

```text
https://github.com/KI9I9/oryxos.git
```

Confirm Node:

```bash
node --version
npm --version
```

If `gh` is unavailable, live GitHub verification cannot be completed. Stop and ask the repository owner whether
to install it or perform the GitHub checks manually. Do not switch tools, use a different repository, or treat
local tags as published Releases.

## 2. Verify a qualifying GitHub Release exists

Enumerate every paginated Release from the target repository, including prereleases and deterministic ordering
fields:

```bash
gh api --paginate "repos/KI9I9/oryxos/releases?per_page=100" \
  --jq '.[] | {databaseId: .id, name, tagName: .tag_name, isDraft: .draft, isPrerelease: .prerelease, publishedAt: .published_at, url: .html_url}'
```

Inspect the selected candidate:

```bash
gh release view <tag-name> --repo KI9I9/oryxos --json databaseId,name,tagName,isDraft,isPrerelease,publishedAt,url,targetCommitish
```

Fetch and verify the target tag:

```bash
git fetch origin --tags
git ls-remote --tags origin "refs/tags/<tag-name>" "refs/tags/<tag-name>^{}"
git rev-parse "<tag-name>^{commit}"
```

Expected:

- release belongs to `KI9I9/oryxos`;
- release is published and not a draft;
- release has a non-empty tag;
- tag exists on `origin`;
- tracked and remote tag commit SHAs agree;
- when `isPrerelease` is true, the release baseline uses `pre-alpha` or `prerelease`, not `stable`.
- the selected Release has the greatest `publishedAt` among all qualifying Releases; equal timestamps are resolved
  by greater numeric `databaseId`.
- an empty Release `name` is valid; public display falls back to the non-empty `tagName`.

If a newer qualifying Release exists, the tracked older baseline is `stale` and publication stops even when its
individual Release and tag checks pass.

If no qualifying Release exists, **stop**. Website implementation and local validation may continue, but the first
official Pages publication cannot proceed. A repository owner must create and verify a qualifying Release through
the project's release process; do not create or push a tag implicitly from the Website build.

Planning-time evidence found local `v0.1.x-RELEASE` tags that were absent from `origin`, so they must not be reused
without an explicit target-repository release decision.

## 3. Create or refresh the tracked publication baseline

Update the implemented release snapshot and claim evidence records using the verified target Release:

```text
website/data/release-baseline.json
website/data/claim-evidence.json
specs/003-oryxos-pages-publication/publication-discrepancies.yaml
```

Run the implemented local, offline baseline and claim checks:

```bash
cd website
npm run check:release-baseline
npm run check:publication-content
```

Expected:

- all fields required for the current baseline status are present;
- a pre-Release `pending` snapshot uses null Release identity/maturity/evidence fields rather than invented values;
- no draft or local-only tag is accepted;
- an older otherwise-valid Release is rejected when a newer qualifying target Release exists;
- every `available` claim points to release evidence;
- prerelease status is equivalent across English and Chinese content;
- all nine Feature 002 public-deployment blockers have resolved Feature 003 mappings;
- unavailable commands/endpoints are omitted or declared non-executable design examples.

Then perform the live target check:

```bash
npm run check:release-live -- --repository KI9I9/oryxos
```

Expected: the tracked snapshot matches the live GitHub Release and target tag.

## 4. Reconcile official content

Review the qualifying Release tree and artifacts before editing public claims. Synchronize the Website and each
authoritative document identified by the claim inventory.

At minimum, review:

```text
README.md
CLAUDE.md
pom.xml at the release tag
qualifying Release notes and assets
website/index.md
website/architecture.md
website/roadmap.md
website/docs/project/project-status.md
website/docs/getting-started/build-from-source.md
website/docs/interfaces/cli.md
website/docs/interfaces/rest-api.md
website/docs/runtime/*.md
Chinese counterparts under website/zh/
```

Expected:

- repository owner links target `KI9I9`;
- version and maturity match the qualifying Release;
- no current-`main` behavior is called released unless the qualifying Release contains it;
- prerelease status remains visible in both locales;
- no visual-prototype notice or placeholder remains;
- planned syntax is adjacent to a localized non-executable/current-release-unavailable warning;
- Runtime source is not modified merely to make a claim true.

## 5. Reproducible local Website validation

From the Website directory:

```bash
npm ci
npx playwright install chromium
npm run test:publication
```

The publication quality command is expected to include:

```text
script unit tests
workflow policy tests
release baseline validation
claim and discrepancy validation
explicit FR/SC requirement coverage including alphabetic suffixes
authoritative-document consistency checks
publishable-source and generated-output safety scans
asset generation and verification
VitePress production build
generated /oryxos/publication.json validation
deterministic sha256-normalized-file-tree-v1 digest validation
public metadata, sitemap, robots, route, and resource validation
Chromium and axe checks
```

Expected:

- all required bilingual routes remain present;
- no prototype notice or placeholder survives in generated output;
- every planned syntax example is non-executable and release-scoped;
- all canonical, alternate, Open Graph, and social-image URLs use
  `https://ki9i9.github.io/oryxos/`;
- sitemap and robots contain only intended public URLs;
- no required resource bypasses `/oryxos/`;
- publishable source and generated output contain no secret-like credential, private-data pattern, private/link-local
  network address, unapproved analytics/tracking integration, insecure active resource, or privileged Runtime API
  call;
- every required English/Chinese Page pair has equivalent maturity, capability boundaries, primary actions, and
  external destination identities;
- Chromium-only accessibility, responsive, 200% zoom, keyboard, no-JavaScript, and route-integrity checks pass;
- published text and key-control states satisfy WCAG 2.2 AA contrast requirements;
- every rendered semantic image has appropriate localized alternative text and every decorative image is excluded
  from assistive technology;
- no active workflow except the whitelisted publication workflow has deploy capability.

## 6. Inspect the production build locally

```bash
npm run docs:preview -- --host 127.0.0.1 --port 4173
```

Open representative routes:

```text
http://127.0.0.1:4173/oryxos/
http://127.0.0.1:4173/oryxos/zh/
http://127.0.0.1:4173/oryxos/docs/interfaces/cli
http://127.0.0.1:4173/oryxos/zh/docs/interfaces/rest-api
http://127.0.0.1:4173/oryxos/not-a-page
```

Confirm manually:

1. The site presents itself as official, not a visual prototype.
2. The current Release and maturity are visible and equivalent in both locales.
3. Unavailable capability pages do not imply runnable behavior.
4. Planned syntax is clearly non-executable.
5. Focus, mobile navigation, diagrams, social assets, and 200% zoom remain legible.
6. The Website makes no Runtime API call.

## 7. Validate the publication workflow contract

Run the implemented workflow policy gate:

```bash
npm run test:workflow-policy
```

Expected:

- `.github/workflows/ci.yml` runs Runtime verification through `./mvnw -B clean verify`, never system `mvn`;
- read-only Website CI observes `.github/workflows/ci.yml` policy changes, while Runtime-CI-only changes do not
  create an automatic Pages publication candidate;
- exactly one workflow may use official Pages actions;
- only its deploy job has `pages: write` and `id-token: write`;
- the build job has only `contents: read` and `actions: read`;
- the restore-only preflight job has only `contents: read`, `actions: read`, and `deployments: read`, accepts the
  request only after active-slot acquisition, resolves default-branch history, and emits no Pages deployment;
- deploy has only `contents: read`, `actions: read`, `deployments: read`, `pages: write`, and `id-token: write`;
- post-deployment verification has only `contents: read`, `actions: read`, and `deployments: read`;
- pull requests cannot deploy;
- automatic publication is scoped to relevant changes on `main`;
- Website validation and automatic candidates observe `README.md`, `CLAUDE.md`, and `LICENSE`, while an audit-only
  change to `website/data/publication-review.json`, `website/data/deployment-history/**`, or
  `website/data/publication-history/**` cannot create a new publication candidate;
- manual mode accepts only eligible restoration input;
- no-prior, rejected, cancelled, and failed-before-deployment restoration outcomes reach an `if: always()`
  read-only terminal finalizer without requiring nonexistent Candidate/Pages evidence when GitHub schedules that
  finalizer; a hard-cancel that prevents it is recorded later as incomplete terminalization without a fabricated
  Result;
- the deploy job depends on the successful build/artifact job;
- an `if: always()` read-only terminal finalizer declares restore-preflight/build/deploy dependencies, performs
  public smoke only after deployment, and has no Pages/OIDC write permission;
- restore-preflight, provenance, pending-deployment, and terminal evidence cross jobs only through digest-verified
  ordinary artifacts;
- one shared `cancel-in-progress: false` production group covers automatic/restoration execution through public
  verification; `acceptedAt` is created only after a restoration becomes active, not while its dispatch is merely
  pending in GitHub's replaceable concurrency queue;
- post-approval source and exact Release freshness guards are mandatory, and a new automatic run cannot cancel an
  accepted restoration waiting for approval, deploying, or verifying;
- third-party deploy actions and `gh-pages` branch publication remain prohibited.

Because Feature 003 changes Runtime CI policy, separately validate the Runtime after the Workflow edit from the
repository root:

```bash
./mvnw verify
```

Record this result independently from Website validation. Do not invoke Maven from the Website build and do not
treat a Website pass as evidence that the Runtime CI policy change is valid.

## 8. Configure GitHub Pages and the protected environment

In the `KI9I9/oryxos` repository settings:

1. Set Pages source to **GitHub Actions**.
2. Open or create the `github-pages` environment.
3. Add at least one authorized maintainer as a required reviewer.
4. Disable **Prevent self-review** so an authorized change author may approve.
5. Confirm no branch-based Pages source or alternate deploy workflow remains active.

Verify with GitHub CLI when available:

```bash
gh api repos/KI9I9/oryxos/pages
gh api repos/KI9I9/oryxos/environments/github-pages
```

If the settings cannot be read or changed because of permissions, stop, report the failed command and error, and
ask the repository owner to configure or verify them. Do not bypass the environment approval gate.

## 9. Publish an automatic candidate

After the Feature is approved and merged to `main`, observe the official publication workflow:

```bash
gh run list --repo KI9I9/oryxos --workflow "Publish OryxOS website"
gh run watch <run-id> --repo KI9I9/oryxos
```

Expected sequence:

```text
validate release and content
build exact Pages artifact
record candidate-unique Pages artifact name, returned ID, run/attempt, and provenance digest
await github-pages approval
authorized maintainer approves (self-approval allowed)
verify candidate is still current main and its exact latest Release identity is unchanged
prove the Actions API name-to-ID/run mapping and separately verify the name-encoded attempt against trusted outputs
deploy by the exact artifact name
resolve one exact github-pages deployment and contractual approval-release proxy
record a Pages Deployment Record with verification pending
transport pending evidence through a digest-verified ordinary artifact
run read-only public smoke checks against the returned Pages URL
verify /oryxos/publication.json and artifact evidence
on pass, promote the deployment to a Public Release
on failure, preserve a degraded deployment record and initiate protected restoration
upload one sha256-evidence-payload-v1 terminal bundle whose artifact name encodes its manifest digest
record its deterministic name/manifest digest, returned ID/upload-Action digest, and run/attempt outside its payload
```

No public change should occur before environment approval.

The build evidence must contain:

```text
sha256-normalized-file-tree-v1 content digest
candidate-unique official GitHub Pages artifact name
official GitHub Pages artifact ID
GitHub Actions workflow run ID and run attempt
candidate Website SHA
Runtime Release ID, publication timestamp, tag, and SHA
candidate ID
provenance evidence manifest digest
```

The generated tree must not change between digest computation and official Pages artifact upload.

## 10. Verify the live official site

After the Pages deployment action completes, while post-deployment verification is still pending:

```bash
curl -fsSI "https://ki9i9.github.io/oryxos/"
curl -fsSI "https://ki9i9.github.io/oryxos/zh/"
curl -fsS "https://ki9i9.github.io/oryxos/sitemap.xml"
curl -fsS "https://ki9i9.github.io/oryxos/robots.txt"
curl -fsS "https://ki9i9.github.io/oryxos/publication.json"
```

Then run the implemented public-origin smoke suite:

```bash
npm run test:e2e:public -- --base-url "https://ki9i9.github.io/oryxos/"
```

Expected:

- HTTPS public pages and required resources succeed;
- direct deep links and bilingual recovery work;
- published revision and release baseline are traceable;
- no localhost or placeholder origin appears;
- `publication.json` matches the candidate SHA, Runtime Release tag/SHA, candidate ID, and approved origin recorded
  by the Workflow;
- the first complete smoke pass occurs within 10 minutes from contractual `approvalReleasedAt`, the exact protected
  deployment's earliest `in_progress` status timestamp.

Do not mark the review `published` until these checks pass.

If the Pages deployment action completed but these checks fail, the public site may already contain the new bytes.
Record `website/.publication/pages-deployment.json` with failed post-deployment verification, do not create a
successful `website/.publication/public-release.json`, preserve the terminal evidence artifact ID/name/digest/run,
and use the protected restoration path when an eligible target exists.

## 11. Test protected restoration

Resolve paginated GitHub deployment metadata and join it to matching terminal evidence from a retained authenticated
workflow artifact or append-only `website/data/deployment-history/` and `website/data/publication-history/`. Then
choose the most recent prior `github-pages` deployment whose verification passed and whose Website SHA differs from
the current deployment. Repository, workflow run/attempt, candidate, deployment, Pages artifact name/ID, terminal
outcome, terminal artifact name/ID, and evidence digest must agree. Automatic/restore mode and current/superseded lifecycle
do not change that immutable pass result. Manually run restore mode with a reason and, when an eligible target
exists, that deployment identity or Website SHA confirmation; omit confirmation only to produce an auditable
`blocked-no-prior-release` result when no target exists.

Order eligible history by descending completion time, then descending numeric GitHub deployment ID when completion
timestamps tie.

Expected:

- arbitrary, failed, older non-most-recent, same-current-revision, expired-unreconciled, ambiguous, and
  contradictory evidence is rejected;
- the eligible revision is checked out, rebuilt, and fully revalidated;
- the prior Runtime Release baseline is reverified for existence, non-draft status, and exact ID/publication
  time/tag/SHA, while the latest qualifying Runtime Release is resolved separately;
- when those Release identities differ, every generated public HTML page, including translation-recovery and 404
  output, displays the bilingual notice naming both Releases and does not present the historical baseline as latest;
- the same environment approval is required;
- immediately after approval, the historical and exact latest Release ID/publication-time/tag/SHA identities are
  reverified; any change rebuilds rather than deploying stale notice content;
- the restored public revision is recorded;
- the current site remains unchanged if validation, approval, or the Pages deployment action fails before
  completion; a smoke failure after completion is recorded as a degraded deployment and requires restoration;
- both `website/.publication/restoration-request.json` and `website/.publication/restoration-result.json` are
  preserved; the request owns reason/actor and the result owns terminal evidence;
- the request/result pair records authenticated syntactically-valid acceptance, one approval-wait start/end,
  smoke-pass time, and
  `restorationEffectiveDurationSeconds`;
- every outage deduction records a start/end interval, GitHub Status incident URL or equivalent owner evidence,
  actor, reason, and overlap seconds; overlapping or free-form deductions are rejected;
- the most recent prior eligible distinct revision can be restored within 15 effective minutes from accepted
  request to smoke pass, excluding recorded approval wait and GitHub outages.
- when no prior distinct passed deployment has complete terminal evidence, the Result records
  `blocked-no-prior-release` with null target/candidate/deployment identity and no success metric.

## 12. Final review record

Record final evidence in the implemented Feature 003 publication review file:

```text
Website commit SHA
qualifying GitHub Release and tag SHA
resolved Feature 002 discrepancies
English/Chinese content review
metadata and discovery review
Chromium results
workflow-policy results
environment configuration evidence
external-link results
deployment ID and public URL
Pages deployment verification status and degraded evidence when applicable
post-deployment smoke results
terminal evidence artifact name/manifest digest, returned ID/upload-Action digest, and workflow run/attempt
requirement-coverage result
```

Before Workflow candidate creation, the tracked record uses a publication-relevant source-tree digest and leaves
`websiteCommitSha` null. Candidate, artifact, deployment, and timing evidence is emitted by Workflow outside the
candidate source tree. A later audit-only commit may reconcile the exact deployed SHA and set `published`; that
audit-only commit is not the deployed candidate and must not trigger automatic republication.

Valid decisions progress as:

```text
blocked -> changes-requested -> approved-for-publication -> published
```

`approved-for-publication` authorizes the exact reviewed source-tree digest and still requires Workflow binding to
an exact commit SHA plus protected-environment approval. `published` requires a passed Pages Deployment Record that
qualifies as a successful Public Release; a degraded deployment cannot set this decision.
