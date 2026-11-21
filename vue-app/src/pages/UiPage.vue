<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ElButton,
  ElButtonGroup,
  ElCheckbox,
  ElCheckboxGroup,
  ElRadioGroup,
  ElRadioButton,
  ElSwitch,
  ElTabs,
  ElTabPane,
  ElCollapse,
  ElCollapseItem,
  ElProgress,
  ElSlider,
  ElNotification,
  ElMessage,
  ElAlert,
  ElTag,
  ElBadge,
  ElAvatar,
  ElTooltip,
  ElPopover,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElImage,
  ElCarousel,
  ElCarouselItem,
  ElTree,
  ElRow,
  ElCol,
  ElEmpty,
} from 'element-plus'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
import StatCard from '../components/display/StatCard.vue'
import DialogExamples from '../components/display/DialogExamples.vue'
import ChartView from '../components/charts/ChartView.vue'
import { usePage } from '../composables/usePage'
const page = usePage(),
  id = computed(() => page.value.id),
  tab = ref('home'),
  checks = ref(['Email']),
  choice = ref('One'),
  enabled = ref(true),
  progress = ref(55),
  range = ref([20, 70]),
  animation = ref(''),
  cards = ref([1, 2, 3]),
  busy = ref(0)
const tones = ['primary', 'success', 'warning', 'danger', 'info'] as const
const images = Array.from({ length: 6 }, (_, i) => '/assets/images/gallery/' + (i + 1) + '.jpg')
const tree = ref([
  {
    id: 1,
    label: 'Workspace',
    children: [
      { id: 2, label: 'Dashboard' },
      { id: 3, label: 'Reports' },
    ],
  },
  {
    id: 4,
    label: 'Projects',
    children: [
      { id: 5, label: 'Design' },
      { id: 6, label: 'Engineering' },
    ],
  },
])
function animate(name: string) {
  animation.value = ''
  requestAnimationFrame(() => {
    animation.value = name
    setTimeout(() => (animation.value = ''), 800)
  })
}
function refresh(n: number) {
  busy.value = n
  setTimeout(() => {
    busy.value = 0
    ElMessage.success('Sample widget refreshed')
  }, 400)
}
</script>
<template>
  <SectionCard
    v-if="id === 'ui-modals' || id === 'components-sweet-alert'"
    :title="id === 'ui-modals' ? 'Dialogs' : 'Alerts & confirmation'"
    ><DialogExamples
  /></SectionCard>
  <template v-else-if="id === 'ui-buttons'"
    ><SectionCard title="Button styles"
      ><div v-for="variant in ['solid', 'plain', 'round']" :key="variant" class="button-row">
        <ElButton
          v-for="tone in tones"
          :key="tone"
          :type="tone"
          :plain="variant === 'plain'"
          :round="variant === 'round'"
          @click="ElMessage.info(tone + ' button selected')"
          >{{ tone }}</ElButton
        >
      </div></SectionCard
    ><SectionCard title="Sizes & states"
      ><div class="button-row">
        <ElButton size="large" type="primary">Large</ElButton
        ><ElButton type="primary">Default</ElButton
        ><ElButton size="small" type="primary">Small</ElButton><ElButton disabled>Disabled</ElButton
        ><ElButton loading>Loading state</ElButton>
      </div>
      <ElButtonGroup
        ><ElButton @click="ElMessage.info('Previous selected')">Previous</ElButton
        ><ElButton @click="ElMessage.info('Next selected')">Next</ElButton></ElButtonGroup
      ></SectionCard
    ></template
  >
  <SectionCard v-else-if="id === 'ui-checkbox-radio'" title="Checkboxes, radios & switches"
    ><div class="control-stack">
      <ElCheckboxGroup v-model="checks"
        ><ElCheckbox value="Email">Email</ElCheckbox><ElCheckbox value="SMS">SMS</ElCheckbox
        ><ElCheckbox disabled>Disabled</ElCheckbox></ElCheckboxGroup
      ><ElRadioGroup v-model="choice"
        ><ElRadioButton value="One">One</ElRadioButton><ElRadioButton value="Two">Two</ElRadioButton
        ><ElRadioButton value="Three">Three</ElRadioButton></ElRadioGroup
      ><ElSwitch v-model="enabled" active-text="Notifications on" inactive-text="Off" />
      <p role="status">Selected: {{ checks.join(', ') || 'None' }} · {{ choice }}</p>
    </div></SectionCard
  >
  <SectionCard v-else-if="id === 'ui-tabs'" title="Tabs & accordions"
    ><ElTabs v-model="tab"
      ><ElTabPane label="Home" name="home"
        ><h3>Home</h3>
        <p>Manage your workspace from a single place.</p></ElTabPane
      ><ElTabPane label="Profile" name="profile"
        ><h3>Profile</h3>
        <p>John Doe · Administrator</p></ElTabPane
      ><ElTabPane label="Messages" name="messages"
        ><h3>Messages</h3>
        <RouterLink to="/mail/inbox">Open inbox</RouterLink></ElTabPane
      ></ElTabs
    ><ElCollapse accordion
      ><ElCollapseItem v-for="n in 3" :key="n" :name="n" :title="'Accordion section ' + n"
        ><p>
          This section is controlled by Vue state and supports keyboard interaction.
        </p></ElCollapseItem
      ></ElCollapse
    ></SectionCard
  >
  <SectionCard v-else-if="id === 'ui-progressbars'" title="Progress indicators"
    ><div class="control-stack">
      <ElProgress :percentage="progress" /><ElProgress
        :percentage="100"
        status="success"
      /><ElProgress :percentage="55" status="warning" /><ElProgress
        :percentage="35"
        status="exception"
      />
      <div class="button-row">
        <ElProgress type="circle" :percentage="progress" /><ElProgress
          type="dashboard"
          :percentage="progress"
        />
      </div>
      <ElSlider v-model="progress" aria-label="Progress percentage" /></div
  ></SectionCard>
  <SectionCard v-else-if="id === 'components-range-sliders'" title="Range sliders"
    ><div class="control-stack">
      <label>Value<ElSlider v-model="progress" show-input /></label
      ><label>Range<ElSlider v-model="range" range /></label
      ><label>Stepped value<ElSlider v-model="progress" :step="10" show-stops /></label
      ><ElSlider :model-value="45" disabled />
      <p role="status">Range: {{ range.join(' – ') }}</p>
    </div></SectionCard
  >
  <SectionCard v-else-if="id === 'ui-notification'" title="Messages & notifications"
    ><div class="button-row">
      <ElButton
        v-for="type in ['success', 'warning', 'info', 'error'] as const"
        :key="type"
        @click="
          ElNotification({
            title: type[0]!.toUpperCase() + type.slice(1),
            message: 'This is a sample ' + type + ' notification.',
            type,
          })
        "
        >{{ type }} notification</ElButton
      ><ElButton @click="ElMessage.success('Sample action completed')">Show message</ElButton>
    </div>
    <div class="control-stack">
      <ElAlert
        v-for="type in ['success', 'warning', 'info', 'error'] as const"
        :key="type"
        :title="'Sample ' + type + ' alert'"
        :type="type"
        show-icon
      /></div
  ></SectionCard>
  <SectionCard v-else-if="id === 'ui-images'" title="Images & preview"
    ><div class="gallery-grid">
      <ElImage
        v-for="(image, i) in images"
        :key="image"
        :src="image"
        :alt="'Gallery sample ' + (i + 1)"
        :preview-src-list="images"
        :initial-index="i"
        fit="cover"
        lazy
      /></div
  ></SectionCard>
  <SectionCard v-else-if="id === 'ui-carousel'" title="Image carousel"
    ><ElCarousel height="380px" :autoplay="false" indicator-position="outside"
      ><ElCarouselItem v-for="(image, i) in images" :key="image"
        ><img
          :src="image"
          :alt="'Carousel slide ' + (i + 1)"
          class="carousel-image" /></ElCarouselItem></ElCarousel
  ></SectionCard>
  <SectionCard
    v-else-if="id === 'components-nestable-list'"
    title="Nested items"
    description="Drag items to reorder them or move them between groups."
    ><ElTree
      :data="tree"
      node-key="id"
      draggable
      default-expand-all
      :expand-on-click-node="false"
    />
    <p class="muted">Changes remain in this page.</p></SectionCard
  >
  <SectionCard v-else-if="id === 'components-grid'" title="Responsive grid"
    ><div v-for="count in [2, 3, 4, 6]" :key="count" class="grid-example">
      <ElRow :gutter="16"
        ><ElCol v-for="n in count" :key="n" :xs="24" :sm="24 / count"
          ><div class="grid-cell">{{ 24 / count }} / 24</div></ElCol
        ></ElRow
      >
    </div></SectionCard
  >
  <SectionCard v-else-if="id === 'components-animation'" title="Motion examples"
    ><div class="animation-preview" :class="animation">Ubold</div>
    <div class="button-row">
      <ElButton
        v-for="name in ['fade', 'slide', 'pulse', 'rotate']"
        :key="name"
        @click="animate(name)"
        >{{ name }}</ElButton
      >
    </div>
    <p class="muted">Reduced-motion preferences are respected.</p></SectionCard
  >
  <template v-else-if="id === 'components-widgets'"
    ><div class="stat-grid">
      <StatCard
        v-for="(label, i) in ['Revenue', 'Orders', 'Conversion', 'Visitors']"
        :key="label"
        :label="label"
        :value="['$31,570', '280', '0.16%', '64,570'][i]!"
        trend="Sample data"
        :icon="i"
      />
    </div>
    <div class="two-column">
      <SectionCard title="Activity"><ChartView kind="line" /></SectionCard
      ><SectionCard title="Completion"
        ><ElProgress type="dashboard" :percentage="80" color="#5fbeaa"
      /></SectionCard></div
  ></template>
  <SectionCard v-else-if="id === 'ui-typography'" title="Typography"
    ><h1>Heading one</h1>
    <h2>Heading two</h2>
    <h3>Heading three</h3>
    <p>Body text provides the context people need to make decisions.</p>
    <p class="muted">Muted text for supporting information.</p>
    <blockquote>Good interfaces make the next step clear.</blockquote>
    <ul>
      <li>Unordered list item</li>
      <li>Another item</li>
    </ul>
    <ol>
      <li>First step</li>
      <li>Second step</li>
    </ol>
    <p><strong>Strong text</strong> · <em>Emphasis</em> · <code>Inline code</code></p></SectionCard
  >
  <SectionCard
    v-else-if="id === 'ui-bootstrap'"
    title="Common UI components"
    description="The original Bootstrap examples are implemented with Element Plus."
    ><div class="button-row">
      <ElTooltip content="Helpful context"><ElButton>Hover for tooltip</ElButton></ElTooltip
      ><ElPopover title="Popover" content="Additional contextual information." trigger="click"
        ><template #reference><ElButton>Open popover</ElButton></template></ElPopover
      ><ElDropdown @command="ElMessage.info(String($event))"
        ><ElButton>Dropdown menu</ElButton
        ><template #dropdown
          ><ElDropdownMenu
            ><ElDropdownItem command="First action">First action</ElDropdownItem
            ><ElDropdownItem command="Second action">Second action</ElDropdownItem></ElDropdownMenu
          ></template
        ></ElDropdown
      ><ElBadge :value="3"><ElButton>Messages</ElButton></ElBadge>
    </div>
    <div class="button-row">
      <ElTag v-for="tone in tones" :key="tone" :type="tone">{{ tone }}</ElTag><ElAvatar
        src="/assets/images/users/avatar-1.jpg"
      /></div
  ></SectionCard>
  <template v-else
    ><div class="button-row">
      <ElButton v-if="cards.length < 3" @click="cards = [1, 2, 3]">Restore panels</ElButton>
    </div>
    <div class="three-column">
      <SectionCard v-for="n in cards" :key="n" :title="'Panel ' + n"
        ><p>Reusable panel content with independent Vue state.</p>
        <div class="button-row">
          <ElButton :loading="busy === n" :disabled="busy !== 0" @click="refresh(n)"
            >Refresh sample</ElButton
          ><ElButton type="danger" plain @click="cards = cards.filter((item) => item !== n)"
            >Close</ElButton
          >
        </div></SectionCard
      >
    </div>
    <ElEmpty v-if="!cards.length" description="All panels are closed"
      ><ElButton @click="cards = [1, 2, 3]">Restore panels</ElButton></ElEmpty
    ></template
  >
</template>
