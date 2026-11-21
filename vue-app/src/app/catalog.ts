import definitions from '../data/pages.json'
import type { PageDefinition } from '../types'
export const pages: PageDefinition[] = definitions
export const moduleNames: Record<string, string> = {
  dashboard: 'Dashboard',
  'applications/calendar': 'Calendar',
  'applications/contacts': 'Contacts',
  'applications/mail': 'Mail',
  charts: 'Charts',
  examples: 'Components',
  crm: 'CRM',
  ecommerce: 'Commerce',
  extras: 'Extras',
  forms: 'Forms',
  icons: 'Icons',
  layouts: 'Layouts',
  maps: 'Maps',
  errors: 'Error pages',
  authentication: 'Accounts',
  tables: 'Tables',
  ui: 'UI elements',
}
export const navigation = Object.entries(moduleNames)
  .map(([key, label]) => ({
    key,
    label,
    pages: pages
      .filter((page) => page.module === key)
      .sort((a, b) => (a.id === 'index' ? -1 : 0) - (b.id === 'index' ? -1 : 0)),
  }))
  .filter((group) => group.pages.length)
export function findPage(path: string) {
  return pages.find((page) => page.path === path || page.legacy === path)
}
