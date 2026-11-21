<script setup lang="ts">
import { ElMenu, ElSubMenu, ElMenuItem, ElIcon } from 'element-plus'
import {
  Grid,
  PieChart,
  Files,
  ShoppingBag,
  User,
  Setting,
  Message,
  Calendar,
  List,
  Edit,
  Location,
  Picture,
  Warning,
  Menu,
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { navigation } from '../../app/catalog'
defineProps<{ collapsed?: boolean }>()
const emit = defineEmits<{ navigate: [] }>()
const route = useRoute()
const icons: Record<string, unknown> = {
  dashboard: Grid,
  charts: PieChart,
  crm: User,
  ecommerce: ShoppingBag,
  forms: Edit,
  tables: List,
  maps: Location,
  icons: Picture,
  errors: Warning,
  authentication: User,
  layouts: Setting,
  'applications/mail': Message,
  'applications/calendar': Calendar,
}
</script>
<template>
  <ElMenu
    :default-active="route.path"
    :collapse="collapsed"
    :collapse-transition="false"
    router
    class="app-menu"
    @select="emit('navigate')"
  >
    <ElSubMenu v-for="group in navigation" :key="group.key" :index="group.key">
      <template #title
        ><ElIcon><component :is="icons[group.key] || Menu" /></ElIcon
        ><span>{{ group.label }}</span></template
      >
      <ElMenuItem v-for="page in group.pages" :key="page.id" :index="page.path">{{
        page.title
      }}</ElMenuItem>
    </ElSubMenu>
  </ElMenu>
</template>
