# Ubold Vue design context

Audience: users exploring an admin template and developers building a management
workspace. The product remains an English-language demonstration with local data.

Preserve Ubold's information architecture, dark slate top bar (#36404a), light
gray workspace (#ebeff2), white panels, teal identity and dense but readable tables.
Element Plus owns controls and interaction geometry. The primary teal is #389b88
for legibility; tinted surfaces, borders and dark mode derive from shared tokens.
Use Noto Sans / Segoe UI / system sans-serif fallbacks, restrained 5px panel radii,
and the shared type scale in `src/styles/main.scss`.

The canonical owners are Element Plus form/select/date/table/dialog primitives,
`AdminLayout.vue` for the shell, `AppNavigation.vue` for navigation, `DataTable.vue`
for table combinations, and feature-specific modules for business behavior.
Do not import Bootstrap UI CSS, jQuery, or old plugin initialization scripts.

Mobile navigation is a drawer. Content must not shrink to fit a visible sidebar.
Tables keep internal horizontal scrolling, dialogs fit the viewport, long names
truncate or wrap, keyboard focus is visible, and reduced motion is respected.
The product's colors and density are established; migration is not a marketing redesign.

## Parity maintenance

Dashboard variants retain their distinct business modules. Original multi-table examples
must render every populated source table. Layout variants alter the shared shell rather
than displaying a mock profile inside page content. Cancel actions edit a separate draft;
mail folders follow URL history. Keep primary tokens and top-bar contrast stable after
lazy-loaded Element Plus styles. See PARITY-AUDIT.md for the comparison evidence.
