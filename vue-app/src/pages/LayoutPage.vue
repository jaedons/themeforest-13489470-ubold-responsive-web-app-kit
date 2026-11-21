<script setup lang="ts">
import { ElButton, ElSwitch, ElEmpty, ElTag } from 'element-plus'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
import { usePage } from '../composables/usePage'
import { useLayoutStore } from '../app/stores/layout'
const page = usePage(),
  store = useLayoutStore()
</script>
<template>
  <SectionCard v-if="page.id === 'page-starter'" title="Starter page"
    ><ElEmpty description="A clean starting point for your next feature"
      ><RouterLink to="/ui/bootstrap"
        ><ElButton type="primary">Explore components</ElButton></RouterLink
      ></ElEmpty
    ></SectionCard
  ><SectionCard v-else :title="page.title"
    ><p v-if="page.id === 'layout-leftbar_2'">
      The user profile is displayed above the sidebar navigation. Select it to open the profile
      page.
    </p>
    <p>The application shell is shared across routes. Adjust its Vue-controlled state below.</p>
    <div class="control-stack">
      <label class="settings-row">Compact navigation <ElSwitch v-model="store.collapsed" /></label
      ><label class="settings-row">Dark appearance <ElSwitch v-model="store.dark" /></label>
    </div>
    <p class="muted">
      On small screens the same navigation opens in a drawer. The selected layout variant applies to
      the shared responsive shell.
    </p>
    <RouterLink to="/dashboard"
      ><ElButton type="primary">View dashboard</ElButton></RouterLink
    ></SectionCard
  >
</template>
