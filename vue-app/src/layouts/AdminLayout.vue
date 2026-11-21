<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElButton,
  ElIcon,
  ElDrawer,
  ElSwitch,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElInput,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTag,
  ElAvatar,
} from 'element-plus'
import { Fold, Expand, Search, Bell, Setting } from '@element-plus/icons-vue'
import AppNavigation from '../components/navigation/AppNavigation.vue'
import { useLayoutStore } from '../app/stores/layout'
import { useMobile } from '../composables/useMobile'
import { usePage } from '../composables/usePage'
import { moduleNames, pages } from '../app/catalog'
const store = useLayoutStore(),
  mobile = useMobile(),
  page = usePage(),
  route = useRoute(),
  router = useRouter()
const search = ref(''),
  settings = ref(false)
const matches = computed(() =>
  search.value.trim()
    ? pages
        .filter((p) => `${p.title} ${p.module}`.toLowerCase().includes(search.value.toLowerCase()))
        .slice(0, 8)
    : [],
)
const section = computed(() => moduleNames[page.value?.module] || 'Workspace')
function toggle() {
  if (mobile.value) store.mobileOpen = !store.mobileOpen
  else store.collapsed = !store.collapsed
}
watch(
  () => route.path,
  async () => {
    store.mobileOpen = false
    search.value = ''
    if (page.value?.id === 'layout-menu-collapsed' || page.value?.id === 'layout-menu-small')
      store.collapsed = true
    await nextTick()
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  },
)
</script>
<template>
  <a class="skip-link" href="#workspace-main">Skip to content</a>
  <div class="workspace" :class="{ 'is-collapsed': store.collapsed }">
    <header class="app-topbar">
      <RouterLink to="/dashboard" class="brand" aria-label="Ubold home"
        ><span>UB<span class="brand-dot">O</span>LD</span></RouterLink
      >
      <ElButton
        text
        class="header-icon"
        aria-label="Toggle navigation"
        data-testid="nav-toggle"
        @click="toggle"
        ><ElIcon><component :is="store.collapsed ? Expand : Fold" /></ElIcon
      ></ElButton>
      <div class="header-search">
        <ElInput
          v-model="search"
          placeholder="Find a page…"
          aria-label="Find a page"
          :prefix-icon="Search"
          clearable
        />
        <div v-if="search" class="search-results">
          <RouterLink v-for="item in matches" :key="item.id" :to="item.path"
            >{{ item.title }} <small>{{ moduleNames[item.module] }}</small></RouterLink
          >
          <p v-if="!matches.length">No matching pages</p>
        </div>
      </div>
      <span class="header-spacer" />
      <ElTag class="demo-tag" type="info" effect="plain">Demo workspace</ElTag>
      <ElButton text class="header-icon" aria-label="Open settings" @click="settings = true"
        ><ElIcon><Setting /></ElIcon
      ></ElButton>
      <ElDropdown @command="router.push(String($event))"
        ><button class="account-button" aria-label="Account menu">
          <ElAvatar :size="32" src="/assets/images/users/avatar-1.jpg" /><span
            >John Doe</span
          ></button
        ><template #dropdown
          ><ElDropdownMenu
            ><ElDropdownItem command="/extras/profile">Profile</ElDropdownItem
            ><ElDropdownItem command="/login">Account demo</ElDropdownItem></ElDropdownMenu
          ></template
        ></ElDropdown
      >
    </header>
    <aside v-if="!mobile" class="app-sidebar" aria-label="Main navigation">
      <div class="sidebar-caption">WORKSPACE</div>
      <AppNavigation :collapsed="store.collapsed" />
    </aside>
    <ElDrawer
      v-model="store.mobileOpen"
      direction="ltr"
      :size="260"
      title="Navigation"
      class="mobile-navigation"
      :with-header="true"
      ><AppNavigation @navigate="store.mobileOpen = false"
    /></ElDrawer>
    <div class="workspace-body">
      <main id="workspace-main" tabindex="-1">
        <div class="page-heading">
          <div>
            <ElBreadcrumb separator="/"
              ><ElBreadcrumbItem :to="{ path: '/dashboard' }">Home</ElBreadcrumbItem
              ><ElBreadcrumbItem>{{ section }}</ElBreadcrumbItem></ElBreadcrumb
            >
            <h1 tabindex="-1">{{ page?.title }}</h1>
          </div>
          <span class="page-subtitle">{{
            page?.view === 'dashboard'
              ? 'Welcome to your Ubold workspace.'
              : section + ' · ' + page?.title
          }}</span>
        </div>
        <slot />
      </main>
      <footer class="app-footer">
        <span>Ubold Workspace</span><span>Vue 3 · Element Plus</span>
      </footer>
    </div>
    <ElDrawer v-model="settings" title="Workspace settings" :size="340"
      ><div class="settings-row">
        <span>Dark appearance</span><ElSwitch v-model="store.dark" aria-label="Dark appearance" />
      </div>
      <div class="settings-row">
        <span>Compact navigation</span
        ><ElSwitch v-model="store.collapsed" aria-label="Compact navigation" />
      </div>
      <p class="muted">
        Appearance is stored on this device. Page data remains in demo memory.
      </p></ElDrawer
    >
  </div>
</template>
