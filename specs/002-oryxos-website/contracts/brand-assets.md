# Brand Assets Contract

## Scope

Feature 002 creates a foundational asset set for the new website, not a comprehensive brand manual. All assets
must be original project work and must not read, trace, copy, adapt, or depend on `.website.bak`.

## Required assets

| Asset ID | Required source | Required export | Purpose |
|---|---|---|---|
| `brand-logo-mark` | `public/brand/logo-mark.svg` | PNG 512×512 optional | Language-neutral primary mark |
| `brand-wordmark-en` | `public/brand/wordmark-en.svg` | 2× PNG optional | English OryxOS wordmark |
| `brand-lockup-horizontal` | `public/brand/lockup-horizontal.svg` | 2× PNG optional | Navigation and broad layouts |
| `brand-mark-monochrome` | `public/brand/logo-mark-monochrome.svg` | None | Single-color usage |
| `icon-favicon-svg` | `public/icons/favicon.svg` | PNG 32×32 and 16×16 | Browser icon |
| `icon-apple-touch` | `public/icons/apple-touch-icon.svg` | PNG 180x180 | Touch icon |
| `social-default-en` | `public/social/og-default-en.svg` | PNG 1200x630 | English social card |
| `social-default-zh` | `public/social/og-default-zh.svg` | PNG 1200x630 | Chinese social card |
| `diagram-system-architecture` | `public/diagrams/system-architecture.svg` | Optional 2× PNG | Runtime/module architecture |
| `diagram-agent-definition` | `public/diagrams/agent-skill-profile.svg` | Optional 2× PNG | Profile-defined Agent and referenced Skill relationship |
| `diagram-react-loop` | `public/diagrams/react-loop.svg` | Optional 2× PNG | ReAct target design |
| `brand-asset-manifest` | `public/brand/asset-manifest.json` | None | Purpose, locale, dimensions, alt key, ownership |

## Visual direction

- Light, restrained enterprise-technology aesthetic.
- Warm white or cool white canvas; deep graphite typography.
- A limited blue/teal primary range plus one restrained warm accent.
- Thin-line diagrams with clear boundaries and text labels outside dense graphics where practical.
- Avoid glowing AI brains, humanoid robots, cosmic imagery, generic stock illustration, and decorative complexity.
- Capability states use text and shape/border differences in addition to color.

## SVG requirements

- Include a valid `viewBox` and remain legible at intended sizes.
- Use no external fonts, scripts, linked images, or remote resources.
- Remove editor metadata and unnecessary hidden layers.
- Use shared brand color tokens or documented fixed colors.
- Do not place essential explanatory prose only inside SVG paths.
- If embedded language is necessary, provide explicit English and Chinese variants.

## Reproducible export

- `@resvg/resvg-js` is the locked local SVG renderer.
- `website/scripts/export-assets.mjs` generates all required PNG outputs from committed SVG sources.
- `npm run assets:build` performs export; `npm run assets:verify` checks file type, exact dimensions, and non-empty
  output.
- No global Inkscape, ImageMagick, browser screenshot utility, or manual export is required for the build.

## Accessibility

- Logo links receive their accessible name from surrounding link text or an appropriate label.
- Decorative assets use empty alt text and assistive-technology exclusion.
- Informative diagrams receive localized concise alt text plus a nearby visible text explanation or caption.
- Complex diagrams do not attempt to place all detail in a single very long alt attribute.
- Required non-text visual distinctions meet WCAG 2.2 AA non-text contrast expectations.

## Social image requirements

- Final output is PNG 1200x630.
- English and Chinese cards communicate equivalent project status.
- Both include OryxOS identity and a visible Pre-alpha indicator.
- Text remains inside a safe region that survives common social cropping.
- Metadata includes localized `og:image:alt` and Twitter image alt text.

## Originality review

Before local prototype approval, record:

- creator or generating process;
- confirmation that no retired website asset was referenced;
- any third-party font or tool license used during export;
- visual consistency review across mark, wordmark, favicon, social cards, and diagrams;
- legibility checks at navigation, favicon, and social-card sizes.
