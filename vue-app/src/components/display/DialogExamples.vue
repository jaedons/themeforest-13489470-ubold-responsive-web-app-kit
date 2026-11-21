<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSwitch,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
const open = ref(false),
  fullscreen = ref(false),
  width = ref('520px'),
  formRef = ref<InstanceType<typeof ElForm>>()
const model = reactive({ name: '', email: '', notify: true })
async function save() {
  if (await formRef.value?.validate().catch(() => false)) {
    open.value = false
    ElMessage.success('Demo values validated')
  }
}
function show(size: string) {
  width.value = size
  fullscreen.value = false
  open.value = true
}
async function confirm() {
  try {
    await ElMessageBox.confirm('Apply the sample change to this page?', 'Confirm action', {
      confirmButtonText: 'Apply',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
    ElMessage.success('Sample change confirmed')
  } catch {
    /* cancelled */
  }
}
async function prompt() {
  try {
    const result = await ElMessageBox.prompt('Enter a sample name', 'Prompt', {
      inputPattern: /\S+/,
      inputErrorMessage: 'Enter a name',
    })
    ElMessage.success('Hello, ' + result.value)
  } catch {
    /* cancelled */
  }
}

function showFullscreen() {
  fullscreen.value = true
  open.value = true
}
</script>
<template>
  <div class="button-row">
    <ElButton type="primary" @click="show('520px')">Standard dialog</ElButton
    ><ElButton @click="show('800px')">Large dialog</ElButton
    ><ElButton @click="show('380px')">Small dialog</ElButton
    ><ElButton @click="showFullscreen">Fullscreen dialog</ElButton
    ><ElButton type="warning" plain @click="confirm">Confirm action</ElButton
    ><ElButton plain @click="prompt">Prompt</ElButton>
  </div>
  <ElDialog
    v-model="open"
    title="Sample dialog"
    :width="width"
    :fullscreen="fullscreen"
    destroy-on-close
    ><p class="muted">Enter sample values. Closing this dialog does not submit data to a server.</p>
    <ElForm ref="formRef" :model="model" label-position="top"
      ><ElFormItem
        label="Name"
        prop="name"
        :rules="[{ required: true, whitespace: true, message: 'Enter a name' }]"
        ><ElInput v-model="model.name" /></ElFormItem
      ><ElFormItem
        label="Email"
        prop="email"
        :rules="[{ type: 'email', message: 'Enter a valid email' }]"
        ><ElInput v-model="model.email" /></ElFormItem
      ><ElFormItem label="Notifications"><ElSwitch v-model="model.notify" /></ElFormItem></ElForm
    ><template #footer
      ><ElButton @click="open = false">Cancel</ElButton
      ><ElButton type="primary" @click="save">Save changes</ElButton></template
    ></ElDialog
  >
</template>
