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
