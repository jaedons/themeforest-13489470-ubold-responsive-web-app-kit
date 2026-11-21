<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElButton,
  ElSwitch,
  ElMessage,
  ElUpload,
  ElTag,
} from 'element-plus'
import SectionCard from '../../components/display/SectionCard.vue'
import RichEditor from '../../components/forms/RichEditor.vue'
const initialValues = () => ({
  name: '',
  reference: '',
  description: '<p>Describe your product.</p>',
  summary: '',
  price: 0,
  stock: 0,
  category: 'Phones',
  active: true,
})
const form = reactive(initialValues())
const formRef = ref<InstanceType<typeof ElForm>>(),
  saved = ref(false)
function reset() {
  Object.assign(form, initialValues())
  formRef.value?.clearValidate()
  saved.value = false
}
async function save() {
  if (await formRef.value?.validate().catch(() => false)) {
    saved.value = true
    ElMessage.success('Product preview saved in this page')
  }
}
</script>
<template>
  <ElForm ref="formRef" :model="form" label-position="top" @submit.prevent="save"
    ><div class="two-column">
      <SectionCard title="General"
        ><ElFormItem
          label="Product name"
          prop="name"
          :rules="[
            { required: true, whitespace: true, message: 'Enter a product name', trigger: 'blur' },
          ]"
          ><ElInput
            v-model="form.name"
            placeholder="e.g. Apple iMac"
            aria-label="Product name" /></ElFormItem
        ><ElFormItem
          label="Reference"
          prop="reference"
          :rules="[{ required: true, message: 'Enter a reference', trigger: 'blur' }]"
          ><ElInput v-model="form.reference" aria-label="Product reference" /></ElFormItem
        ><ElFormItem label="Description"><RichEditor v-model="form.description" /></ElFormItem
        ><ElFormItem label="Summary"
          ><ElInput v-model="form.summary" type="textarea" :rows="3" /></ElFormItem></SectionCard
      ><SectionCard title="Pricing & inventory"
        ><ElFormItem label="Price ($)"
          ><ElInputNumber v-model="form.price" :min="0" :precision="2" /></ElFormItem
        ><ElFormItem label="Stock"><ElInputNumber v-model="form.stock" :min="0" /></ElFormItem
        ><ElFormItem label="Category"
          ><ElSelect v-model="form.category"
            ><ElOption
              v-for="item in ['Phones', 'Computers', 'Accessories']"
              :key="item"
              :value="item" /></ElSelect></ElFormItem
        ><ElFormItem label="Active"><ElSwitch v-model="form.active" /></ElFormItem
        ><ElFormItem label="Product images"
          ><ElUpload :auto-upload="false" accept="image/*" list-type="picture" :limit="4"
            ><ElButton>Select images</ElButton
            ><template #tip
              ><span class="muted"
                >Local selection only. Files are not sent to a server.</span
              ></template
            ></ElUpload
          ></ElFormItem
        ></SectionCard
      >
    </div>
    <div class="action-bar">
      <ElTag v-if="saved" type="success">Saved in this page only</ElTag
      ><ElButton @click="reset">Reset</ElButton
      ><ElButton type="primary" native-type="submit">Save product preview</ElButton>
    </div></ElForm
  >
</template>
