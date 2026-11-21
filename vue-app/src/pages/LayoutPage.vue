<script setup lang="ts">
import { ElButton, ElSwitch, ElEmpty, ElTag, ElAvatar } from 'element-plus'
import SectionCard from '../components/display/SectionCard.vue'
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
    ><div v-if="page.id === 'layout-leftbar_2'" class="profile-heading">
      <ElAvatar :size="64" src="/assets/images/users/avatar-1.jpg" />
      <div>
        <h2>John Doe</h2>
        <ElTag>Administrator</ElTag>
      </div>
    </div>
    <p>The application shell is shared across routes. Adjust its Vue-controlled state below.</p>
    <div class="control-stack">
      <label class="settings-row">Compact navigation <ElSwitch v-model="store.collapsed" /></label
      ><label class="settings-row">Dark appearance <ElSwitch v-model="store.dark" /></label>
    </div>
    <p class="muted">
      On small screens the same navigation opens in a drawer. Header and sidebar variants are
      consolidated into the shared responsive layout.
    </p>
    <RouterLink to="/dashboard"
      ><ElButton type="primary">View dashboard</ElButton></RouterLink
    ></SectionCard
  >
</template>
