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
export interface TableColumn {
  key: string
  label: string
}
export type DataRow = Record<string, string | number> & { id: string }
