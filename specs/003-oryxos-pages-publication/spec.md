# Feature Specification: OryxOS GitHub Pages Publication

**Feature Branch**: `003-oryxos-pages-publication`

**Created**: 2026-08-17

**Status**: Draft

**Input**: User description: "之前开发的官网要使用GitHub的page进行发布"

## Clarifications

### Session 2026-08-17

- Q: Should the existing visual prototype be published as a labeled public preview or promoted to the official website? -> A: Publish it as the official website only after resolving the content discrepancies that currently block public deployment.
- Q: How should publication be triggered after changes reach the main branch? -> A: Successful quality validation should advance the candidate to a protected publication environment that requires explicit maintainer approval.
- Q: Which approved baseline should support all availability claims on the official website? -> A: Use only the latest qualifying published, non-draft GitHub Release bound to an explicit target-repository Git tag; a bare tag and unreleased `main` behavior do not qualify.
- Q: What should happen if no verified qualifying GitHub Release exists? -> A: Block the first GitHub Pages publication until one is created and verified; do not substitute a bare tag or unreleased `main` revision.
- Q: How should topic pages represent commands or endpoints that the formal release does not provide? -> A: Keep the bilingual pages and show planned syntax only as explicitly non-executable design examples that are unavailable in the current release.
- Q: What release record qualifies as the official website baseline? -> A: A published, non-draft GitHub Release bound to an explicit Git tag qualifies; a prerelease may qualify only when all relevant English and Chinese pages clearly identify its pre-alpha or prerelease status.
- Q: Who must approve a candidate in the protected GitHub Pages environment? -> A: At least one authorized maintainer must approve it, and the change author may approve their own publication; an independent second reviewer is not required.

### Analysis Resolutions 2026-08-18

- "Latest qualifying GitHub Release" means the qualifying target-repository Release with the greatest
  `publishedAt` value; if two qualifying Releases have the same publication timestamp, the greater numeric GitHub
  Release ID wins. A tracked older baseline is stale and blocks publication.
- Restoration targets the most recent prior eligible deployment whose Website revision differs from the currently
  deployed revision, ordered by deployment completion time then numeric GitHub deployment ID when timestamps tie.
  This Feature does not permit selecting an arbitrary older successful deployment.
- Publication duration starts at contractual `approvalReleasedAt`, the exact protected deployment's earliest
  `in_progress` status timestamp, and ends at the first complete public smoke pass. Restoration duration starts
  when the active production-concurrency holder accepts the manual request and ends at the first complete smoke
  pass, excluding the recorded approval-wait interval and GitHub platform outages.
- Candidate artifact identity uses a deterministic SHA-256 digest of the normalized generated file tree plus a
  candidate-unique GitHub Pages artifact name and its proven artifact ID/workflow run/attempt. Public revision
  traceability uses a generated `/oryxos/publication.json` record rather than a self-referential commit field inside
  the candidate source revision.
- Before candidate creation, the publication review authorizes a publication-relevant source tree by its
  `sha256-publication-source-tree-v1` digest. The Workflow binds that reviewed tree to an exact `main` commit SHA;
  the digest is the approved revision identity before the commit binding exists, not a retrospective approval.
- A restore-mode candidate MAY use the historical Runtime Release baseline of its previously verified deployment
  even when a newer qualifying Runtime Release exists, but only when the historical Release remains published,
  non-draft, and retains the expected Release ID, publication timestamp, tag, and tag SHA. Every generated public
  HTML page, including translation-recovery and bilingual 404 output, MUST then show a prominent bilingual
  historical-restoration notice naming both the restored baseline and the latest qualifying Runtime Release.
- A successful Pages deployment and a verified Public Release are distinct lifecycle events. Deployment creates a
  Pages Deployment Record; only a complete public smoke pass promotes that record to a Public Release. A failed
  post-deployment smoke check records a degraded deployment and requires protected restoration when eligible.
- Requirement identifiers are stable strings and tooling MUST support alphabetic suffixes such as `FR-004A`; it
  MUST NOT infer a numeric range and silently omit suffixed requirements.
