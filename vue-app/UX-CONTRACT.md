# Vue behavior ownership

| Capability    | Canonical owner                                            | Behavior and verification                                                                                                                                                                |
| ------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing       | `src/app/router`, `src/data/pages.json`                    | 101 legacy URLs resolve to canonical Vue routes. Unknown paths offer a dashboard link. Route inventory and browser tests verify coverage.                                                |
| Navigation    | `AdminLayout`, `AppNavigation`, layout store               | Active route controls selected menus. Mobile drawer closes on navigation. Desktop collapse does not shrink mobile content.                                                               |
| Tables        | Element Plus Table + `DataTable.vue`                       | Local search/sort/pagination, empty results, current-page selection, explicit selection count. Filtering/paging clears selection. CRUD is page-local and deletion requires confirmation. |
| Forms         | Element Plus Form/FormItem                                 | Labelled inputs, required/error feedback, validation before local save, explicit demo outcomes. No implied server submission.                                                            |
| Select/date   | Element Plus Select/Cascader/DatePicker/TimePicker         | Library owns keyboard, portal, focus and popup behavior; business modules own model values.                                                                                              |
| Dialogs       | Element Plus Dialog/MessageBox                             | Vue controls visibility. Cancel does not commit draft changes. Confirmation deletion names its target.                                                                                   |
| Notifications | Element Plus Message/Notification                          | Success feedback describes the local action. No fake authentication, upload or email-delivery success.                                                                                   |
| Calendar      | Official FullCalendar Vue integration + `CalendarPage.vue` | Vue event collection owns create/edit/delete and drag changes; all-day events use exclusive end dates. Component unmount cleans external dragging.                                       |
| Editors       | Tiptap + `RichEditor.vue`                                  | One Vue-native editor implementation; no arbitrary legacy HTML injection.                                                                                                                |
| Upload/crop   | `UploadPanel`, `ImageCropper`                              | Local selection, explicit limits, local preview/download, object-URL cleanup. No server upload is simulated.                                                                             |
| Theme/scroll  | Shared SCSS + layout store                                 | Appearance may persist in localStorage. Sidebar has bounded scrolling; tables scroll internally. Reduced motion and visible focus are global.                                            |

There is no production authentication, permission service, payment, email server or
business API in scope. Business changes are local demo state. Google Maps requires
a separately configured public browser key. Those integrations must receive real
contracts before a production system can claim their behavior.

Validation: `npm test`, `npm run build`, `npm run test:e2e`. Browser coverage checks
all routes and key workflows; it is not a claim that every third-party option or
all possible backend failure states have been tested.
