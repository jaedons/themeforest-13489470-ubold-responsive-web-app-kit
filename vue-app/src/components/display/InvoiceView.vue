<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElTag } from 'element-plus'
function printInvoice() {
  window.print()
}
const rows = [
  { name: 'Apple iPhone', quantity: 1, price: 699 },
  { name: 'Samsung Phone', quantity: 2, price: 499 },
  { name: 'Apple iMac', quantity: 1, price: 1299 },
]
const subtotal = computed(() => rows.reduce((sum, row) => sum + row.quantity * row.price, 0))
const tax = computed(() => Math.round(subtotal.value * 0.08 * 100) / 100)
</script>
<template>
  <div class="invoice">
    <div class="section-heading">
      <h2>UBOLD</h2>
      <div>
        <h2>Invoice #2015-0001</h2>
        <ElTag type="success">Sample invoice</ElTag>
      </div>
    </div>
    <div class="two-column">
      <div>
        <h3>Invoice to</h3>
        <p>John Doe<br />795 Folsom Ave, Suite 600<br />San Francisco, CA 94107</p>
      </div>
      <div class="text-end">
        <h3>Ubold Workspace</h3>
        <p>Sample company<br />November 2026<br />Demo document only</p>
      </div>
    </div>
    <ElTable :data="rows" border
      ><ElTableColumn prop="name" label="Item" min-width="180" /><ElTableColumn
        prop="quantity"
        label="Quantity"
        width="100"
      /><ElTableColumn label="Unit price" width="120"
        ><template #default="{ row }">${{ row.price.toFixed(2) }}</template></ElTableColumn
      ><ElTableColumn label="Total" width="130"
        ><template #default="{ row }"
          >${{ (row.quantity * row.price).toFixed(2) }}</template
        ></ElTableColumn
      ></ElTable
    >
    <div class="invoice-totals">
      <p>
        Subtotal <b>${{ subtotal.toFixed(2) }}</b>
      </p>
      <p>
        Sample tax (8%) <b>${{ tax.toFixed(2) }}</b>
      </p>
      <h3>
        Total <b>${{ (subtotal + tax).toFixed(2) }}</b>
      </h3>
    </div>
    <p class="muted">This sample invoice does not create a payment obligation.</p>
    <ElButton type="primary" class="no-print" @click="printInvoice">Print invoice</ElButton>
  </div>
</template>