- Automatic and restoration runs share one `cancel-in-progress: false` production concurrency group through public
  smoke verification. Restoration acceptance occurs only after active-slot acquisition. Post-approval source and
  Release freshness checks reject stale automatic candidates; a new automatic run MUST NOT cancel an accepted
  restoration waiting for approval, deploying, or verifying.
- Successful/degraded terminal evidence crosses isolated jobs through digest-verified ordinary artifacts and is
  reconciled into append-only deployment/publication history. Restoration eligibility MUST NOT depend on an
  unshared runner workspace, an ordinary review artifact, or unauthenticated deployment metadata alone.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visit the Trustworthy Official Website (Priority: P1)

A visitor can open the official OryxOS GitHub Pages project address and browse the complete English and Chinese website as an authoritative public project surface. The site clearly communicates the project's verified maturity, current capabilities, limitations, contribution paths, and long-term direction without retaining visual-prototype notices or presenting unverified behavior as available.

**Why this priority**: Public access is the core business outcome, but publication is only valuable if visitors can trust the claims and distinguish released behavior from plans and vision.

**Independent Test**: Open the official project address in a new browser session, visit every core English and Chinese journey, and verify that the site is publicly reachable, internally consistent, free of prototype-only notices, and limited to evidence-backed public claims.

**Acceptance Scenarios**:

1. **Given** an approved website release has been published, **When** a visitor opens the official project address, **Then** the English home page loads below the repository project path over a secure connection.
2. **Given** a visitor selects Chinese from any page with an equivalent translation, **When** the locale switch is activated, **Then** the equivalent Chinese page opens under `/zh/` without losing the page's purpose.
3. **Given** the project remains at an early maturity stage, **When** a visitor reads the home, status, architecture, or roadmap content, **Then** the same approved maturity statement and evidence-backed capability boundaries appear across those surfaces.
4. **Given** a command, endpoint, capability, version, or build procedure has not been verified against the approved release baseline, **When** public content is reviewed, **Then** it is omitted or explicitly described as unavailable rather than presented as usable.
5. **Given** a visitor follows an internal deep link or opens a bookmarked documentation route, **When** the route is requested directly, **Then** the correct page and required assets load under the official project path.
6. **Given** a retained topic page describes syntax planned beyond the approved release, **When** a visitor reads its command or endpoint example, **Then** the page identifies the example as a non-executable design illustration and states that the current release does not provide it.

---

### User Story 2 - Approve and Publish a Verified Release (Priority: P2)

A maintainer can merge an approved website change to the designated publication branch, observe all required validation results, review the exact publication candidate, and explicitly approve promotion to the public GitHub Pages environment. The public site must correspond to the approved repository revision.

**Why this priority**: A protected and traceable publication path prevents provisional, broken, or unreviewed content from becoming the official website.

**Independent Test**: Prepare a valid publication candidate, complete all required checks, approve it through the protected publication boundary, and verify that the resulting public release identifies and matches the approved revision.

**Acceptance Scenarios**:

1. **Given** a change reaches the designated publication branch, **When** any required content, build, link, accessibility, or browser validation fails before Pages deployment completes, **Then** no new public release is created and the current public deployment identity remains unchanged.
2. **Given** all required checks pass, **When** no authorized maintainer approval has been granted, **Then** the candidate remains unpublished.
3. **Given** all required checks pass and at least one authorized maintainer approves the candidate, **When** publication completes, **Then** the public site serves the exact approved revision and records a traceable publication result; the approver may also be the change author.
4. **Given** a pull request or non-publication branch is validated, **When** its checks complete, **Then** it cannot replace the official public site.
5. **Given** two candidates are prepared close together, **When** publication is approved, **Then** an older in-progress candidate cannot overwrite a newer approved release.

---

### User Story 3 - Discover and Share Localized Public Pages (Priority: P2)

