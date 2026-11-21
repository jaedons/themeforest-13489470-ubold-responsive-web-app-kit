<script setup lang="ts">
import { computed, ref, shallowRef, onMounted, onBeforeUnmount } from 'vue'
import { ElSelect, ElOption, ElTag, ElAlert, ElButton, ElSkeleton } from 'element-plus'
type WorldData = { viewBox: string; locations: { id: string; name: string; path: string }[] }
const world = shallowRef<WorldData>(),
  loading = ref(false),
  error = ref('')
const selected = ref('us'),
  hover = ref('')
const country = computed(() =>
  world.value?.locations.find((location) => location.id === (hover.value || selected.value)),
)
let controller: AbortController | undefined
async function load() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  controller = new AbortController()
  try {
    const response = await fetch('/assets/data/world.json', { signal: controller.signal })
    if (!response.ok) throw new Error('Map data unavailable')
    world.value = await response.json()
  } catch (cause) {
    if (!(cause instanceof DOMException && cause.name === 'AbortError'))
      error.value = 'The local world map could not be loaded. Retry to request it again.'
  } finally {
    loading.value = false
  }
}
onMounted(load)
onBeforeUnmount(() => controller?.abort())
</script>
<template>
  <ElSkeleton v-if="loading" :rows="8" animated /><template v-else-if="error"
    ><ElAlert :title="error" type="error" :closable="false" /><ElButton @click="load"
      >Retry map</ElButton
    ></template
  ><template v-else-if="world"
    ><div class="table-toolbar">
      <ElSelect v-model="selected" filterable aria-label="Select a country" style="width: 230px"
        ><ElOption
          v-for="location in world.locations"
          :key="location.id"
          :value="location.id"
          :label="location.name"
      /></ElSelect>
    </div>
    <div class="world-map">
      <svg :viewBox="world.viewBox" role="img" aria-label="Interactive world map">
        <path
          v-for="location in world.locations"
          :key="location.id"
          :d="location.path"
          :class="{ selected: location.id === selected }"
          @click="selected = location.id"
          @mouseenter="hover = location.id"
          @mouseleave="hover = ''"
        >
          <title>{{ location.name }}</title>
        </path>
      </svg>
    </div>
    <p role="status">
      <ElTag>{{ country?.name }}</ElTag>
      <span class="muted">Geographic selection preview; no geographic metrics are implied.</span>
    </p></template
  >
</template>
