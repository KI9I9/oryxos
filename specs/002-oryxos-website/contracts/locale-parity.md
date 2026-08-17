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
- prototype page template and content status
- capability-legend state keys and order
- roadmap visual-stage keys and order
- primary action keys and target Page IDs
- required section keys
- draft-notice keys and placeholder-limitation section presence

These fields are machine-checked and do not depend on translated prose comparison.

## Localized fields

Counterpart pages may differ in:

- title, description, headings, paragraphs, and examples of natural language;
- navigation labels;
- localized capability-legend labels, draft notices, and placeholder-limitation prose;
- alternative text and visible captions;
- social-sharing image and social locale;
- locale-specific external learning resources, provided the destination purpose remains equivalent.

Commands, configuration keys, Java symbols, route paths, versions, and API identifiers are not translated.

## Prototype content states

| State | Meaning | Prototype completion | Public publication |
|---|---|---|---|
| `prototype` | Page form and provisional copy are available for visual review | Allowed when the draft notice and required sections are present | Blocked |
| `reviewed` | Page copy has passed later content verification | Outside this Feature | Eligible only in a later publication Feature |

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
- `<html lang>`, relative language-counterpart metadata, and `og:locale` match the active locale without requiring
  a placeholder public origin; the site-level bilingual `404.html` follows its explicit recovery-artifact
  exception.
- Locale switching reaches the expected counterpart under the `/oryxos/` base.
- The hidden English-only fallback fixture switches to `/zh/translation-unavailable`, proving the
  missing-counterpart branch without weakening required-page parity.

## Manual semantic review

Reviewers must verify that:

- Pre-alpha and single-node status are equally prominent.
- The Available, In development, Planned, and Vision legend labels are not translated into stronger or weaker
  commitments.
- Distributed Agent collaboration remains a prose-only long-term direction and is not given a real
  capability-state badge in either locale.
- Draft notices and placeholder limitations are present in both languages.
- Primary calls to action perform the same action.
- ASF references remain a future aspiration in both languages.
- Both languages state that one YAML Profile completely defines an Agent and may declare or reference a Skill
  loaded as behavioral prompt context.

## Fallback page content

The fallback page must:

- state that an equivalent translation is unavailable;
- retain the requested target locale;
- link to that locale's Documentation index and core navigation;
- not display a different article as though it were the counterpart.