A visitor, search crawler, or social-sharing service can identify the preferred public URL, language, description, and sharing image for each official page. English and Chinese pages identify one another as language alternatives and avoid draft-only indexing behavior.

**Why this priority**: An official website must be discoverable and shareable with accurate localized metadata rather than behaving like an internal prototype.

**Independent Test**: Inspect representative English and Chinese public pages and verify their public URLs, language alternatives, indexability, sitemap presence, descriptions, and social-sharing metadata against the approved public origin.

**Acceptance Scenarios**:

1. **Given** a public English or Chinese page, **When** its metadata is inspected, **Then** it declares one preferred absolute public URL and the correct localized alternative.
2. **Given** the official site is eligible for discovery, **When** a crawler requests the site's discovery files, **Then** it receives public-origin URLs for all intended indexable pages and no retired or internal-only routes.
3. **Given** a public page is shared, **When** a sharing service reads its metadata, **Then** the localized title, description, image, image alternative text, and public URL describe that page accurately.
4. **Given** a visitor requests a missing route, **When** the not-found experience appears, **Then** it offers valid English and Chinese recovery destinations under the public project path.

---

### User Story 4 - Recover from a Publication Problem (Priority: P3)

A maintainer can identify a failed or harmful public release and restore the most recent approved successful version without requiring an OryxOS Runtime service or reconstructing website content manually.

**Why this priority**: Publication failures are less frequent than ordinary visits, but a public project surface needs a predictable recovery path that limits downtime and prevents an unsafe revision from remaining live.

**Independent Test**: Publish a controlled candidate in the release process, designate it as unsuitable, restore the prior successful release, and confirm that the public URL serves the prior approved content with a recorded recovery result.

**Acceptance Scenarios**:

1. **Given** a publication attempt fails before promotion, **When** the failure is reported, **Then** the existing public website remains unchanged and the failure identifies the affected candidate.
2. **Given** a newly published revision has a critical content or routing defect, **When** an authorized maintainer selects the previous approved release for restoration, **Then** that release can be republished through the same protected boundary.
3. **Given** restoration completes, **When** the public site is checked, **Then** the restored revision is identifiable and all mandatory public routes remain available.
4. **Given** the prior Website deployment describes an older Runtime Release than the latest qualifying Release, **When** it is restored, **Then** every public page identifies the historical restored baseline and the latest qualifying Release without presenting the restored baseline as current.

### Edge Cases

