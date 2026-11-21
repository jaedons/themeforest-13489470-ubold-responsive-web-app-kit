<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElTimeline,
  ElTimelineItem,
  ElImage,
  ElRadioGroup,
  ElRadioButton,
  ElButton,
  ElDialog,
  ElSwitch,
  ElTag,
  ElAvatar,
  ElDescriptions,
  ElDescriptionsItem,
  ElInput,
  ElForm,
  ElFormItem,
  ElMessage,
  ElEmpty,
  ElResult,
  ElCountdown,
  ElTree,
  ElProgress,
} from 'element-plus'
import SectionCard from '../components/display/SectionCard.vue'
import InvoiceView from '../components/display/InvoiceView.vue'
import { usePage } from '../composables/usePage'
import { pages, navigation } from '../app/catalog'
const page = usePage(),
  id = computed(() => page.value.id),
  query = ref(''),
  filter = ref('All'),
  annual = ref(false),
  dialog = ref(false),
  plan = ref(''),
  formRef = ref<InstanceType<typeof ElForm>>()
const profile = reactive({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Administrator',
  bio: 'Designer and developer working on the Ubold workspace.',
})
const images = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    src: '/assets/images/gallery/' + (i + 1) + '.jpg',
    category: ['Nature', 'People', 'Architecture'][i % 3],
  })).filter((image) => filter.value === 'All' || image.category === filter.value),
)
const searchResults = computed(() =>
  pages.filter((item) =>
    (item.title + ' ' + item.module).toLowerCase().includes(query.value.toLowerCase()),
  ),
)
const faqs = [
  [
    'What is Ubold?',
    'Ubold is a responsive administration template. This edition uses Vue and Element Plus.',
  ],
  [
    'Are changes saved to a server?',
    'No. Business actions use demonstration data in the current page or workspace session.',
  ],
  [
    'How do I navigate the workspace?',
    'Use the sidebar or the page search in the header. Existing HTML addresses redirect to Vue routes.',
  ],
  [
    'Can I use it on a phone?',
    'Yes. Navigation moves into a drawer and content adapts to the available width.',
  ],
  [
    'Where can I edit my profile?',
    'Use the account menu or open the Profile page. Profile changes in this demonstration remain local.',
  ],
]
const profileDraft = reactive({ ...profile })
function editProfile() {
  Object.assign(profileDraft, profile)
  dialog.value = true
}
const deadline = Date.now() + 7 * 86400000
async function saveProfile() {
  if (await formRef.value?.validate().catch(() => false)) {
    Object.assign(profile, profileDraft)
    dialog.value = false
    ElMessage.success('Profile updated in this page')
  }
}

