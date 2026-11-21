<script setup lang="ts">
import { UiStatCard } from '@jaedons/admin-ui'
import { ElIcon } from 'element-plus'
import { Money, ShoppingCart, TrendCharts, View } from '@element-plus/icons-vue'
defineProps<{ label: string; value: string; trend: string; tone?: string; icon?: number }>()
const icons = [Money, ShoppingCart, TrendCharts, View]
</script>
<template>
  <UiStatCard :label="label" :value="value" :trend="trend" :tone="tone">
    <template #icon
      ><ElIcon><component :is="icons[icon || 0]" /></ElIcon
    ></template>
  </UiStatCard>
</template>