- A publication candidate is approved while a newer candidate is still being validated.
- The public host reports success before all project-path assets are globally available.
- A direct deep link works locally but fails when served below the repository project path.
- The publication environment is not configured, is renamed, or does not require an authorized reviewer.
- Repository Pages settings point at an unintended source or a different public origin.
- A required external repository, license, governance, or contribution destination changes after content approval.
- English and Chinese content diverge during the final reconciliation of maturity or capability claims.
- A canonical URL, language alternative, sitemap entry, social image, or favicon still refers to a local or placeholder origin.
- A failed release leaves an ordinary build artifact but no valid public deployment.
- A restoration request targets a revision that never passed the official publication gate.
- GitHub Pages is temporarily unavailable while the previously published website remains the last known successful release.
- A generated file or dependency cache is accidentally included as source input for the publication candidate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Feature MUST publish the OryxOS website through the GitHub Pages project site associated with the approved `KI9I9/oryxos` repository.
- **FR-002**: The official site MUST continue to serve English from the project root and Simplified Chinese from `/zh/`, with all website routes and assets resolving below the repository project path.
- **FR-003**: Publication MUST remain blocked until every open discrepancy marked as blocking public deployment in Feature 002 is resolved, replaced by an approved evidence-backed statement, or removed from public content.
- **FR-004**: The final publication review MUST identify the latest qualifying GitHub Release as the sole availability-claim baseline for project positioning, maturity, version references, build instructions, CLI behavior, public interfaces, and runtime capabilities. Latest MUST be selected by descending `publishedAt`, then descending numeric GitHub Release ID when timestamps tie. A qualifying release MUST be published, non-draft, and bound to an explicit Git tag. An older otherwise qualifying Release MUST be treated as stale when a newer qualifying Release exists. Unreleased behavior present only on `main` MUST NOT qualify as publicly available. Automatic mode MUST repeat exact Release ID, publication timestamp, tag, and tag-SHA verification after protected approval and before deployment; restore mode MUST repeat both historical and latest Release verification used by its artifact and notice.
- **FR-004A**: If no verified qualifying GitHub Release exists, the first official GitHub Pages publication MUST remain blocked until one is created and passes release-baseline verification.
- **FR-004B**: A GitHub prerelease MAY serve as the qualifying baseline only when every relevant English and Chinese public page clearly and consistently identifies the release and project maturity as pre-alpha or prerelease; it MUST NOT be presented as a stable release.
- **FR-005**: The official public site MUST remove visual-prototype draft notices and prototype-only placeholder language after the corresponding public content has been approved.
- **FR-006**: Public pages MUST NOT present a command, endpoint, build procedure, capability, security property, release status, affiliation, or adoption claim as available or operational unless the approved formal release baseline verifies it.
- **FR-006A**: Bilingual topic pages for capabilities absent from the approved formal release MAY remain public and MAY show planned command or endpoint syntax only when each example is visibly and semantically labeled as a non-executable design illustration that is unavailable in the current release. Such examples MUST NOT be presented as installation, invocation, testing, or compatibility instructions.
- **FR-007**: Real capability-state labels MUST be supported by recorded evidence from the approved source or release baseline and MUST use the same meaning across English and Chinese content.
- **FR-008**: README, roadmap, website, and other authoritative repository documents affected by the publication claims MUST use compatible positioning, maturity, version, capability, build, and interface statements before publication.
- **FR-009**: Every required English page and Chinese counterpart MUST preserve equivalent purpose, maturity meaning, capability boundaries, primary actions, and external destinations at publication time.
- **FR-010**: Every intended public page MUST provide a unique localized title, localized description, correct document language, absolute preferred public URL, language alternatives, and localized social-sharing metadata.
- **FR-011**: The official site MUST provide discovery information containing only approved, indexable public routes under the official public origin and MUST exclude internal fixtures, local-preview addresses, retired paths, and non-public artifacts.
- **FR-012**: Required internal links, fragments, images, icons, social cards, scripts, and styles MUST resolve successfully from the public project address, including direct deep-link navigation.
- **FR-013**: The public not-found experience MUST retain bilingual recovery paths and MUST work when served from the GitHub Pages project path.
- **FR-014**: A change to the designated publication branch MUST NOT update the public site unless all mandatory publication checks have passed.
- **FR-015**: A valid publication candidate MUST require explicit approval from at least one authorized maintainer through a protected public environment before it can replace the current official site. The change author MAY approve their own publication, and an independent second reviewer MUST NOT be required by this Feature.
- **FR-016**: Pull requests, feature branches, ordinary validation runs, and ordinary build artifacts MUST NOT be able to replace the official public site.
- **FR-017**: Each public release MUST identify the exact approved repository revision, validation result, approver-controlled promotion, completion status, public destination, deterministic SHA-256 artifact digest, candidate-unique GitHub Pages artifact name, returned artifact ID, workflow run and attempt, digest-verified cross-job evidence, and generated public revision record at `/oryxos/publication.json`. Before invoking the official action by artifact name, deployment MUST use the Actions Artifacts API to prove the exact name-to-ID/workflow-run association and MUST separately prove that the run/attempt encoded in the name equals the Candidate, trusted build outputs, and current `github.run_id`/`github.run_attempt`.
- **FR-017A**: Every successful GitHub Pages deployment action MUST create a Pages Deployment Record before public smoke verification. Its only permitted verification transition is `pending` to immutable terminal `passed` or `failed`. Only `passed` MAY create exactly one exact-schema Public Release; a failed smoke result MUST remain a degraded deployment record and MUST NOT be added to Successful Release History.
- **FR-018**: Publication permissions MUST be limited to the minimum scope needed by the public release operation and MUST NOT grant unrelated write access to validation work.
- **FR-019**: A failed validation, denied approval, cancelled publication, or failed Pages promotion MUST leave the most recent successful public release available and MUST be verified by comparing the public deployment identity before and after each failure mode.
- **FR-019A**: A post-deployment smoke failure MAY occur only after GitHub Pages has changed the public deployment. It MUST be recorded as a degraded Pages Deployment Record, MUST preserve the preceding passed Public Release as the last known good recovery target, and MUST direct maintainers to the protected restoration path without calling the degraded deployment a successful Public Release.
- **FR-020**: Authorized maintainers MUST be able to restore the most recent prior eligible website deployment whose Website revision differs from the currently deployed revision through the protected publication process. Eligibility MUST be proven from paginated GitHub deployment metadata plus matching retained authenticated terminal evidence or append-only tracked deployment/publication history. Expired, missing, ambiguous, contradictory, failed, or unverified evidence and arbitrary older successful revisions MUST NOT be selectable. If the selected deployment uses an older but still published, non-draft, tag-SHA-matching Runtime Release baseline, restore mode MAY use that historical baseline only with the mandatory bilingual historical-restoration notice on every generated public HTML page and separate verification of the latest qualifying Runtime Release.
- **FR-021**: The publication process MUST prevent an older candidate from overwriting a newer successfully approved release by serializing automatic/restoration production runs through terminal public verification without cancelling the active run and by rejecting stale source or Release identity after approval. A new automatic run MUST NOT cancel an accepted restoration that is waiting for approval, deploying, or verifying; a dispatch replaced while still only pending in GitHub's concurrency queue has not yet reached `acceptedAt` or created a Restoration Request.
- **FR-022**: Final public validation MUST cover route integrity, localized navigation, keyboard operation, WCAG 2.2 AA contrast for text and key controls, complete semantic-image alternative text or decorative-image exclusion, required responsive widths, 200% zoom behavior, metadata, external destinations, and browser behavior under the official project path.
- **FR-023**: Browser approval for this Feature MUST follow the established Chromium-only policy; Firefox is not required for publication approval.
- **FR-024**: The public website MUST build, publish, and serve without starting the OryxOS Runtime, accessing a Runtime database, or requiring private Runtime credentials.
- **FR-025**: Public source and generated output MUST NOT contain secrets, private credentials, personal data, internal network addresses, unapproved analytics, unapproved tracking, or calls to privileged OryxOS Runtime capabilities. Automated publication checks MUST scan both publishable Website source and the generated static output for these prohibited classes before artifact upload.
- **FR-026**: The official public site MUST use secure public URLs and MUST NOT load required active resources through insecure or local-only origins.
- **FR-027**: Repository, issue, license, organization, governance, and contribution destinations used by public pages MUST be revalidated during final publication review.
- **FR-028**: The Feature MUST replace Feature 002's non-deployment decision with a publication review record that explicitly authorizes only the approved official public destination and revision. Before Workflow candidate creation, the authorized revision MUST be the exact `sha256-publication-source-tree-v1` digest; the Workflow MUST bind that digest to the exact candidate commit SHA before approval, and the later audit record MUST preserve both identities without treating the audit commit as the deployed revision.
- **FR-029**: Generated build output, dependency directories, browser reports, and caches MUST NOT become authoritative source inputs or be committed solely to publish the site.
- **FR-030**: Because this Feature changes Runtime CI policy as well as Website publication behavior, the final cross-project gate MUST separately run and record Runtime `./mvnw verify` and the Website publication gate. A Website-only pass MUST NOT substitute for Runtime validation, and Runtime validation MUST use the committed Maven Wrapper.
- **FR-031**: Requirement-traceability tooling MUST parse stable explicit identifiers with `^(FR|SC)-[0-9]+[A-Z]*$`, preserve alphabetic suffixes, and reject missing, duplicate, or numerically inferred requirement coverage.

