<script setup lang="ts">
import { ref } from 'vue'
import {
  ElUpload,
  ElButton,
  ElMessage,
  ElAlert,
  type UploadUserFile,
  type UploadFile,
} from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
const files = ref<UploadUserFile[]>([])
function validate(file: UploadFile) {
  if ((file.size || 0) > 5 * 1024 * 1024) {
    files.value = files.value.filter((item) => item.uid !== file.uid)
    ElMessage.error('Choose a file smaller than 5 MB')
  }
}
</script>
<template>
  <ElAlert
    title="Local file selection only. No upload server is connected."
    type="info"
    :closable="false"
  /><ElUpload
    v-model:file-list="files"
    drag
    multiple
    :auto-upload="false"
    :limit="5"
    @change="validate"
    @exceed="ElMessage.warning('Choose up to 5 files')"
    ><UploadFilled style="width: 40px; color: var(--el-color-primary)" />
    <p>Drop files here or <em>click to select</em></p>
    <template #tip
      ><p class="muted">Up to 5 files, 5 MB per file. Files remain on your device.</p></template
    ></ElUpload
  >
  <p role="status">
    {{ files.length }} files selected ·
    {{ (files.reduce((sum, file) => sum + (file.size || 0), 0) / 1024).toFixed(1) }} KB
  </p>
  <ElButton :disabled="!files.length" @click="files = []">Clear selection</ElButton>
</template>
