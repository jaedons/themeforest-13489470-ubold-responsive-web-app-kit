<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ElInput, ElMessage, ElEmpty } from 'element-plus'
import SectionCard from '../components/display/SectionCard.vue'
import { usePage } from '../composables/usePage'
const page = usePage(),
  query = ref('')
const icons = computed(() =>
  page.value.icons.filter((icon) => icon.toLowerCase().includes(query.value.toLowerCase())),
)
onMounted(() => {
  for (const filename of ['icons', 'glyphicons']) {
    if (!document.querySelector(`link[data-icon-font="${filename}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/assets/css/' + filename + '.css'
      link.dataset.iconFont = filename
      document.head.append(link)
    }
  }
})
async function copy(icon: string) {
  try {
    await navigator.clipboard.writeText(icon)
    ElMessage.success('Icon class copied')
  } catch {
    ElMessage.info(icon)
  }
}
</script>
<template>
  <SectionCard
    :title="page.title + ' icon catalog'"
    description="Original icon-font assets are preserved. New application controls use Element Plus Icons."
    ><ElInput
      v-model="query"
      placeholder="Search icon classes…"
      clearable
      aria-label="Search icons" />
    <p class="muted">{{ icons.length }} icons · select an icon to copy its class</p>
    <div class="icon-grid">
      <button v-for="icon in icons" :key="icon" @click="copy(icon)">
        <i :class="icon" aria-hidden="true" /><span>{{ icon }}</span>
      </button>
    </div>
    <ElEmpty v-if="!icons.length" description="No matching icons"
  /></SectionCard>
</template>