### Scope Boundaries

- A custom domain is outside this Feature; the default GitHub Pages project address is the approved public origin unless a later Feature changes it.
- Online Agent execution, login, CMS, database-backed website behavior, analytics, advertising, and user tracking remain outside scope.
- The Feature may update Website content and affected authoritative documentation to resolve publication blockers, but it MUST NOT implement missing Runtime capabilities merely to support a website claim.
- The existing visual design and original Feature 002 brand assets remain the baseline unless publication review identifies a concrete accessibility, licensing, or public-legibility defect.
- Public deployment previews for arbitrary pull requests or feature branches are outside scope.

### Key Entities

- **Publication Candidate**: The exact repository revision proposed for the official website, including its content baseline, validation results, and intended public origin.
- **Public Content Baseline**: The approved set of positioning, maturity, version, capability, build, interface, governance, and contribution statements shared by the website and affected authoritative documents.
- **Claim Evidence Record**: A link between a public availability statement and the qualifying GitHub Release/tag evidence that supports it; non-availability statements may additionally cite an authoritative project decision.
- **Publication Approval**: The maintainer-controlled decision that permits a validated candidate to enter the protected public environment.
- **Pages Deployment Record**: A completed GitHub Pages deployment action and its pending, passed, or failed immutable post-deployment verification result; a failed result is a degraded deployment rather than a Public Release.
- **Public Release**: A Pages Deployment Record whose complete public smoke verification passed, identified by revision, destination, approval, completion time, artifact identity, and validation evidence.
- **Successful Release History**: The ordered set of passed Pages Deployment Records eligible for restoration.
- **Publication Discrepancy**: A conflict or missing fact that prevents a claim, page, or release from being approved for the official site.
- **Public Origin**: Exactly `https://ki9i9.github.io/oryxos/`, including the project base and trailing slash; this serialized value is used by revision evidence, while URL helpers may separately use host origin `https://ki9i9.github.io` and project base `/oryxos/`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The approved GitHub Pages project address serves the official English home page over a secure connection, and the Chinese home page is reachable through the published locale path.
- **SC-002**: 100% of the required English and Chinese routes, the language fallback routes, and the bilingual not-found recovery experience work from direct public URLs below the project path.
- **SC-003**: 100% of Feature 002 discrepancies marked as blocking public deployment are closed or replaced by approved evidence-backed public handling before the first official release.
- **SC-003A**: The first official Pages release cannot enter the public environment when the repository has no verified published, non-draft GitHub Release bound to an explicit Git tag.
- **SC-003B**: When the qualifying baseline is a prerelease, 100% of relevant English and Chinese pages visibly identify the pre-alpha or prerelease status and zero pages describe it as stable.
- **SC-004**: A final content review finds zero visual-prototype notices, zero prototype-only placeholders, zero unverified commands or endpoints presented as runnable, and zero unsupported availability claims on public pages; 100% of retained planned syntax examples are labeled as non-executable and unavailable in the current release in both locales.
- **SC-005**: 100% of public pages have unique localized titles and descriptions, one preferred absolute public URL, correct language alternatives, and complete localized social-sharing metadata.
- **SC-006**: Automated and manual publication checks find zero broken required internal links, zero missing required assets, zero insecure required active resources, and zero references to local-preview or placeholder origins.
- **SC-007**: No candidate can update the official site before all mandatory checks pass and at least one authorized maintainer grants publication approval; self-approval by an authorized change author satisfies this approval requirement.
- **SC-008**: From contractual `approvalReleasedAt` (the exact protected deployment's earliest `in_progress` status timestamp), a successful candidate reaches its first complete public smoke pass within 10 minutes and can be traced through `/oryxos/publication.json`, the exact artifact name/ID/run/attempt, GitHub deployment identity, and digest-verified terminal evidence.
- **SC-009**: A validation rejection, denied approval, cancellation, stale-candidate rejection, or Pages deployment failure before deployment completion causes zero change to the current public deployment identity, verified by matching its deployment ID, Website SHA, and public URL identity before and after the failure.
- **SC-009A**: A post-deployment smoke failure produces a degraded Pages Deployment Record with structured failure evidence, produces no successful Public Release, preserves digest-verified terminal evidence, and leaves the preceding passed Public Release identifiable through durable Successful Release History as the last known good restoration target.
- **SC-010**: From acceptance of an authenticated, syntactically valid manual request after its workflow becomes the active production-concurrency holder, excluding the validated protected-environment approval-wait interval and non-overlapping GitHub platform outage intervals backed by incident or repository-owner evidence, an authorized maintainer can restore the most recent prior eligible distinct Website revision within 15 minutes, and the restored public site identifies that revision.
- **SC-011**: Chromium publication review reports zero blocking accessibility violations on representative English and Chinese routes; automated and manual checks find zero WCAG 2.2 AA contrast failures for published text or key control states and zero public semantic images without appropriate localized alternative text or decorative-image exclusion; required layouts remain free of unintended horizontal overflow from 320 through 1440 CSS pixels and remain understandable at 200% zoom.
- **SC-012**: 100% of published repository, issue, license, organization, governance, and contribution links are valid at final review time.
- **SC-013**: The complete public build and release succeeds without an OryxOS Runtime process, Runtime database, private Runtime credential, CMS, or server-side website service.
- **SC-014**: Automated publishable-source and generated-output scans find zero secrets, private data, internal addresses, unapproved analytics or tracking, and zero privileged Runtime API calls; the final human review confirms the same result.
- **SC-015**: After the Runtime CI workflow change, the committed Maven Wrapper completes the applicable Runtime quality gate through `./mvnw verify`, and the recorded Runtime result remains separate from the successful Website publication-gate result.
- **SC-016**: Automated requirement traceability reports 100% explicit coverage for every FR/SC identifier, including all alphabetically suffixed identifiers, with zero duplicate or silently omitted IDs.

## Assumptions

- The approved repository is `KI9I9/oryxos`, and the initial public origin is its default GitHub Pages project address rather than a custom domain.
- The designated publication branch is `main`; branch governance changes outside the website publication path remain repository-owner responsibilities.
- A published, non-draft GitHub Release bound to an explicit Git tag must exist and pass baseline verification before the first Pages publication; an unreleased `main` revision is never an acceptable substitute.
- A prerelease may be used as the official baseline because OryxOS is currently pre-alpha, but its prerelease nature must remain explicit across both locales.
- Release selection considers all published, non-draft target-repository Releases, including qualifying prereleases,
  and rejects a tracked baseline when a newer qualifying Release exists.
- GitHub Pages and a protected public environment are available to the repository, and the repository owner can configure authorized reviewers.
- The repository may be maintained by a single authorized maintainer, so the protected environment permits self-review and does not require a second person.
- The website continues to use the `/oryxos/` project path, English root locale, and Chinese `/zh/` locale established by Feature 002.
- This Feature promotes the site to an official website, not a public visual preview. Prototype notices are removed only after content blockers are resolved and final public review passes.
- Chromium remains the only required browser engine for automated and local publication approval.
- Existing Feature 002 layout, accessibility behavior, responsive behavior, original assets, and static-site structure are the starting baseline.
- Formal publication may require synchronized edits to affected authoritative repository documents; such edits must remain evidence-based and Constitution-compliant.
- Missing Runtime capabilities are documented accurately or omitted; this Feature does not add Runtime behavior to make a website statement true.
- The public site remains static and does not require an account, database, online Agent demo, private API, analytics service, or external content-management system.

## Dependencies

- Feature 002's approved visual prototype, route inventory, bilingual content structure, quality checks, brand assets, and discrepancy register.
- Repository-owner access to configure GitHub Pages, the protected public environment, and authorized publication reviewers.
- A qualifying published, non-draft GitHub Release and bound Git tag sufficient to resolve maturity, version, build, CLI, API, and capability discrepancies, plus authoritative project decisions for asset and governance statements.
- Continued availability of the approved repository, issue, license, organization, and project-governance destinations.
