<script setup lang="ts">
import { Chart, registerables, type ChartType, type ChartConfiguration } from 'chart.js'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useLayoutStore } from '../../app/stores/layout'
Chart.register(...registerables)
const props = withDefaults(
  defineProps<{
    kind?: ChartType
    label?: string
    labels?: string[]
    values?: number[]
    secondary?: number[]
    height?: number
  }>(),
  { kind: 'bar', label: 'Activity', height: 280 },
)
const canvas = ref<HTMLCanvasElement>()
const layout = useLayoutStore()
let chart: Chart | undefined
const palette = ['#5fbeaa', '#5d9cec', '#7266ba', '#fb6d9d', '#34b8cf', '#f5b44a']
function draw() {
  if (!canvas.value) return
  chart?.destroy()
  const round = ['doughnut', 'pie', 'polarArea'].includes(props.kind)
  const values = props.values || [33, 52, 63, 92, 50, 53, 46]
  const scatter = props.kind === 'scatter' || props.kind === 'bubble'
  const style = getComputedStyle(document.documentElement)
  const text = style.getPropertyValue('--app-muted').trim(),
    grid = style.getPropertyValue('--app-border').trim()
  const datasets: any[] = [
    {
      label: props.label,
      data: scatter ? values.map((y, x) => ({ x: x * 10, y, r: 7 + x })) : values,
      backgroundColor: round ? palette : props.kind === 'line' ? '#5fbeaa33' : '#5fbeaa',
      borderColor: round ? undefined : '#5fbeaa',
      borderWidth: 2,
      fill: props.kind === 'line',
      tension: 0.35,
    },
  ]
  if (props.secondary && !round)
    datasets.push({
      label: 'Previous period',
      data: props.secondary,
      backgroundColor: '#5d9cec55',
      borderColor: '#5d9cec',
      borderWidth: 2,
      tension: 0.35,
    })
  chart = new Chart(canvas.value, {
    type: props.kind,
    data: { labels: props.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: round || !!props.secondary,
          position: 'bottom',
          labels: { color: text },
        },
      },
      ...(!round && props.kind !== 'radar'
        ? {
            scales: {
              y: { beginAtZero: true, ticks: { color: text }, grid: { color: grid } },
              x: { ticks: { color: text }, grid: { display: false } },
            },
          }
        : props.kind === 'radar'
          ? {
              scales: {
                r: {
                  pointLabels: { color: text },
                  ticks: { color: text },
                  grid: { color: grid },
                  angleLines: { color: grid },
                },
              },
            }
          : {}),
    },
  } as ChartConfiguration)
}
onMounted(draw)
watch(() => [props.kind, props.values, props.secondary, props.labels], draw, { deep: true })
watch(() => layout.dark, draw, { flush: 'post' })
onBeforeUnmount(() => chart?.destroy())
</script>
<template>
  <div class="chart-frame" :style="{ height: height + 'px' }">
    <canvas ref="canvas" role="img" :aria-label="label" data-testid="chart-canvas" />
  </div>
</template>
