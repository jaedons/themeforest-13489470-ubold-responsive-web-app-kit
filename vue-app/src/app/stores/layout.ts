import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
export const useLayoutStore = defineStore('layout', () => {
  const collapsed = ref(false)
  const mobileOpen = ref(false)
  const dark = ref(false)
  try {
    dark.value = localStorage.getItem('ubold-dark') === 'true'
  } catch {
    /* preferences are optional */
  }
  watch(
    dark,
    (value) => {
      document.documentElement.classList.toggle('dark', value)
      try {
        localStorage.setItem('ubold-dark', String(value))
      } catch {
        /* private browsing */
      }
    },
    { immediate: true },
  )
  return { collapsed, mobileOpen, dark }
})
