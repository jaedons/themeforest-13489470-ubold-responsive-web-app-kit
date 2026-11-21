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
  ElBadge,
  ElMessage,
} from 'element-plus'
import { Fold, Expand, Search, Bell, Setting, FullScreen } from '@element-plus/icons-vue'
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
const notificationsOpen = ref(false)
const notifications = ref([
  { text: 'New message from Tomaslau', path: '/mail/read?message=1', read: false },
  { text: 'Review recent orders', path: '/ecommerce/orders', read: false },
  { text: 'Your profile is ready', path: '/extras/profile', read: false },
])
function openNotification(item: { read: boolean }) {
  item.read = true
  notificationsOpen.value = false
}
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  } catch {
    ElMessage.info('Fullscreen is unavailable in this browser')
  }
}
const matches = computed(() =>
  search.value.trim()
    ? pages
        .filter((p) => `${p.title} ${p.module}`.toLowerCase().includes(search.value.toLowerCase()))
        .slice(0, 8)
    : [],
)
const section = computed(() => moduleNames[page.value?.module] || 'Workspace')
const profileSidebar = computed(() => page.value?.id === 'layout-leftbar_2')
const compactVariant = computed(() => page.value?.id === 'layout-menu-collapsed')
let previousCollapsed = store.collapsed
watch(
  compactVariant,
  (active, wasActive) => {
    if (active) {
      previousCollapsed = store.collapsed
      store.collapsed = true
    } else if (wasActive) store.collapsed = previousCollapsed
  },
  { immediate: true },
)
function toggle() {
  if (mobile.value) store.mobileOpen = !store.mobileOpen
  else store.collapsed = !store.collapsed
}
watch(
  () => route.path,
  async () => {
    store.mobileOpen = false
    search.value = ''
    await nextTick()
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  },
)
</script>
<template>
  <a class="skip-link" href="#workspace-main">Skip to content</a>
  <div
    class="workspace"
    :class="{
      'is-collapsed': store.collapsed,
      'small-sidebar': page?.id === 'layout-menu-small',
      'header-variant': page?.id === 'layout-header_2',
    }"
  >
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
      <ElButton
        text
        class="header-icon"
        aria-label="Notifications"
        @click="notificationsOpen = true"
        ><ElBadge
          :value="notifications.filter((n) => !n.read).length"
          :hidden="notifications.every((n) => n.read)"
          ><ElIcon><Bell /></ElIcon></ElBadge
      ></ElButton>
      <ElButton
        text
        class="header-icon fullscreen-control"
        aria-label="Toggle fullscreen"
        @click="toggleFullscreen"
        ><ElIcon><FullScreen /></ElIcon
      ></ElButton>
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
      <RouterLink
        v-if="profileSidebar"
        to="/extras/profile"
        class="sidebar-profile"
        aria-label="View John Doe profile"
      >
        <ElAvatar :size="store.collapsed ? 32 : 64" src="/assets/images/users/avatar-1.jpg" />
        <template v-if="!store.collapsed"
          ><strong>John Doe</strong><span class="muted">Administrator</span></template
        >
      </RouterLink>
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
      ><RouterLink
        v-if="profileSidebar"
        to="/extras/profile"
        class="sidebar-profile"
        @click="store.mobileOpen = false"
        ><ElAvatar :size="64" src="/assets/images/users/avatar-1.jpg" /><strong>John Doe</strong
        ><span>Administrator</span></RouterLink
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
    <ElDrawer v-model="notificationsOpen" title="Notifications" :size="340"
      ><ElButton @click="notifications.forEach((n) => (n.read = true))">Mark all as read</ElButton>
      <ul class="notification-list">
        <li v-for="item in notifications" :key="item.path">
          <RouterLink :to="item.path" @click="openNotification(item)">{{
            item.text
          }}</RouterLink><ElTag v-if="!item.read" size="small">New</ElTag>
        </li>
      </ul></ElDrawer
    >
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
