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
  ElMessageBox,
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
  status: 'Online',
  comment: '',
  metaTitle: '',
  metaKeywords: '',
  metaDescription: '',
})
const initialImages = () =>
  ['imac', 'iphone', 'lumia', 'macbook'].map((name, i) => ({
    uid: i + 1,
    name: name + '.jpg',
    url: '/assets/images/products/' + name + '.jpg',
    role: i === 0 ? 'Main Image' : 'Gallery',
  }))
const images = ref<import('element-plus').UploadUserFile[]>([])
const existingImages = ref(initialImages())
const form = reactive(initialValues())
const formRef = ref<InstanceType<typeof ElForm>>(),
  saved = ref(false)
function reset() {
  Object.assign(form, initialValues())
  formRef.value?.clearValidate()
  saved.value = false
  images.value = []
  existingImages.value = initialImages()
}
async function deleteProduct() {
  try {
    await ElMessageBox.confirm('Clear this product preview and its images?', 'Delete product', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
    reset()
    existingImages.value = []
    ElMessage.success('Product preview deleted')
  } catch {
    /* cancelled */
  }
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
          :rules="[
            { required: true, whitespace: true, message: 'Enter a reference', trigger: 'blur' },
          ]"
          ><ElInput v-model="form.reference" aria-label="Product reference" /></ElFormItem
        ><ElFormItem label="Description"><RichEditor v-model="form.description" /></ElFormItem
        ><ElFormItem label="Summary"
          ><ElInput v-model="form.summary" type="textarea" :rows="3"
        /></ElFormItem>
        <h2>Pricing &amp; inventory</h2>
        <ElFormItem label="Price ($)"
          ><ElInputNumber v-model="form.price" :min="0" :precision="2" /></ElFormItem
        ><ElFormItem label="Stock"><ElInputNumber v-model="form.stock" :min="0" /></ElFormItem
        ><ElFormItem label="Category"
          ><ElSelect v-model="form.category"
            ><ElOption
              v-for="item in ['Phones', 'Computers', 'Accessories']"
              :key="item"
              :value="item" /></ElSelect></ElFormItem
        ><ElFormItem label="Status"
          ><ElSelect v-model="form.status" aria-label="Product status" data-testid="product-status"
            ><ElOption
              v-for="status in ['Online', 'Offline', 'Draft']"
              :key="status"
              :value="status" /></ElSelect
        ></ElFormItem>
        <ElFormItem label="Comment"
          ><ElInput v-model="form.comment" type="textarea" aria-label="Product comment"
        /></ElFormItem> </SectionCard
      ><SectionCard title="Meta Data">
        <ElFormItem label="Meta title"
          ><ElInput v-model="form.metaTitle" aria-label="Meta title"
        /></ElFormItem>
        <ElFormItem label="Meta keywords"
          ><ElInput v-model="form.metaKeywords" aria-label="Meta keywords"
        /></ElFormItem>
        <ElFormItem label="Meta description"
          ><ElInput v-model="form.metaDescription" type="textarea" aria-label="Meta description"
        /></ElFormItem>
        <h2>Product Image</h2>
        <div class="product-image-list">
          <div v-for="image in existingImages" :key="image.uid" class="product-image-row">
            <img :src="image.url" :alt="image.name" /><ElSelect
              v-model="image.role"
              :aria-label="image.name + ' image role'"
              ><ElOption
                v-for="role in ['Main Image', 'Thumbnail', 'Gallery']"
                :key="role"
                :value="role" /></ElSelect
            ><ElButton
              text
              type="danger"
              :aria-label="'Remove ' + image.name"
              @click="existingImages = existingImages.filter((item) => item.uid !== image.uid)"
              >Remove</ElButton
            >
          </div>
        </div>
        <ElFormItem label="Product images"
          ><ElUpload
            v-model:file-list="images"
            :auto-upload="false"
            accept="image/*"
            list-type="picture"
            :limit="4"
            :on-exceed="() => ElMessage.warning('Select up to four additional images')"
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
      ><ElButton @click="reset">Reset</ElButton><ElButton @click="reset">Cancel</ElButton
      ><ElButton type="danger" plain @click="deleteProduct">Delete product</ElButton
      ><ElButton type="primary" native-type="submit">Save product preview</ElButton>
    </div></ElForm
  >
</template>
