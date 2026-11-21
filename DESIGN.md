# Existing Ubold interface

This branch upgrades dependencies for the existing static admin template. Preserve
its teal navigation, Noto Sans / Source Sans Pro fonts, page content and responsive
sidebar behavior. Bootstrap 5 owns interactive components. `legacy-layout.css`
contains presentation compatibility for removed Bootstrap 3 selectors, not a second
Bootstrap runtime. New pages should use Bootstrap 5 attributes and utilities.

No backend, authentication or persistence is implemented by these demonstration pages.

## Component ownership

The project uses build-time HTML components, not a client-side framework. Authored
page templates live in `src/pages/`, reusable markup in `src/components/`, and
feature behavior in `src/features/`. `HTML/` remains the deployable static output.
`src/pages.json` owns the mapping to the existing URLs. `src/components.json` owns
component registration and default props. Run `npm run build:pages` after source edits.

Shared layout components preserve the original variants and per-page navigation
selection. Bootstrap continues to own modal, tab, dropdown and collapse behavior;
feature modules continue to own their own chart and calendar lifecycles. Styling
remains in `HTML/assets/less/`, with existing compiled CSS paths preserved.
