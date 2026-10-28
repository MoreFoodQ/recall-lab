# Recall Lab visual system

Reference: [Terminal Industries on Awwwards](https://www.awwwards.com/sites/terminal-industries), viewed 2026-10-28. Borrow its industrial precision, high-contrast primary actions, clear modular structure and oversized visual emphasis, without reproducing branding or media.

Scene: a student studying at a laptop at night, scanning English questions and Chinese explanations in a low-light room. A near-black canvas and pale green action color separate reading from action.

Strategy: restrained product UI with a single expansive dark editorial hero; no decorative animation during study.

## Tokens

Use OKLCH. Canvas `oklch(0.12 0 0)`, surface `oklch(0.18 0.006 140)`, ink `oklch(0.96 0 0)`, muted `oklch(0.73 0.008 140)`, primary `oklch(0.88 0.16 140)`, accent `oklch(0.76 0.12 55)`. Border `oklch(0.32 0.008 140)`.

Typography: Manrope for English product text, Noto Sans TC for Traditional Chinese; native sans fallback, mono for indices. Oversized hero with tight tracking, conventional readable question typography.

## Layout and components

Wide desktop: fixed narrow chapter sidebar, central work area; quiz canvas plus navigation matrix. Mobile: horizontal navigation, single-column question and collapsible navigation. Hairline separators, 8–12px corner radii, generous 44px targets. Status text accompanies semantic colors. Native dialogs for source-image zoom and destructive reset confirmation.

## Motion

150–220ms state transitions; hero abstract scatter diagram uses a brief entrance only, not continuous movement. All motion honors prefers-reduced-motion.
