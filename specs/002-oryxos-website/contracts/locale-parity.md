# Locale Parity Contract

## Locale topology

- English is `root`, language tag `en`, route prefix `/`.
- Simplified Chinese is `zh`, language tag `zh-Hans`, route prefix `/zh/`.
- Both locales use the same stable English slugs after their locale prefix.
- All 18 required Page IDs exist in both locales.

## Shared semantic fields

Counterpart pages must have identical values for:

- `pageId`
- page kind and topic group
- required/optional status
- Capability IDs and capability states
- Claim IDs and evidence baseline
- roadmap stage keys and order
- primary action keys and destinations
- required section keys
- warnings, limitations, and unavailable-feature declarations

These fields are machine-checked and do not depend on translated prose comparison.

## Localized fields

Counterpart pages may differ in:

- title, description, headings, paragraphs, and examples of natural language;
- navigation labels;
- alternative text and visible captions;
- social-sharing image and social locale;
- locale-specific external learning resources, provided the destination purpose remains equivalent.

Commands, configuration keys, Java symbols, route paths, versions, and API identifiers are not translated.

## Translation review states

| State | Meaning | Validation deployment | Formal publication |
|---|---|---|---|
| `draft` | Translation is incomplete | Blocked for required pages | Blocked |
| `review-required` | Complete draft awaiting bilingual review | Allowed only if release review explicitly accepts it for validation | Blocked |
| `reviewed` | Semantic review passed | Allowed | Eligible if other blockers are closed |

## Language switching

1. The switcher uses the Page manifest to find the counterpart.
2. A required page without a counterpart causes validation failure.
3. Future optional pages without a counterpart link to the explicit target-locale `translation-unavailable` page.
4. The site never silently sends a visitor to a semantically unrelated page.
5. Keyboard interaction, focus return, accessible name, and expanded state must work in desktop and mobile
   navigation.

## Automated parity checks

- English and Chinese required Page ID sets are equal.
- Counterpart routes and source files exist.
- Shared semantic fields match.
- No English internal navigation unexpectedly enters `/zh/`, and vice versa.
- Titles and descriptions are non-empty and unique within each locale.
- `<html lang>`, canonical, `hreflang`, and `og:locale` match the active locale.
- Locale switching reaches the expected counterpart under the `/oryxos/` base.

## Manual semantic review

Reviewers must verify that:

- Pre-alpha and single-node status are equally prominent.
- Available, In development, Planned, and Vision are not translated into stronger or weaker commitments.
- Distributed Agent collaboration remains explicitly a Vision.
- Known limitations and unavailable behavior are present in both languages.
- Primary calls to action perform the same action.
- ASF references remain a future aspiration in both languages.
- `Skill + Profile = Agent` and the Profile configuration-entry caveat have equivalent meaning.

## Fallback page content

The fallback page must:

- state that an equivalent translation is unavailable;
- retain the requested target locale;
- link to that locale's Documentation index and core navigation;
- not display a different article as though it were the counterpart.
