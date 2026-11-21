import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { PageDefinition } from '../types'
export function usePage() {
  const route = useRoute()
  return computed(() => route.meta.page as PageDefinition)
}
