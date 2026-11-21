<script setup lang="ts">
import { ElCard } from 'element-plus'
defineProps<{ title?: string; description?: string }>()
</script>
<template>
  <ElCard shadow="never" class="section-card"
    ><template v-if="title" #header
      ><div class="section-heading">
        <div>
          <h2>{{ title }}</h2>
          <p v-if="description" class="muted">{{ description }}</p>
        </div>
        <slot name="actions" /></div></template
    ><slot
  /></ElCard>
</template>
