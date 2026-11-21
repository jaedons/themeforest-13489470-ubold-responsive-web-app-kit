import { test, expect } from '@playwright/test'

test('dashboard variants retain their own modules and working todo/chat', async ({ page }) => {
  await page.goto('/dashboard/analytics')
  await expect(page.getByRole('heading', { name: 'Last Transactions' })).toBeVisible()
  await page.getByRole('textbox', { name: 'New task', exact: true }).fill('Parity task')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Parity task' }).locator('..').click()
  await page.getByRole('button', { name: 'Archive completed' }).click()
  await expect(page.getByRole('checkbox', { name: 'Parity task' })).toHaveCount(0)
  await page.getByRole('textbox', { name: 'Chat message' }).fill('Parity chat message')
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await expect(page.locator('.dashboard-chat')).toContainText('Parity chat message')
  await page.goto('/dashboard/performance')
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible()
  await expect(page.getByTestId('chart-canvas')).toHaveCount(3)
  await page.goto('/crm/dashboard')
  await expect(page.getByRole('heading', { name: 'Deals Analytics' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Contacts', exact: true })).toBeVisible()
  await page.goto('/ecommerce/dashboard')
  await expect(page.getByRole('heading', { name: 'Popular Products' })).toBeVisible()
})

test('product metadata, status, images and cancel restore the full draft', async ({ page }) => {
  await page.goto('/ecommerce/product-detail')
  await page.getByRole('textbox', { name: 'Product name', exact: true }).fill('Parity product')
  await page.getByRole('textbox', { name: 'Product reference' }).fill('PARITY-1')
  await page.getByRole('textbox', { name: 'Meta title', exact: true }).fill('Parity meta')
  await page.getByRole('textbox', { name: 'Product comment' }).fill('Internal comment')
  await page.getByTestId('product-status').click()
  await page.getByRole('option', { name: 'Draft', exact: true }).click()
  await page.getByRole('button', { name: 'Remove imac.jpg' }).click()
  await expect(page.locator('.product-image-row')).toHaveCount(3)
  await page.getByRole('button', { name: 'Save product preview' }).click()
  await expect(page.getByText('Saved in this page only', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'Meta title', exact: true })).toHaveValue('')
  await expect(page.getByRole('textbox', { name: 'Product comment' })).toHaveValue('')
  await expect(page.locator('.product-image-row')).toHaveCount(4)
})

test('editable profile cancel discards changes and save commits them', async ({ page }) => {
  await page.goto('/forms/xeditable')
  await page.getByRole('button', { name: 'Edit profile' }).click()
  const dialog = page.getByRole('dialog', { name: 'Edit profile' })
  await expect(dialog.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('John Doe')
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Unsaved name')
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.locator('.el-descriptions')).not.toContainText('Unsaved name')
  await page.getByRole('button', { name: 'Edit profile' }).click()
  await expect(dialog.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('John Doe')
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Saved name')
  await dialog.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.locator('.el-descriptions')).toContainText('Saved name')
})

test('mail folder follows browser history and preview includes body and attachments', async ({
  page,
}) => {
  await page.goto('/mail/inbox')
  await page.getByRole('button', { name: /^Starred/ }).click()
  await page.getByRole('button', { name: /^Trash/ }).click()
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Starred', exact: true })).toBeVisible()
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'Trash', exact: true })).toBeVisible()
  await page.goto('/mail/compose')
  await page.getByRole('textbox', { name: 'Recipient' }).fill('parity@example.com')
  await page.getByRole('textbox', { name: 'Subject', exact: true }).fill('Parity subject')
  await page.locator('.tiptap').fill('Preview body parity')
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('notes') })
  await page.getByRole('button', { name: 'Preview message' }).click()
  const preview = page.getByRole('dialog', { name: 'Message preview' })
  await expect(preview).toContainText('Preview body parity')
  await expect(preview).toContainText('notes.txt')
})

test('calendar category can be created and scheduled with keyboard', async ({ page }) => {
  await page.goto('/apps/calendar')
  await page.getByRole('button', { name: 'Create category', exact: true }).click()
  const category = page.getByRole('dialog', { name: 'Create category' })
  await category.getByRole('textbox', { name: 'Category name' }).fill('Parity category')
  await category.getByRole('button', { name: 'Create category', exact: true }).click()
  await page.getByRole('button', { name: 'Schedule Parity category' }).press('Enter')
  const event = page.getByRole('dialog', { name: 'Add event', exact: true })
  await expect(event.getByRole('textbox', { name: 'Event name' })).toHaveValue('Parity category')
  await event.getByRole('button', { name: 'Save event' }).click()
  await expect(page.getByText('4 scheduled events')).toBeVisible()
})

test('layout variants apply on direct entry and do not leak to other pages', async ({ page }) => {
  await page.goto('/layouts/menu-collapsed')
  await expect(page.locator('.workspace')).toHaveClass(/is-collapsed/)
  await page.getByRole('link', { name: 'View dashboard', exact: true }).click()
  await expect(page.locator('.workspace')).not.toHaveClass(/is-collapsed/)
  await page.goto('/layouts/menu-small')
  await expect(page.locator('.app-sidebar')).toHaveCSS('width', '180px')
  await page.goto('/layouts/leftbar-2')
  await expect(page.locator('aside .sidebar-profile')).toBeVisible()
  await page.locator('aside .sidebar-profile').click()
  await expect(page).toHaveURL(/extras\/profile$/)
  await page.goto('/layouts/header-2')
  await expect(page.locator('.workspace')).toHaveClass(/header-variant/)
})

test('new dashboard modules fit phone screens and theme remains teal after lazy loading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of [
    '/dashboard/analytics',
    '/dashboard/performance',
    '/crm/dashboard',
    '/ecommerce/dashboard',
    '/ecommerce/product-detail',
    '/extras/profile',
  ]) {
    await page.goto(path)
    await expect(page.locator('main h1')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      path,
    ).toBeLessThanOrEqual(391)
  }
  await expect(page.getByRole('button', { name: 'Edit profile' })).toHaveCSS(
    'background-color',
    'rgb(56, 155, 136)',
  )
})
