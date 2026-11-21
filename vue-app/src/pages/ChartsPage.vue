<script setup lang="ts">
import type { ChartType } from 'chart.js'
import { computed } from 'vue'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
import ChartView from '../components/charts/ChartView.vue'
import { usePage } from '../composables/usePage'
const page = usePage()
const kinds = computed<ChartType[]>(() =>
  page.value.id === 'chart-chartjs'
    ? ['line', 'doughnut', 'pie', 'bar', 'bar', 'radar', 'polarArea']
    : page.value.id === 'chart-nvd3'
      ? ['line', 'bar', 'scatter', 'bubble']
      : page.value.id === 'chart-radial'
        ? ['doughnut', 'polarArea', 'radar']
        : page.value.id === 'chart-peity' || page.value.id === 'chart-sparkline'
          ? ['line', 'bar', 'pie', 'doughnut']
          : ['line', 'bar', 'doughnut', 'radar'],
)
</script>
<template>
  <div class="two-column">
    <SectionCard
      v-for="(kind, i) in kinds"
      :key="i"
      :title="page.headings[i + 1] || kind[0]!.toUpperCase() + kind.slice(1) + ' chart'"
      ><ChartView
        :kind="kind"
        :label="page.title + ' ' + kind + ' ' + i"
        :values="[33 + i * 3, 52, 63, 92 - i * 4, 50, 53, 46]"
        :secondary="kind === 'line' ? [22, 20, 30, 60, 29, 25, 12] : undefined"
    /></SectionCard>
  </div>
</template>
