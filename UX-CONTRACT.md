# Ubold component behavior contract

This is a static demonstration template. Componentization preserves the existing
content, English interface, routes, state classes and interactions. No new backend,
authentication policy or persistence behavior is inferred from the sample pages.

| Capability | Canonical source | Contract | Verification |
| --- | --- | --- | --- |
| Page routing | `src/pages.json` | All existing 101 HTML entry URLs remain available | Component route coverage test |
| Shared navigation | `src/components/layout/sidebar*.html` | Page-provided `nav` props preserve active parent and child entries; profile and compact layouts remain distinct | Structural equivalence and page巡检 |
| Sidebar behavior | `src/components/layout/shell.js` | Desktop toggle and mobile overlay behavior remain shared across pages | `scripts/interaction-test.mjs` |
| Modal, tabs, dropdown, collapse | Bootstrap 5 + `src/components/runtime/legacy-compat.js` | One shared Bootstrap runtime; page fragments exist before initialization | Browser and interaction tests |
| Plugin initialization | `src/components/ui/plugins.js` | Existing plugin initialization order remains after common runtime dependencies | Browser tests |
| Calendar events | `src/features/calendar/calendar.js` | Create/edit/delete operate in page memory; refresh restores demo events | Calendar interaction tests |
| Charts | `src/features/charts/chartjs.js` | Reuse/destroy chart instances through the Chart.js API; preserve seven demo charts | Browser tests |
| Form, table, select and other plugin demos | Corresponding `src/pages/forms`, `tables`, `ui` and existing plugin files | Their existing controls and validation behavior are preserved; they are not replaced with new data controls | Page-load巡检; complete interaction coverage is not claimed |
| Layout and scrolling | Existing LESS and compiled global CSS | Keep responsive layout, font fallbacks and current sidebar scrolling | Desktop/mobile interaction screenshots |

`HTML/` is generated for the componentized pages and five registered application
scripts. Edit canonical sources first. `npm test` rejects stale generated output.
External Google Maps is excluded from offline browser verification and remains an
external integration requirement.
