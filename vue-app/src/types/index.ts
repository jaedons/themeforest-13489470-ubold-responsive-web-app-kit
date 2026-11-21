export interface SourceTable {
  headers: string[]
  rows: string[][]
}
export interface PageDefinition {
  id: string
  legacy: string
  path: string
  module: string
  title: string
  view: string
  headings: string[]
  tables: SourceTable[]
  images: string[]
  icons: string[]
}
export type { TableColumn, DataRow } from '@jaedons/admin-ui'
