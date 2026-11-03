# Existing Ubold interface

This branch upgrades dependencies for the existing static admin template. Preserve
its teal navigation, Noto Sans / Source Sans Pro fonts, page content and responsive
sidebar behavior. Bootstrap 5 owns interactive components. `legacy-layout.css`
contains presentation compatibility for removed Bootstrap 3 selectors, not a second
Bootstrap runtime. New pages should use Bootstrap 5 attributes and utilities.

No backend, authentication or persistence is implemented by these demonstration pages.
