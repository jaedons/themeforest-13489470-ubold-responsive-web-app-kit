import { describe, it, expect } from 'vitest'
import { pages, findPage, navigation } from '../../src/app/catalog'
import original from '../../../src/pages.json'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
describe('migration coverage', () => {
  it('maps all 101 original entry points exactly once', () => {
    expect(pages).toHaveLength(101)
    expect(new Set(pages.map((page) => page.path)).size).toBe(101)
    expect(pages.map((page) => page.legacy.slice(1)).sort()).toEqual(
      original.pages.map((page) => page.output).sort(),
    )
  })
  it('resolves canonical and legacy addresses to the same definitions', () => {
    for (const page of pages) {
      expect(findPage(page.path)).toBe(page)
      expect(findPage(page.legacy)).toBe(page)
      expect(page.title.trim()).not.toBe('')
    }
  })
  it('includes every route in configured navigation', () => {
    expect(
      navigation
        .flatMap((group) => group.pages)
        .map((page) => page.id)
        .sort(),
    ).toEqual(pages.map((page) => page.id).sort())
  })
  it('retains real source table and icon datasets', () => {
    expect(
      pages.find((page) => page.id === 'crm-customers')?.tables[0]?.rows.length,
    ).toBeGreaterThan(5)
    expect(pages.find((page) => page.id === 'icons-fontawesome')?.icons.length).toBeGreaterThan(100)
  })
  it('contains no legacy runtime loading, raw HTML embedding or iframe wrappers of old pages', () => {
    function visit(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? visit(path.join(dir, entry.name))
          : /\.(vue|ts)$/.test(entry.name)
            ? [path.join(dir, entry.name)]
            : [],
      )
    }
    for (const filename of visit('src')) {
      const source = readFileSync(filename, 'utf8')
      expect(source).not.toMatch(
        /v-html\s*=|jquery\.min\.js|bootstrap\.min\.js|legacy-compat\.js|iframe[^>]+HTML\//,
      )
    }
  })
})
