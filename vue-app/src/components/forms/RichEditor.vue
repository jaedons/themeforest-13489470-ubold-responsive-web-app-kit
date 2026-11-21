<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue'
import { ElButton, ElButtonGroup } from 'element-plus'
const model = defineModel<string>({ default: '' })
const editor = useEditor({
  extensions: [StarterKit],
  content: model.value,
  editorProps: {
    attributes: {
      class: 'rich-editor-content',
      role: 'textbox',
      'aria-label': 'Rich text content',
      'aria-multiline': 'true',
    },
  },
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML()
  },
})
watch(model, (value) => {
  if (editor.value && value !== editor.value.getHTML())
    editor.value.commands.setContent(value, { emitUpdate: false })
})
</script>
<template>
  <div class="rich-editor">
    <div class="editor-toolbar">
      <ElButtonGroup
        ><ElButton
          :type="editor?.isActive('bold') ? 'primary' : 'default'"
          @click="editor?.chain().focus().toggleBold().run()"
          >Bold</ElButton
        ><ElButton @click="editor?.chain().focus().toggleItalic().run()">Italic</ElButton
        ><ElButton @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          >Heading</ElButton
        ><ElButton @click="editor?.chain().focus().toggleBulletList().run()">List</ElButton
        ><ElButton @click="editor?.chain().focus().undo().run()">Undo</ElButton></ElButtonGroup
      >
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>
