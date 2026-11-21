<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { ElSelect, ElOption, ElAlert, ElButton, ElTag } from 'element-plus'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
import { usePage } from '../composables/usePage'
const page = usePage()
const WorldMap = defineAsyncComponent(() => import('../features/maps/WorldMap.vue'))
const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
const embed = computed(() =>
  key
    ? 'https://www.google.com/maps/embed/v1/place?key=' +
      encodeURIComponent(key) +
      '&q=San+Francisco'
    : undefined,
)
</script>
<template>
  <SectionCard v-if="page.id === 'map-google'" title="Google Maps"
    ><template v-if="embed"
      ><iframe
        :src="embed"
        title="Google Maps: San Francisco"
        class="google-map"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade" /></template
    ><template v-else
      ><ElAlert
        title="Google Maps needs an external API key"
        description="Configure VITE_GOOGLE_MAPS_API_KEY with an enabled Maps Embed API key, restrict it to your site's origin, then rebuild. No external map is requested until configured."
        type="info"
        :closable="false"
        show-icon
      />
      <div class="centered-content">
        <h2>San Francisco</h2>
        <p class="muted">External map integration is not configured in this demo.</p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=San+Francisco"
          target="_blank"
          rel="noopener noreferrer"
          ><ElButton>Open Google Maps</ElButton></a
        >
      </div></template
    ></SectionCard
  ><SectionCard
    v-else
    title="World map"
    description="Select a country with the dropdown or the map."
    ><WorldMap
  /></SectionCard>
</template>
