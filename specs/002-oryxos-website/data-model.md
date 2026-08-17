# Data Model: OryxOS Website Visual Prototype

The prototype has no database. These entities describe repository-owned static content and local validation
records. Final claim/evidence publishing models are deferred to the content-and-publication Feature.

## 1. Locale

| Field | Type | Rules |
|---|---|---|
| `id` | enum | `root` or `zh` |
| `languageTag` | string | `en` or `zh-Hans` |
| `routePrefix` | string | `/` or `/zh/` |
| `label` | string | Localized language label |
| `defaultTitle` | string | Localized prototype title |
| `defaultDescription` | string | Localized prototype description |
| `fallbackPageId` | Page ID | Must resolve inside the same locale |

Every Page belongs to exactly one Locale.

## 2. Page

| Field | Type | Rules |
|---|---|---|
| `pageId` | string | Stable semantic ID shared by locale counterparts |
| `locale` | Locale ID | Required |
| `kind` | enum | `core`, `documentation`, or `fallback` |
| `route` | string | Logical route without the `/oryxos/` base |
| `sourcePath` | string | Repository-relative Markdown path |
| `title` | string | Required and unique within a locale |
| `description` | string | Required and localized |
| `counterpartPageId` | string/null | Same semantic page in the other locale; null only for an optional fallback-test Page |
| `required` | boolean | Required pages must exist in both locales |
| `contentStatus` | enum | `prototype` or `reviewed` |
| `templateId` | Prototype Page Template ID | Required for documentation pages |
| `primaryActionKeys` | string[] | Stable CTA-purpose identifiers |
| `ogImage` | Brand Asset ID | Required directly or through locale default |

**Validation**:

- All 18 required Page IDs have one English and one Chinese record.
- Counterparts share page kind, template, actions, and route purpose.
- Every Page with `contentStatus: prototype` displays the required draft notice through the shared layout.
- Documentation pages additionally use their required Prototype Page Template sections.
- An optional Page with no counterpart must declare `required: false`, stay outside navigation, and resolve locale
  switching to the target locale's `translation-unavailable` Page.
- Routes are unique after locale and clean-URL normalization.

## 2a. Site Recovery Artifact

The single generated `404.html` is a bilingual site-level artifact rather than a locale-owned Page.

| Field | Type | Rules |
|---|---|---|
| `artifactId` | string | Fixed to `not-found` |
| `outputPath` | string | Fixed to `/404.html` |
| `documentLanguage` | string | Fixed to `en` as the root-site default |
| `englishRecoveryRoutes` | string[] | English Home, Documentation, and Community |
| `chineseRecoveryRoutes` | string[] | Chinese Home, Documentation, and Community |
| `clientLocaleEnhancement` | boolean | May prioritize visible content from retained path, but both languages remain SSR-rendered |

The artifact uses a bilingual title and description, exposes both language recovery groups without JavaScript,
and is exempt from one-locale Page counterpart rules.

## 3. Prototype Page Template

Defines the visual content form used by provisional documentation pages.

| Field | Type | Rules |
|---|---|---|
| `templateId` | string | Unique identifier |
| `noticeKey` | string | Resolves to `Draft visual prototype` or localized equivalent |
| `sectionKeys` | string[] | `overview`, `intended-design`, `status-placeholder`, `limitations-placeholder`, `related-navigation` |
| `allowsRunnableExamples` | boolean | Fixed to `false` in this Feature |
| `allowsAvailabilityClaims` | boolean | Fixed to `false` in this Feature |

## 4. Capability Legend Item

Demonstrates visual treatment without assigning a state to any real capability.

| Field | Type | Rules |
|---|---|---|
| `state` | enum | `available`, `in-development`, `planned`, or `vision` |
| `englishLabel` | string | Exact Constitution-aligned display label |
| `chineseLabel` | string | Equivalent localized label |
| `descriptionKey` | string | Explains the state as a legend definition |
| `shapeToken` | string | Non-color visual distinction |
| `colorToken` | string | Must meet applicable contrast requirements |

## 5. Navigation Entry

| Field | Type | Rules |
|---|---|---|
| `key` | string | Stable semantic key |
| `locale` | Locale ID | Required |
| `label` | string | Localized |
| `target` | route or URL | Internal route or approved external destination |
| `location` | enum | `primary`, `sidebar`, `footer`, or `cta` |
| `external` | boolean | External destinations require an accessible external indicator |
| `order` | integer | Unique within location and locale |

## 6. Brand Asset

| Field | Type | Rules |
|---|---|---|
| `assetId` | string | Unique identifier |
| `kind` | enum | `logo-mark`, `wordmark`, `lockup`, `favicon`, `touch-icon`, `social`, or `diagram` |
| `sourcePath` | string | Repository-relative SVG source path |
| `outputPaths` | string[] | Reproducibly generated files |
| `locale` | enum/null | Null for language-neutral assets |
| `dimensions` | object/null | Required for raster output |
| `altKey` | string/null | Required for informative assets |
| `decorative` | boolean | Decorative assets use empty alt and assistive-technology exclusion |
| `originalityNote` | string | Confirms project-owned work and no retired-site reference |

## 7. Documentation Discrepancy

Tracks work required before final public content and deployment.

| Field | Type | Rules |
|---|---|---|
| `discrepancyId` | string | Unique identifier |
| `category` | enum | Includes `positioning`, `maturity`, `version`, `build`, `capability`, `cli`, `api`, `asset`, `deployment`, and `governance` |
| `observedFact` | string | Current review conclusion |
| `affectedRoutes` | string[] | Prototype routes affected |
| `prototypeHandling` | enum | `neutral-copy`, `draft-label`, `omit-detail`, or `resolved` |
| `publicDeploymentBlocked` | boolean | True for all unresolved final-content discrepancies |
| `status` | enum | `open`, `triaged`, `resolved`, or `superseded` |
| `requiredAction` | string | Follow-up content/publication work |

## 8. Prototype Review

| Field | Type | Rules |
|---|---|---|
| `reviewId` | string | Unique local review identifier |
| `sourceRef` | string | Commit SHA or `working-tree` during implementation |
| `reviewedAt` | ISO timestamp | Required |
| `buildResult` | enum | `passed` or `failed` |
| `routeResult` | enum | `passed` or `failed` |
| `accessibilityResult` | enum | `passed` or `failed` |
| `responsiveResult` | enum | `passed` or `failed` |
| `bilingualResult` | enum | `passed` or `failed` |
| `draftLabelResult` | enum | `passed` or `failed` |
| `brandCreator` | string | Person or process responsible for the original asset set |
| `brandGenerationProcess` | string | Tools and reproducible export process |
| `thirdPartyLicenses` | string[] | Fonts/tools used or an explicit `none` entry |
| `assetLegibilityResult` | enum | `passed` or `failed` at navigation, favicon, and social-card sizes |
| `visualDecision` | enum | `approved-for-prototype`, `changes-requested`, or `rejected` |
| `notes` | string[] | Concrete visual and interaction feedback |

## Relationships

```text
Locale 1 --- * Page
Page * --- 1 Prototype Page Template
Page 0..1 --- 1 Brand Asset (social image override)
Navigation Entry * --- 1 Page or approved external destination
Documentation Discrepancy * --- * Page
Prototype Review 1 --- * reviewed Page routes
Site Recovery Artifact 1 --- 1 generated 404.html
```
