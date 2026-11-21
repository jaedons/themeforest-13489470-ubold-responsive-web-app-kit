import { it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DataTable from '../../src/components/tables/DataTable.vue'
import { ElPagination } from 'element-plus'
const rows = Array.from({ length: 14 }, (_, i) => ({
  id: String(i),
  name: i === 12 ? 'Unique customer' : 'Customer ' + i,
  email: `customer${i}@example.com`,
}))
const props = {
  rows,
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ],
}
it('filters original rows and exposes the empty-search state', async () => {
  const wrapper = mount(DataTable, { props })
  await wrapper.find('input[aria-label="Search records"]').setValue('Unique customer')
  await flushPromises()
  expect(wrapper.text()).toContain('Unique customer')
  expect(wrapper.text()).not.toContain('Customer 0')
  await wrapper.find('input[aria-label="Search records"]').setValue('missing-123')
  await flushPromises()
  expect(wrapper.text()).toContain('No matching records')
  wrapper.unmount()
})
it('paginates and resets to the first page after filtering', async () => {
  const wrapper = mount(DataTable, { props })
  wrapper.findComponent(ElPagination).vm.$emit('update:current-page', 2)
  await flushPromises()
  expect(wrapper.text()).toContain('Customer 10')
  expect(wrapper.text()).not.toContain('Customer 0')
  await wrapper.find('input[aria-label="Search records"]').setValue('Customer 0')
  await flushPromises()
  expect(wrapper.text()).toContain('Customer 0')
  expect(wrapper.findComponent(ElPagination).props('currentPage')).toBe(1)
  wrapper.unmount()
})
