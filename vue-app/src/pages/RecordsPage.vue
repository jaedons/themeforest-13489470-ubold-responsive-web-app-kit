<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import { UiDataTable as DataTable } from '@jaedons/admin-ui'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
import { usePage } from '../composables/usePage'
import type { DataRow, TableColumn } from '../types'
const page = usePage(),
  source = page.value.tables.find((table) => table.headers.length && table.rows.length)
const additionalTables = page.value.tables
  .filter((table) => table !== source && table.headers.length && table.rows.length)
  .map((table, index) => ({
    title: page.value.headings[index + 1] || `Table example ${index + 2}`,
    columns: table.headers
      .map((label, i) => ({ key: 'c' + i, label }))
      .filter((col) => col.label && !/^(action|actions)$/i.test(col.label)),
    rows: table.rows.map((row, i) => ({
      id: String(i),
      ...Object.fromEntries(row.map((cell, j) => ['c' + j, cell || '—'])),
    })),
  }))
const indexes =
  source?.headers
    .map((label, index) => ({ label, index }))
    .filter((item) => item.label && !/^(action|actions|edit|delete)$/i.test(item.label)) || []
const columns: TableColumn[] = indexes.length
  ? indexes.map((item, i) => ({ key: 'c' + i, label: item.label }))
  : [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
    ]
const rows = ref<DataRow[]>(
  source && indexes.length
    ? source.rows
        .filter((row) => row.some(Boolean))
        .map((row, i) =>
          Object.assign(
            { id: 'record-' + i },
            Object.fromEntries(indexes.map((item, j) => ['c' + j, row[item.index] || '—'])),
          ),
        )
    : [
        { id: '1', name: 'Tomaslau', email: 'tomaslau@dummy.com', status: 'Active' },
        { id: '2', name: 'Chadengle', email: 'chad@dummy.com', status: 'Active' },
        { id: '3', name: 'Stillnotdavid', email: 'david@dummy.com', status: 'Pending' },
      ],
)
const editable = computed(
  () =>
    page.value.module === 'crm' ||
    page.value.module === 'ecommerce' ||
    page.value.id === 'tables-editable',
)
const dialog = ref(false),
  draft = reactive<Record<string, string>>({}),
  editing = ref(''),
  form = ref<InstanceType<typeof ElForm>>()
function open(row?: DataRow) {
  editing.value = row?.id || ''
  for (const col of columns) draft[col.key] = String(row?.[col.key] || '')
  dialog.value = true
}
async function save() {
  if (!(await form.value?.validate().catch(() => false))) return
  const row = { id: editing.value || crypto.randomUUID(), ...draft }
  if (editing.value) {
    const index = rows.value.findIndex((item) => item.id === editing.value)
    rows.value[index] = row
  } else rows.value.unshift(row)
  dialog.value = false
  ElMessage.success(editing.value ? 'Record updated in demo memory' : 'Record added to demo memory')
}
async function remove(row: DataRow) {
  try {
    await ElMessageBox.confirm(
      `Delete ${String(row[columns[0]!.key])}? This affects this demo only.`,
      'Delete record',
      { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' },
    )
    rows.value = rows.value.filter((item) => item.id !== row.id)
    ElMessage.success('Record deleted')
  } catch {
    /* cancelled */
  }
}
</script>
<template>
  <SectionCard
    :title="page.title"
    description="Search, sort and paginate the sample records. Changes remain in this page’s memory."
    ><DataTable
      :rows="rows"
      :columns="columns"
      :editable="editable"
      :create-label="editable ? 'Add record' : undefined"
      @create="open()"
      @edit="open"
      @remove="remove" /></SectionCard
  ><SectionCard v-for="(table, index) in additionalTables" :key="index" :title="table.title"
    ><DataTable :rows="table.rows" :columns="table.columns" /></SectionCard
  ><ElDialog
    v-model="dialog"
    :title="editing ? 'Edit record' : 'Add record'"
    width="560px"
    destroy-on-close
    ><ElForm ref="form" :model="draft" label-position="top" @submit.prevent="save"
      ><ElFormItem
        v-for="(col, i) in columns"
        :key="col.key"
        :prop="col.key"
        :label="col.label"
        :rules="
          i === 0
            ? [{ required: true, whitespace: true, message: 'Enter ' + col.label, trigger: 'blur' }]
            : []
        "
        ><ElInput v-model="draft[col.key]" :aria-label="col.label" /></ElFormItem></ElForm
    ><template #footer
      ><ElButton @click="dialog = false">Cancel</ElButton
      ><ElButton type="primary" @click="save">Save changes</ElButton></template
    ></ElDialog
  >
</template>
