import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { PageDefinition } from '../../src/types'
const pages: PageDefinition[] = JSON.parse(
  readFileSync(new URL('../../src/data/pages.json', import.meta.url), 'utf8'),
)
for (const definition of pages) {
  test(`route ${definition.legacy} → ${definition.path}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => {
      if (response.status() === 404 && !response.url().endsWith('/favicon.ico'))
        errors.push('Missing asset: ' + response.url())
    })
    await page.goto(definition.legacy)
    await expect(page).toHaveURL(
      new RegExp(definition.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'),
    )
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('#app')).not.toHaveText('')
    await expect(page.locator('.el-loading-mask')).toHaveCount(0)
    await page.waitForTimeout(120)
    expect(errors).toEqual([])
    expect(await page.evaluate(() => typeof (window as any).jQuery)).toBe('undefined')
    expect(await page.evaluate(() => typeof (window as any).bootstrap)).toBe('undefined')
  })
}
test('unknown routes show an accessible recovery page', async ({ page }) => {
  await page.goto('/missing-route')
  await expect(page.getByText('Page not found', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to dashboard' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
})
