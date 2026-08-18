# Contract: Official Public Site

**Feature**: `003-oryxos-pages-publication`

## Public origin and path

- Repository: `KI9I9/oryxos`
- Host origin: `https://ki9i9.github.io`
- Project base: `/oryxos/`
- Serialized `publicOrigin`: `https://ki9i9.github.io/oryxos/`
- English home: `https://ki9i9.github.io/oryxos/`
- Chinese home: `https://ki9i9.github.io/oryxos/zh/`
- Custom domain: out of scope

All required links and assets MUST work when the site is served below `/oryxos/`; no required Website resource may
assume domain-root hosting.

## Route contract

- Preserve all required Feature 002 English/Chinese Page pairs.
- Preserve equivalent-page locale switching.
- Preserve bilingual recovery through `404.html`.
- Keep unavailable CLI, REST API, and related topic routes public.
- Mark hidden test fixtures and non-public validation routes as non-indexable and exclude them from discovery.
- Direct requests to clean public routes MUST load the intended content and resources on GitHub Pages.

## Content-state contract

Official pages MUST NOT render:

- `Draft visual prototype` or its Chinese equivalent;
- `DRAFT / 00` markers;
- prototype-only placeholder headings;
- text that says the page is not public documentation;
- an unsupported stable-release implication.

If the qualifying release is a prerelease, every locale-owned page MUST render a release-status notice containing
the release identifier and pre-alpha/prerelease meaning. This notice is an official maturity statement, not a draft
notice.

For a restore-mode historical baseline, every generated public HTML page, including translation-recovery and
bilingual 404 output, MUST render a prominent bilingual historical-restoration notice that names the restored
Runtime Release and the separately verified latest qualifying Runtime Release and states that the restored Website
describes the historical baseline. The notice MUST be available to assistive technology and MUST NOT imply that the
historical baseline is the latest Release.

Documentation pages MUST replace placeholder structure with public sections for:

1. Overview
2. Current release status
3. Design direction or released behavior
4. Limitations
5. Related navigation

## Bilingual parity contract

Every required English/Chinese Page pair MUST be compared through stable manifest identities for:

- page purpose;
- maturity claim;
- capability-boundary claims;
- primary action purposes; and
- approved external destination identities.

Representative browser sampling does not replace the all-pair manifest check. A missing, additional, or divergent
primary action or destination blocks publication; Feature 003 defines no locale-specific parity exception.

## Metadata contract

Every indexable public page MUST include:

- unique localized title and description;
- correct `html lang`;
- one absolute canonical URL;
- absolute English, Chinese, and `x-default` alternates;
- localized `og:locale` and alternate locale;
- absolute `og:url`;
- absolute Open Graph and Twitter image URLs;
- localized image alternative text.

Canonical and alternate URLs MUST stay within `https://ki9i9.github.io/oryxos/`.

## Discovery contract

- `sitemap.xml` MUST contain every intended indexable public route exactly once using absolute public URLs.
- Test fixtures, local-only fallbacks, build artifacts, and retired routes MUST NOT appear in the sitemap.
- `robots.txt` MUST allow the intended official site to be crawled and name the absolute sitemap URL.
- No metadata or discovery file may contain localhost, placeholder domains, or an unapproved custom domain.

## Public revision contract

Every deployed candidate MUST expose `https://ki9i9.github.io/oryxos/publication.json` with only:

```text
candidateId
websiteCommitSha
runtimeReleaseTag
runtimeReleaseCommitSha
publicOrigin
```

`publicOrigin` MUST serialize exactly as `https://ki9i9.github.io/oryxos/`, including the project base and trailing
slash. The host-only origin and project base MUST NOT be substituted for this field.

The record MUST be generated after checkout from Workflow evidence, MUST NOT contain credentials or private GitHub
metadata, and MUST match the candidate's `releaseTag`/`releaseCommitSha`, the Pages Deployment Record's
`releaseTag`/`releaseCommitSha`, and, after a smoke pass, the resulting Public Release evidence.

## Public safety contract

Before artifact upload, automated checks MUST scan publishable Website source and the complete generated output for:

- secret-like API keys, access tokens, passwords, private keys, and deploy credentials;
- personal/private data patterns and private or link-local network addresses;
- unapproved analytics, telemetry, tracking, advertising, CMS, or account integrations;
- insecure required active-resource URLs;
- privileged OryxOS Runtime API calls for Agent execution, Tool, Memory, or Profile management.

Publishable source means exactly `website/*.md`, `website/docs/**/*.md`, `website/zh/**/*.md`,
`website/data/**/*.{json,yaml,yml}`, `website/.vitepress/config/**/*.{ts,js,mjs,json}`,
`website/.vitepress/theme/**/*.{vue,ts,js,mjs,css}`, and all files under `website/public/`. `website/tests/**`,
`website/scripts/**`, dependency directories, generated directories, reports, caches, and
`website/.publication/**` are explicitly not publishable-source roots. The scan MUST enumerate every file matched
by the included roots, apply content rules to text-decodable files, reject unexpected executable or archive
formats in public assets, and verify intended binary assets through the existing asset inventory.

Generated-output scanning means every file under `website/.vitepress/dist/` after final revision metadata is
generated. It MUST apply content/active-resource rules to all text-decodable output and reject unexpected file
types; no output path may be silently skipped.

Build scripts, tests, and development fixtures are not publishable source because their bytes do not enter the
public site. They MUST still use unmistakably synthetic values and MUST NOT contain real secrets. A publishable
source or generated-output safety failure blocks official Pages artifact upload.

## Accessibility and responsive contract

- Chromium-only publication review remains authoritative.
- Representative English and Chinese routes MUST have no configured serious/critical axe findings.
- Published text and key-control states, including default, hover, focus-visible, active, disabled, release-status,
  historical-restoration, warning, and error states, MUST satisfy WCAG 2.2 AA contrast thresholds. Automated checks
  MUST cover shared theme tokens and deterministic state combinations; the final review MUST manually verify any
  state whose rendered colors cannot be derived reliably.
- Every public content-bearing image MUST have appropriate localized alternative text. Every purely decorative
  image MUST use empty alternative text or equivalent accessibility-tree exclusion. Generated-output validation
  MUST enumerate every rendered public image and reject images missing from the semantic/decorative inventory.
- Keyboard navigation, locale switching, focus visibility, and mobile navigation MUST remain usable.
- Required layouts MUST avoid body-level horizontal overflow from 320 through 1440 CSS pixels.
- Representative documentation MUST remain understandable at the 200% zoom equivalent.
- Prerelease notices, historical-restoration notices, and planned-example warnings MUST be available to assistive
  technology.

## Static independence contract

The official site MUST build and render without:

- an OryxOS Runtime process;
- Runtime API calls;
- Runtime database access;
- private Runtime credentials;
- a CMS, login, analytics, tracking, or Website server runtime.
