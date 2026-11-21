<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElButton, ElResult } from 'element-plus'
import { usePage } from '../composables/usePage'
const page = usePage(),
  route = useRoute()
const code = computed(() => page.value?.id.match(/\d{3}/)?.[0] || '404')
const messages: Record<string, string> = {
  '400': 'The request could not be understood.',
  '403': 'You do not have access to this resource.',
  '404': 'We could not find the page you requested.',
  '500': 'Something went wrong on the server.',
  '503': 'The service is temporarily unavailable.',
}
</script>
<template>
  <div class="error-page">
    <h1 class="error-code" tabindex="-1">{{ code }}</h1>
    <ElResult
      :icon="code === '403' ? 'warning' : 'info'"
      :title="code === '404' ? 'Page not found' : 'Request unavailable'"
      :sub-title="messages[code]"
      ><template #extra
        ><RouterLink to="/dashboard"
          ><ElButton type="primary">Back to dashboard</ElButton></RouterLink
        ></template
      ></ElResult
    >
    <p v-if="!page" class="muted">{{ route.path }}</p>
  </div>
</template>
