<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { Money, ShoppingCart, TrendCharts, View } from '@element-plus/icons-vue'
defineProps<{ label: string; value: string; trend: string; tone?: string; icon?: number }>()
const icons = [Money, ShoppingCart, TrendCharts, View]
</script>
<template>
  <div class="stat-card" :class="tone">
    <div class="stat-icon">
      <ElIcon><component :is="icons[icon || 0]" /></ElIcon>
    </div>
    <div>
      <p>{{ label }}</p>
      <strong>{{ value }}</strong><small>{{ trend }}</small>
    </div>
  </div>
</template>
