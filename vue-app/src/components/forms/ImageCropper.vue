<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { ElSlider, ElButton, ElUpload, ElMessage, type UploadFile } from 'element-plus'
const canvas = ref<HTMLCanvasElement>(),
  zoom = ref(1),
  rotation = ref(0),
  image = new Image(),
  url = ref(''),
  ready = ref(false)
function draw() {
  if (!ready.value || !canvas.value) return
  const context = canvas.value.getContext('2d')!
  const size = 320
  context.clearRect(0, 0, size, size)
  context.fillStyle = '#ebeff2'
  context.fillRect(0, 0, size, size)
  context.save()
  context.translate(size / 2, size / 2)
  context.rotate((rotation.value * Math.PI) / 180)
  const scale = Math.max(size / image.width, size / image.height) * zoom.value
  context.drawImage(
    image,
    (-image.width * scale) / 2,
    (-image.height * scale) / 2,
    image.width * scale,
    image.height * scale,
  )
  context.restore()
}
function load(src: string) {
  ready.value = false
  image.onload = () => {
    ready.value = true
    draw()
  }
  image.onerror = () => ElMessage.error('The image could not be read')
  image.src = src
}
function choose(file: UploadFile) {
  if (!file.raw?.type.startsWith('image/')) {
    ElMessage.error('Choose an image file')
    return
  }
  if (file.raw.size > 5 * 1024 * 1024) {
    ElMessage.error('Choose an image smaller than 5 MB')
    return
  }
  if (url.value) URL.revokeObjectURL(url.value)
  url.value = URL.createObjectURL(file.raw)
  zoom.value = 1
  rotation.value = 0
  load(url.value)
}
function download() {
  canvas.value?.toBlob((blob) => {
    if (!blob) return
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = 'ubold-crop.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(href), 1000)
  }, 'image/png')
}
onMounted(() => load('/assets/images/gallery/1.jpg'))
watch([zoom, rotation], draw)
onBeforeUnmount(() => {
  if (url.value) URL.revokeObjectURL(url.value)
})
</script>
<template>
  <div class="two-column">
    <canvas
      ref="canvas"
      width="320"
      height="320"
      class="crop-canvas"
      role="img"
      aria-label="Cropped image preview"
    />
    <div>
      <ElUpload :auto-upload="false" :show-file-list="false" accept="image/*" @change="choose"
        ><ElButton>Select an image</ElButton></ElUpload
      >
      <p class="muted">Images are processed locally. The central square is exported.</p>
      <label
        >Zoom<ElSlider
          v-model="zoom"
          :min="1"
          :max="3"
          :step="0.1"
          aria-label="Image zoom" /></label
      ><label
        >Rotation<ElSlider
          v-model="rotation"
          :min="-180"
          :max="180"
          :step="15"
          aria-label="Image rotation" /></label
      ><ElButton type="primary" :disabled="!ready" @click="download">Download crop</ElButton>
    </div>
  </div>
</template>
