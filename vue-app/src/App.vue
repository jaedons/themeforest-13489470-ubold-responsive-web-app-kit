<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import AdminLayout from './layouts/AdminLayout.vue'
import AccountLayout from './layouts/AccountLayout.vue'
import BlankLayout from './layouts/BlankLayout.vue'
const route = useRoute()
const layout = computed(() =>
  route.meta.layout === 'account'
    ? AccountLayout
    : route.meta.layout === 'blank'
      ? BlankLayout
      : AdminLayout,
)
</script>
<template>
  <ElConfigProvider :locale="en"
    ><component :is="layout"
      ><RouterView v-slot="{ Component }"
        ><component :is="Component" :key="route.path" /></RouterView></component
  ></ElConfigProvider>
</template>
