<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ElInput,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElEmpty,
  ElSelect,
  ElOption,
} from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { DataRow, TableColumn } from '../../types'
const props = withDefaults(
  defineProps<{
    rows: DataRow[]
    columns: TableColumn[]
    editable?: boolean
    selectable?: boolean
    createLabel?: string
  }>(),
  { editable: false, selectable: true },
)
const emit = defineEmits<{ edit: [row: DataRow]; remove: [row: DataRow]; create: [] }>()
const query = ref(''),
  page = ref(1),
  size = ref(10),
  selected = ref<DataRow[]>([]),
  sort = ref({ prop: '', order: '' })
const table = ref<{ clearSelection: () => void }>()
const filtered = computed(() => {
  let rows = props.rows.filter((row) =>
    props.columns.some((col) =>
      String(row[col.key] ?? '')
        .toLowerCase()
        .includes(query.value.toLowerCase()),
    ),
  )
  if (sort.value.prop && sort.value.order)
    rows = [...rows].sort(
      (a, b) =>
        String(a[sort.value.prop]).localeCompare(String(b[sort.value.prop]), undefined, {
          numeric: true,
        }) * (sort.value.order === 'ascending' ? 1 : -1),
    )
  return rows
})
const visible = computed(() =>
  filtered.value.slice((page.value - 1) * size.value, page.value * size.value),
)
watch([query, size, sort], () => {
  page.value = 1
})
watch([page, query, size, sort, visible], () => {
  selected.value = []
  table.value?.clearSelection()
})
watch(
  () => filtered.value.length,
  () => {
    page.value = Math.min(page.value, Math.max(1, Math.ceil(filtered.value.length / size.value)))
  },
)
</script>
<template>
  <div class="table-toolbar">
    <ElInput
      v-model="query"
      :prefix-icon="Search"
      clearable
      placeholder="Search records…"
      aria-label="Search records"
      data-testid="table-search"
    /><span class="muted" role="status"
      >{{ filtered.length }} records · {{ selected.length }} selected on this page</span
    ><ElButton v-if="createLabel" type="primary" @click="emit('create')">{{
      createLabel
    }}</ElButton>
  </div>
  <ElTable
    ref="table"
    :data="visible"
    row-key="id"
    stripe
    border
    style="width: 100%"
    @selection-change="selected = $event"
    @sort-change="sort = { prop: $event.prop || '', order: $event.order || '' }"
  >
    <ElTableColumn v-if="selectable" type="selection" width="46" />
    <ElTableColumn
      v-for="column in columns"
      :key="column.key"
      :prop="column.key"
      :label="column.label"
      sortable="custom"
      :min-width="column.label.toLowerCase().includes('email') ? 220 : 150"
      show-overflow-tooltip
    />
    <ElTableColumn v-if="editable" label="Actions" fixed="right" width="155"
      ><template #default="{ row }"
        ><ElButton text type="primary" @click="emit('edit', row)">Edit</ElButton
        ><ElButton text type="danger" @click="emit('remove', row)">Delete</ElButton></template
      ></ElTableColumn
    >
    <template #empty
      ><ElEmpty :description="query ? 'No matching records' : 'No records yet'" :image-size="70"
    /></template>
  </ElTable>
  <div class="table-footer">
    <ElSelect v-model="size" aria-label="Rows per page" style="width: 125px"
      ><ElOption
        v-for="n in [5, 10, 20, 50]"
        :key="n"
        :value="n"
        :label="n + ' / page'" /></ElSelect
    ><ElPagination
      v-model:current-page="page"
      :page-size="size"
      :total="filtered.length"
      layout="prev,pager,next"
    />
  </div>
</template>