function previewPlan(name: string) {
  plan.value = name
  dialog.value = true
}
</script>
<template>
  <SectionCard v-if="id === 'extra-invoice'"><InvoiceView /></SectionCard>
  <SectionCard v-else-if="id === 'extra-faq'" title="Frequently asked questions"
    ><ElInput
      v-model="query"
      placeholder="Search questions…"
      aria-label="Search questions"
      clearable /><ElCollapse accordion
      ><ElCollapseItem
        v-for="(faq, i) in faqs.filter((f) =>
          f.join(' ').toLowerCase().includes(query.toLowerCase()),
        )"
        :key="i"
        :title="faq[0]"
        :name="i"
        ><p>{{ faq[1] }}</p></ElCollapseItem
      ></ElCollapse
    ><ElEmpty
      v-if="!faqs.some((f) => f.join(' ').toLowerCase().includes(query.toLowerCase()))"
      description="No matching questions"
  /></SectionCard>
  <SectionCard v-else-if="id === 'extra-gallery'" title="Gallery"
    ><template #actions
      ><ElRadioGroup v-model="filter"
        ><ElRadioButton
          v-for="category in ['All', 'Nature', 'People', 'Architecture']"
          :key="category"
          :value="category"
          >{{ category }}</ElRadioButton
        ></ElRadioGroup
      ></template
    >
    <div class="gallery-grid">
      <figure v-for="(image, i) in images" :key="image.src">
        <ElImage
          :src="image.src"
          :alt="image.category + ' sample'"
          :preview-src-list="images.map((item) => item.src)"
          :initial-index="i"
          fit="cover"
          lazy
        />
        <figcaption>{{ image.category }}</figcaption>
      </figure>
    </div></SectionCard
  >
  <SectionCard v-else-if="id === 'extra-profile'" title="Profile"
    ><template #actions
      ><ElButton type="primary" @click="editProfile">Edit profile</ElButton></template
    >
    <div class="profile-heading">
      <ElAvatar :size="96" src="/assets/images/users/avatar-1.jpg" />
      <div>
        <h2>{{ profile.name }}</h2>
        <ElTag>{{ profile.role }}</ElTag>
        <p>{{ profile.bio }}</p>
      </div>
    </div>
    <ElDescriptions :column="1" border
      ><ElDescriptionsItem label="Email">{{ profile.email }}</ElDescriptionsItem
      ><ElDescriptionsItem label="Location">San Francisco</ElDescriptionsItem
      ><ElDescriptionsItem label="Projects">Ubold Workspace</ElDescriptionsItem></ElDescriptions
    >
    <div class="two-column profile-details">
      <SectionCard title="Biography"
        ><p>{{ profile.bio }}</p>
        <h3>Skills</h3>
        <div
          v-for="skill in [
            { name: 'Angular', value: 60 },
            { name: 'Javascript', value: 90 },
            { name: 'Wordpress', value: 80 },
            { name: 'HTML/CSS', value: 95 },
          ]"
          :key="skill.name"
          class="product-progress"
        >
          <span>{{ skill.name }}</span><ElProgress :percentage="skill.value" /></div></SectionCard
      ><SectionCard title="Activity"
        ><ElTimeline
          ><ElTimelineItem timestamp="Today">John Doe updated the Ubold project.</ElTimelineItem
          ><ElTimelineItem timestamp="Yesterday">Shared the latest design review.</ElTimelineItem
          ><ElTimelineItem timestamp="This week"
            >Completed the dashboard milestone.</ElTimelineItem
          ></ElTimeline
        >
        <h3>My Office</h3>
        <p>San Francisco · United States</p>
        <RouterLink to="/maps/google">View office map</RouterLink></SectionCard
      >
    </div>
    <ElDialog v-model="dialog" title="Edit profile" width="520px"
      ><ElForm ref="formRef" :model="profileDraft" label-position="top"
        ><ElFormItem label="Name" prop="name" :rules="[{ required: true, message: 'Enter a name' }]"
          ><ElInput v-model="profileDraft.name" aria-label="Name" /></ElFormItem
        ><ElFormItem
          label="Email"
          prop="email"
          :rules="[
            { required: true, message: 'Enter an email' },
            { type: 'email', message: 'Enter a valid email' },
          ]"
          ><ElInput v-model="profileDraft.email" aria-label="Email" /></ElFormItem
        ><ElFormItem label="Bio"
          ><ElInput v-model="profileDraft.bio" type="textarea" /></ElFormItem></ElForm
      ><template #footer
        ><ElButton @click="dialog = false">Close</ElButton
        ><ElButton type="primary" @click="saveProfile">Save changes</ElButton></template
      ></ElDialog
    ></SectionCard
  >
  <template v-else-if="id === 'extra-pricing'"
    ><div class="pricing-toggle">
      <ElSwitch v-model="annual" active-text="Annual billing" inactive-text="Monthly" /><ElTag
        v-if="annual"
        type="success"
        >Save 20%</ElTag
      >
    </div>
    <div class="three-column">
      <SectionCard
        v-for="(name, i) in ['Starter', 'Professional', 'Business']"
        :key="name"
        :title="name"
        ><div class="price">
          ${{ Math.round([19, 49, 99][i]! * (annual ? 0.8 : 1)) }}<small>/ month</small>
        </div>
        <p class="muted">
          {{ ['For personal projects', 'For growing teams', 'For larger organizations'][i] }}
        </p>
        <ul class="pricing-features">
          <li>{{ [3, 10, 50][i] }} projects</li>
          <li>{{ [1, 5, 25][i] }} team members</li>
          <li>Dashboard and reports</li>
          <li>Community support</li>
        </ul>
        <ElButton :type="i === 1 ? 'primary' : 'default'" @click="previewPlan(name)"
          >Preview {{ name }}</ElButton
        ></SectionCard
      >
    </div>
    <ElDialog v-model="dialog" title="Plan preview" width="460px"
      ><h2>{{ plan }}</h2>
      <p>Pricing is sample content. No subscription, payment or billing service is connected.</p>
      <template #footer
        ><ElButton type="primary" @click="dialog = false">Close preview</ElButton></template
      ></ElDialog
    ></template
  >
  <SectionCard v-else-if="id === 'extra-search-result'" title="Search workspace"
    ><ElInput v-model="query" placeholder="Search pages…" clearable aria-label="Search workspace" />
    <p class="muted" role="status">{{ searchResults.length }} results</p>
    <div class="search-list">
      <article v-for="item in searchResults" :key="item.id">
        <RouterLink :to="item.path"
          ><h2>{{ item.title }}</h2></RouterLink
        >
        <p class="muted">{{ item.module }} · {{ item.path }}</p>
      </article>
    </div>
    <ElEmpty v-if="!searchResults.length" description="No matching pages"
  /></SectionCard>
  <SectionCard v-else-if="id === 'extra-sitemap'" title="Workspace sitemap"
    ><div class="three-column">
      <section v-for="group in navigation" :key="group.key">
        <h2>{{ group.label }}</h2>
        <ul class="sitemap-links">
          <li v-for="item in group.pages" :key="item.id">
            <RouterLink :to="item.path">{{ item.title }}</RouterLink>
          </li>
        </ul>
      </section>
    </div></SectionCard
  >
  <SectionCard v-else-if="id === 'extra-timeline'" title="Activity timeline"
    ><ElTimeline
      ><ElTimelineItem
        v-for="(activity, i) in [
          'Workspace created',
          'Dashboard review completed',
          'Product catalog updated',
          'Design handoff completed',
          'Release review scheduled',
        ]"
        :key="i"
        :timestamp="
          ['Today, 10:30', 'Yesterday, 15:00', 'Monday, 11:00', 'Last week', 'Next week'][i]
        "
        :type="i === 0 ? 'primary' : 'info'"
        ><h3>{{ activity }}</h3>
        <p class="muted">Sample workspace activity by John Doe.</p></ElTimelineItem
      ></ElTimeline
    ></SectionCard
  >
  <SectionCard v-else-if="id === 'extra-coming-soon'" title="Something new is coming"
    ><div class="centered-content">
      <h2>We are preparing the next workspace experience.</h2>
      <p class="muted">Sample countdown, set to seven days from opening this page.</p>
      <ElCountdown
        title="Time remaining"
        :value="deadline"
        format="DD [days] HH:mm:ss"
      /><RouterLink to="/dashboard"
        ><ElButton type="primary">Explore the demo</ElButton></RouterLink
      >
    </div></SectionCard
  >
  <SectionCard v-else-if="id === 'extra-maintenance'" title="Maintenance"
    ><ElResult
      icon="info"
      title="We will be back soon"
      sub-title="This is the maintenance-page demonstration. The rest of the workspace remains available."
      ><template #extra
        ><RouterLink to="/dashboard"
          ><ElButton type="primary">Back to dashboard</ElButton></RouterLink
        ></template
      ></ElResult
    ></SectionCard
  >
  <SectionCard v-else title="Email template preview"
    ><article class="email-preview">
      <header>UBOLD WORKSPACE</header>
      <h2>Welcome to Ubold!</h2>
      <p>Hello John,</p>
      <p>Your workspace brings dashboards, customer information and project tools together.</p>
      <RouterLink to="/dashboard"><ElButton type="primary">Open workspace</ElButton></RouterLink>
      <p class="muted">This is an in-browser email preview. No email has been sent.</p>
    </article></SectionCard
  >
</template>
