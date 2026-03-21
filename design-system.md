# Design System

This site now uses a shared editorial design system built around a small set of semantic tokens and primitives.

## Principles

- Light-first, calm, and readable.
- Accent color is for intent, not decoration.
- Surfaces should feel like paper, not app chrome.
- Pages should be assembled from shared sections before introducing page-specific styling.

## Tokens

Tokens live in [app/globals.css](/Users/johnmunn/Documents/projects/personal-blog/app/globals.css).

- Color tokens: `--background`, `--card`, `--primary`, `--accent-primary`, `--text-*`
- Layout tokens: `--content-max`, `--reading-max`
- Depth tokens: `--shadow-soft`, `--shadow-lift`
- Radius tokens: `--radius`, `--radius-button`

## Semantic Classes

Use these before reaching for long utility strings:

- `.ds-page`: page canvas and background atmosphere
- `.ds-container`: shared page width
- `.ds-reading-width`: comfortable line length for body copy
- `.ds-section`: standard vertical rhythm
- `.ds-kicker`: small uppercase label
- `.ds-heading`: primary page heading
- `.ds-lead`: large intro copy
- `.ds-copy`: default body copy
- `.ds-meta`: supporting metadata
- `.ds-link`: standard inline/action link treatment
- `.ds-nav-link`: top-level navigation link treatment
- `.ds-surface`: elevated paper surface
- `.ds-surface-quiet`: softer inset surface
- `.ds-rule`: shared divider treatment

## React Primitives

Shared React wrappers live in [components/design-system.tsx](/Users/johnmunn/Documents/projects/personal-blog/components/design-system.tsx).

- `PageSection`: section wrapper with `tone`, `spacing`, and optional divider
- `RuleHeading`: singular editorial rule heading for page, section, and footer headings
- `SectionIntro`: consistent title, kicker, description, and actions block
- `EditorialSurface`: reusable elevated panel
- `EditorialPill`: shared lightweight pill for metadata, tags, and status
- `FeatureCard`: shared editorial card with icon, summary, content area, and footer CTA slot

Shared collection/listing primitives live in [components/collection-browser.tsx](/Users/johnmunn/Documents/projects/personal-blog/components/collection-browser.tsx).

- `CollectionBrowserPanel`: shared surface for collection filter and control areas
- `TogglePillGroup`: reusable multi-select pill cluster with optional show-more behavior
- `CollectionResultCount`: consistent filtered-results summary
- `CollectionArticleCard`: shared listing card for collection feeds
- `CollectionEmptyState`: quiet empty state for collection pages

## Preview Route

Use [app/system/page.tsx](/Users/johnmunn/Documents/projects/personal-blog/app/system/page.tsx) as the living preview for the design system. It is intended as an internal route and should be the first place to verify visual changes to shared primitives, including collection browser patterns.

## Buttons

Button variants live in [components/ui/button.tsx](/Users/johnmunn/Documents/projects/personal-blog/components/ui/button.tsx).

- `editorial`: primary CTA
- `quiet`: secondary CTA
- Existing `ghost`, `outline`, and `link` remain available for utility actions

## Usage Rules

- Start new top-level pages with `ds-page` plus `SiteHeader` and `SiteFooter`.
- Use `RuleHeading` anywhere you want the editorial underline treatment; do not add new heading utility classes for that pattern.
- Build sections with `PageSection` and `SectionIntro`.
- Keep reading content inside `ds-reading-width` when possible.
- Prefer `ds-link` over ad hoc underlines and accent color combinations.
- Use `EditorialSurface` for featured project, callout, or summary blocks.
- If a component needs more than one-off styling in multiple places, promote it into this system instead of duplicating classes.
