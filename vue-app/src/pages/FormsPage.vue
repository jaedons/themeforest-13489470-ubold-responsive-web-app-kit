<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElSwitch,
  ElRadioGroup,
  ElRadioButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElTimePicker,
  ElColorPicker,
  ElSlider,
  ElRate,
  ElCascader,
  ElTransfer,
  ElButton,
  ElMessage,
  ElAlert,
  ElDialog,
  ElDescriptions,
  ElDescriptionsItem,
} from 'element-plus'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
import RichEditor from '../components/forms/RichEditor.vue'
import UploadPanel from '../components/forms/UploadPanel.vue'
import ImageCropper from '../components/forms/ImageCropper.vue'
import FormWizard from '../components/forms/FormWizard.vue'
import { usePage } from '../composables/usePage'
const page = usePage(),
  id = computed(() => page.value.id)
const formRef = ref<InstanceType<typeof ElForm>>(),
  saved = ref(false),
  edit = ref(false)
const initialValues = () => ({
  name: '',
  email: '',
  password: '',
  confirm: '',
  country: '',
  quantity: 1,
  enabled: true,
  choice: 'Option A',
  checks: ['Email'],
  date: '',
  range: [],
  time: '',
  color: '#5fbeaa',
  slider: 35,
  rating: 4,
  cascader: [],
  transfer: [],
  phone: '',
  postal: '',
  card: '',
  message: '',
})
const data = reactive(initialValues())
const editableProfile = reactive({
  name: 'John Doe',
  email: 'john@example.com',
  country: 'United States',
})
const profileDraft = reactive({ ...editableProfile })
function openProfile() {
  Object.assign(profileDraft, editableProfile)
  edit.value = true
}
async function saveProfile() {
  if (await formRef.value?.validate().catch(() => false)) {
    Object.assign(editableProfile, profileDraft)
    edit.value = false
    ElMessage.success('Profile updated in this page')
  }
}
const editor = ref(
  '<h2>Welcome to Ubold</h2><p>Edit this document using the Vue editor toolbar.</p>',
)
const options = [
  {
    value: 'design',
    label: 'Design',
    children: [
      { value: 'product', label: 'Product design' },
      { value: 'brand', label: 'Brand design' },
    ],
  },
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
    ],
  },
]
const rules = {
  name: [{ required: true, whitespace: true, message: 'Enter your name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Enter your email', trigger: 'blur' },
    { type: 'email' as const, message: 'Enter a valid email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Enter a password', trigger: 'blur' },
    { min: 8, message: 'Use at least 8 characters', trigger: 'blur' },
  ],
  confirm: [
    {
      validator: (_r: unknown, value: string, cb: (error?: Error) => void) =>
        cb(value === data.password ? undefined : new Error('Passwords do not match')),
      trigger: 'blur',
    },
  ],
}
function reset() {
  Object.assign(data, initialValues())
  formRef.value?.clearValidate()
  saved.value = false
}
async function submit() {
  if (await formRef.value?.validate().catch(() => false)) {
    saved.value = true
    edit.value = false
    ElMessage.success('Form validated in this page')
  }
}
function mask(key: 'phone' | 'postal' | 'card', value: string) {
  const digits = value.replace(/\D/g, '')
  data[key] =
    key === 'phone'
      ? digits.slice(0, 10).replace(/(\d{3})(\d{3})(\d{1,4})/, '($1) $2-$3')
      : key === 'card'
        ? digits
            .slice(0, 16)
            .replace(/(.{4})/g, '$1 ')
            .trim()
        : digits.slice(0, 5)
}
</script>
<template>
  <SectionCard v-if="id === 'form-wizard'" title="Step-by-step form"><FormWizard /></SectionCard>
  <SectionCard v-else-if="id === 'form-uploads'" title="File selection"
    ><UploadPanel
  /></SectionCard>
  <SectionCard v-else-if="id === 'form-image-crop'" title="Image crop"
    ><ImageCropper
  /></SectionCard>
  <SectionCard
    v-else-if="id === 'form-summernote' || id === 'form-wysiwig'"
    title="Rich text editor"
    description="The original editor demonstrations are consolidated into the Vue-native Tiptap editor."
    ><RichEditor v-model="editor" />
    <div class="action-bar">
      <span class="muted">{{ editor.replace(/<[^>]*>/g, '').length }} characters</span
      ><ElButton @click="editor = '<p></p>'">Clear document</ElButton
      ><ElButton type="primary" @click="ElMessage.success('Document retained in this page')"
        >Keep demo document</ElButton
      >
    </div></SectionCard
  >
  <SectionCard v-else-if="id === 'form-xeditable'" title="Editable profile"
    ><ElDescriptions :column="1" border
      ><ElDescriptionsItem label="Name">{{ editableProfile.name }}</ElDescriptionsItem
      ><ElDescriptionsItem label="Email">{{ editableProfile.email }}</ElDescriptionsItem
      ><ElDescriptionsItem label="Country">{{
        editableProfile.country
      }}</ElDescriptionsItem></ElDescriptions
    ><ElButton type="primary" @click="openProfile">Edit profile</ElButton
    ><ElDialog v-model="edit" title="Edit profile" width="480px"
      ><ElForm
        ref="formRef"
        :model="profileDraft"
        :rules="{ name: rules.name, email: rules.email }"
        label-position="top"
        ><ElFormItem label="Name" prop="name"
          ><ElInput v-model="profileDraft.name" aria-label="Name" /></ElFormItem
        ><ElFormItem label="Email" prop="email"
          ><ElInput v-model="profileDraft.email" aria-label="Email" /></ElFormItem
        ><ElFormItem label="Country"><ElInput v-model="profileDraft.country" /></ElFormItem></ElForm
      ><template #footer
        ><ElButton @click="edit = false">Cancel</ElButton
        ><ElButton type="primary" @click="saveProfile">Save changes</ElButton></template
      ></ElDialog
    ></SectionCard
  >
  <ElForm
    v-else
    ref="formRef"
    :model="data"
    :rules="id === 'form-validation' ? rules : {}"
    label-position="top"
    @submit.prevent="submit"
    ><div class="two-column">
      <SectionCard
        :title="
          id === 'form-pickers'
            ? 'Date & time'
            : id === 'form-mask'
              ? 'Input masks'
              : 'Form controls'
        "
      >
        <template v-if="id === 'form-pickers'"
          ><ElFormItem label="Date"
            ><ElDatePicker v-model="data.date" type="date" value-format="YYYY-MM-DD" /></ElFormItem
          ><ElFormItem label="Date range"
            ><ElDatePicker
              v-model="data.range"
              type="daterange"
              range-separator="to"
              start-placeholder="Start date"
              end-placeholder="End date" /></ElFormItem
          ><ElFormItem label="Time"><ElTimePicker v-model="data.time" /></ElFormItem
          ><ElFormItem label="Color"><ElColorPicker v-model="data.color" /></ElFormItem
        ></template>
        <template v-else-if="id === 'form-mask'"
          ><ElFormItem label="Phone"
            ><ElInput
              :model-value="data.phone"
              placeholder="(555) 123-4567"
              @update:model-value="mask('phone', $event)" /></ElFormItem
          ><ElFormItem label="Postal code"
            ><ElInput
              :model-value="data.postal"
              placeholder="12345"
              @update:model-value="mask('postal', $event)" /></ElFormItem
          ><ElFormItem label="Sample card format"
            ><ElInput
              :model-value="data.card"
              placeholder="0000 0000 0000 0000"
              @update:model-value="mask('card', $event)"
            />
            <p class="muted">
              Formatting demo only. Do not enter real payment details.
            </p></ElFormItem
          ></template
        >
        <template v-else
          ><ElFormItem label="Name" prop="name"
            ><ElInput v-model="data.name" placeholder="Your name" /></ElFormItem
          ><ElFormItem label="Email" prop="email"
            ><ElInput v-model="data.email" type="email" /></ElFormItem
          ><template v-if="id === 'form-validation'"
            ><ElFormItem label="Password" prop="password"
              ><ElInput v-model="data.password" type="password" show-password /></ElFormItem
            ><ElFormItem label="Confirm password" prop="confirm"
              ><ElInput
                v-model="data.confirm"
                type="password"
                show-password /></ElFormItem></template
          ><ElFormItem label="Country"
            ><ElSelect v-model="data.country" filterable clearable placeholder="Choose a country"
              ><ElOption
                v-for="country in [
                  'United States',
                  'United Kingdom',
                  'France',
                  'Germany',
                  'Japan',
                  'China',
                ]"
                :key="country"
                :value="country" /></ElSelect></ElFormItem
          ><ElFormItem label="Message"
            ><ElInput v-model="data.message" type="textarea" :rows="3" /></ElFormItem
        ></template> </SectionCard
      ><SectionCard :title="id === 'form-advanced' ? 'Advanced selection' : 'Options & preferences'"
        ><template v-if="id === 'form-advanced'"
          ><ElFormItem label="Department"
            ><ElCascader v-model="data.cascader" :options="options" clearable /></ElFormItem
          ><ElFormItem label="Assign roles"
            ><ElTransfer
              v-model="data.transfer"
              :data="[
                { key: 1, label: 'Designer' },
                { key: 2, label: 'Developer' },
                { key: 3, label: 'Reviewer' },
              ]"
              :titles="['Available', 'Assigned']" /></ElFormItem></template
        ><ElFormItem label="Quantity"
          ><ElInputNumber v-model="data.quantity" :min="1" :max="100" /></ElFormItem
        ><ElFormItem label="Notifications"><ElSwitch v-model="data.enabled" /></ElFormItem
        ><ElFormItem label="Plan"
          ><ElRadioGroup v-model="data.choice"
            ><ElRadioButton label="Option A" value="Option A" /><ElRadioButton
              label="Option B"
              value="Option B" /></ElRadioGroup></ElFormItem
        ><ElFormItem label="Channels"
          ><ElCheckboxGroup v-model="data.checks"
            ><ElCheckbox value="Email">Email</ElCheckbox
            ><ElCheckbox value="SMS">SMS</ElCheckbox></ElCheckboxGroup
          ></ElFormItem
        ><ElFormItem label="Priority"><ElSlider v-model="data.slider" /></ElFormItem
        ><ElFormItem label="Rating"><ElRate v-model="data.rating" /></ElFormItem
      ></SectionCard>
    </div>
    <div class="action-bar">
      <ElButton @click="reset">Reset</ElButton
      ><ElButton type="primary" native-type="submit">{{
        id === 'form-validation' ? 'Validate form' : 'Save demo values'
      }}</ElButton>
    </div>
    <ElAlert
      v-if="saved"
      title="Values validated and retained in this page. Nothing was sent to a server."
      type="success"
      :closable="false"
  /></ElForm>
</template>
