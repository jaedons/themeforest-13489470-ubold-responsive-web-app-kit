<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ElInput,
  ElButton,
  ElAvatar,
  ElTag,
  ElDialog,
  ElForm,
  ElFormItem,
  ElMessage,
  ElEmpty,
} from 'element-plus'
import SectionCard from '../../components/display/SectionCard.vue'
const query = ref(''),
  dialog = ref(false),
  name = ref(''),
  email = ref(''),
  form = ref<InstanceType<typeof ElForm>>()
const contacts = ref([
  { name: 'Tomaslau', email: 'tomaslau@dummy.com', role: 'Designer', image: 2 },
  { name: 'Chadengle', email: 'chad@dummy.com', role: 'Developer', image: 3 },
  { name: 'Stillnotdavid', email: 'david@dummy.com', role: 'Product manager', image: 4 },
  { name: 'Kurafire', email: 'kurafire@dummy.com', role: 'Designer', image: 5 },
  { name: 'John Doe', email: 'john@dummy.com', role: 'Administrator', image: 1 },
  { name: 'Ok', email: 'ok@dummy.com', role: 'Developer', image: 6 },
])
const filtered = computed(() =>
  contacts.value.filter((item) =>
    (item.name + ' ' + item.email).toLowerCase().includes(query.value.toLowerCase()),
  ),
)
async function save() {
  if (!(await form.value?.validate().catch(() => false))) return
  contacts.value.push({ name: name.value, email: email.value, role: 'Contact', image: 1 })
  dialog.value = false
  ElMessage.success('Contact added in demo memory')
  name.value = ''
  email.value = ''
}
</script>
<template>
  <SectionCard title="Contacts"
    ><div class="table-toolbar">
      <ElInput
        v-model="query"
        clearable
        placeholder="Search contacts…"
        aria-label="Search contacts"
      /><ElButton type="primary" @click="dialog = true">Add contact</ElButton>
    </div>
    <div class="contact-grid">
      <article v-for="contact in filtered" :key="contact.email" class="contact-card">
        <ElAvatar :size="70" :src="'/assets/images/users/avatar-' + contact.image + '.jpg'" />
        <h2>{{ contact.name }}</h2>
        <ElTag type="info">{{ contact.role }}</ElTag>
        <p>
          <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
        </p>
      </article>
    </div>
    <ElEmpty v-if="!filtered.length" description="No matching contacts" /></SectionCard
  ><ElDialog v-model="dialog" title="Add contact" width="460px"
    ><ElForm ref="form" :model="{ name, email }" label-position="top"
      ><ElFormItem label="Name" prop="name" :rules="[{ required: true, message: 'Enter a name' }]"
        ><ElInput v-model="name" /></ElFormItem
      ><ElFormItem
        label="Email"
        prop="email"
        :rules="[
          { required: true, message: 'Enter an email' },
          { type: 'email', message: 'Enter a valid email' },
        ]"
        ><ElInput v-model="email" /></ElFormItem></ElForm
    ><template #footer
      ><ElButton @click="dialog = false">Cancel</ElButton
      ><ElButton type="primary" @click="save">Add contact</ElButton></template
    ></ElDialog
  >
</template>
