<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElDialog,
  ElMessage,
  ElEmpty,
  ElTag,
  ElUpload,
} from 'element-plus'
import { Star, StarFilled, Delete, Back } from '@element-plus/icons-vue'
import SectionCard from '../../components/display/SectionCard.vue'
import RichEditor from '../../components/forms/RichEditor.vue'
import { useMailStore } from './store'
import { usePage } from '../../composables/usePage'
const store = useMailStore(),
  page = usePage(),
  route = useRoute(),
  router = useRouter()
const folder = computed(() =>
    ['inbox', 'starred', 'trash'].includes(String(route.query.folder))
      ? String(route.query.folder)
      : 'inbox',
  ),
  query = ref(''),
  preview = ref(false),
  composeForm = ref<InstanceType<typeof ElForm>>()
const mode = computed(() =>
  page.value.id === 'apps-email-compose'
    ? 'compose'
    : page.value.id === 'apps-email-read'
      ? 'read'
      : 'inbox',
)
const messages = computed(() =>
  store.messages.filter(
    (message) =>
      (folder.value === 'starred'
        ? message.starred && message.folder !== 'trash'
        : message.folder === folder.value) &&
      (message.sender + ' ' + message.subject).toLowerCase().includes(query.value.toLowerCase()),
  ),
)
const current = computed(() =>
  store.messages.find((message) => message.id === String(route.query.message || '1')),
)
watch(
  [mode, current],
  () => {
    if (mode.value === 'read' && current.value) current.value.read = true
  },
  { immediate: true },
)
// Render preview as text so pasted HTML cannot inject executable content.
const previewBody = computed(() => {
  const document = new DOMParser().parseFromString(
    store.draft.body.replace(/<\/(p|h[1-6]|li)>/gi, '</$1>\n').replace(/<br\s*\/?\s*>/gi, '\n'),
    'text/html',
  )
  return document.body.textContent || ''
})
async function showPreview() {
  if (await composeForm.value?.validate().catch(() => false)) preview.value = true
}
function trash(id: string) {
  const item = store.messages.find((message) => message.id === id)
  if (item) {
    item.folder = 'trash'
    ElMessage.success('Moved to demo trash')
  }
}

function selectFolder(value: string) {
  router.push({ path: '/mail/inbox', query: { folder: value } })
}
function reply() {
  if (current.value) store.draft.subject = 'Re: ' + current.value.subject
  router.push('/mail/compose')
}
function removeCurrent() {
  if (current.value) trash(current.value.id)
  router.push('/mail/inbox')
}
</script>
<template>
  <div class="mail-layout">
    <SectionCard
      ><RouterLink to="/mail/compose"
        ><ElButton type="primary" class="full-width">Compose</ElButton></RouterLink
      >
      <nav class="mail-folders" aria-label="Mail folders">
        <button
          v-for="item in ['inbox', 'starred', 'trash']"
          :key="item"
          :class="{ active: folder === item }"
          @click="selectFolder(item)"
        >
          {{ item[0]!.toUpperCase() + item.slice(1) }}
          <ElTag size="small">{{
            item === 'starred'
              ? store.messages.filter((m) => m.starred && m.folder !== 'trash').length
              : store.messages.filter((m) => m.folder === item).length
          }}</ElTag>
        </button>
      </nav>
      <p class="muted">Mail is sample data. Messages are never sent to a server.</p></SectionCard
    >
    <SectionCard v-if="mode === 'inbox'" :title="folder[0]!.toUpperCase() + folder.slice(1)"
      ><ElInput v-model="query" clearable placeholder="Search mail…" aria-label="Search mail" />
      <div class="mail-list">
        <article v-for="message in messages" :key="message.id" :class="{ unread: !message.read }">
          <ElButton
            text
            :icon="message.starred ? StarFilled : Star"
            :aria-label="message.starred ? 'Unstar message' : 'Star message'"
            @click="message.starred = !message.starred"
          /><RouterLink :to="'/mail/read?message=' + message.id"
            ><b>{{ message.sender }}</b
            ><span>{{ message.subject }}</span
            ><small>{{ message.date }}</small></RouterLink
          ><ElButton
            v-if="message.folder !== 'trash'"
            text
            :icon="Delete"
            aria-label="Move to trash"
            @click="trash(message.id)"
          /><ElButton v-else text @click="message.folder = 'inbox'">Restore</ElButton>
        </article>
        <ElEmpty v-if="!messages.length" description="No messages in this view" /></div
    ></SectionCard>
    <SectionCard v-else-if="mode === 'compose'" title="Compose email"
      ><ElForm ref="composeForm" :model="store.draft" label-position="top"
        ><ElFormItem
          label="To"
          prop="to"
          :rules="[
            { required: true, message: 'Enter a recipient' },
            { type: 'email', message: 'Enter a valid email' },
          ]"
          ><ElInput v-model="store.draft.to" type="email" aria-label="Recipient" /></ElFormItem
        ><ElFormItem
          label="Subject"
          prop="subject"
          :rules="[{ required: true, whitespace: true, message: 'Enter a subject' }]"
          ><ElInput v-model="store.draft.subject" aria-label="Subject" /></ElFormItem
        ><ElFormItem label="Message"><RichEditor v-model="store.draft.body" /></ElFormItem
        ><ElUpload v-model:file-list="store.attachments" :auto-upload="false" :limit="5"
          ><ElButton>Select attachments</ElButton
          ><template #tip
            ><p class="muted">Attachments remain on your device and are not uploaded.</p></template
          ></ElUpload
        ></ElForm
      >
      <div class="action-bar">
        <ElButton @click="ElMessage.success('Draft retained in this workspace session')"
          >Save draft</ElButton
        ><ElButton type="primary" @click="showPreview">Preview message</ElButton>
      </div></SectionCard
    >
    <SectionCard v-else-if="current" :title="current.subject"
      ><template #actions
        ><RouterLink to="/mail/inbox"><ElButton :icon="Back">Inbox</ElButton></RouterLink></template
      >
      <p class="muted">From {{ current.sender }} · {{ current.date }}</p>
      <div class="mail-body">
        <p v-for="(paragraph, i) in current.body.split('\n')" :key="i">{{ paragraph }}</p>
      </div>
      <div class="action-bar">
        <ElButton @click="reply">Reply</ElButton
        ><ElButton type="danger" plain @click="removeCurrent">Move to trash</ElButton>
      </div></SectionCard
    ><SectionCard v-else
      ><ElEmpty description="Message not found"
        ><RouterLink to="/mail/inbox">Return to inbox</RouterLink></ElEmpty
      ></SectionCard
    >
  </div>
  <ElDialog v-model="preview" title="Message preview" width="620px"
    ><p><b>To:</b> {{ store.draft.to }}</p>
    <p><b>Subject:</b> {{ store.draft.subject }}</p>
    <div class="mail-preview-body">{{ previewBody }}</div>
    <ul v-if="store.attachments.length" aria-label="Attachments">
      <li v-for="file in store.attachments" :key="file.uid">{{ file.name }}</li>
    </ul>
    <p class="muted">
      Preview only — no mail service is configured. Your rich-text draft remains in the editor.
    </p>
    <template #footer
      ><ElButton type="primary" @click="preview = false">Back to draft</ElButton></template
    ></ElDialog
  >
</template>
