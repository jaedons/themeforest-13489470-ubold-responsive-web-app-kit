<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import FullCalendar, {
  type CalendarOptions,
  type EventInput,
  type EventApi,
} from '@fullcalendar/vue3'
import dayGrid from '@fullcalendar/vue3/daygrid'
import timeGrid from '@fullcalendar/vue3/timegrid'
import interaction, { Draggable } from '@fullcalendar/vue3/interaction'
import classic from '@fullcalendar/vue3/themes/classic'
import '@fullcalendar/vue3/skeleton.css'
import '@fullcalendar/vue3/themes/classic/theme.css'
import '@fullcalendar/vue3/themes/classic/palette.css'
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElCheckbox,
  ElSelect,
  ElOption,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
const day = new Date(),
  date = new Date(day.getTime() - day.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
const events = ref<EventInput[]>([
  {
    id: '1',
    title: 'See John Deo',
    start: date + 'T09:00:00',
    end: date + 'T10:00:00',
    className: 'event-teal',
  },
  { id: '2', title: 'Buy a Theme', start: date + 'T14:00:00', className: 'event-purple' },
  { id: '3', title: 'Team review', start: date + 'T16:00:00', className: 'event-blue' },
])
const dialog = ref(false),
  formRef = ref<InstanceType<typeof ElForm>>(),
  external = ref<HTMLElement>(),
  editing = ref('')
const form = reactive({
  title: '',
  start: date + 'T09:00:00',
  end: date + 'T10:00:00',
  allDay: false,
  color: 'event-teal',
})
const removeAfterDrop = ref(false),
  externalLabels = ref([
    { id: '1', title: 'Team meeting', color: 'event-teal' },
    { id: '2', title: 'Design review', color: 'event-purple' },
    { id: '3', title: 'Follow up', color: 'event-blue' },
  ])
const categoryDialog = ref(false),
  categoryName = ref(''),
  categoryColor = ref('event-teal')
function addCategory() {
  if (!categoryName.value.trim()) return ElMessage.warning('Enter a category name')
  externalLabels.value.push({
    id: crypto.randomUUID(),
    title: categoryName.value.trim(),
    color: categoryColor.value,
  })
  categoryName.value = ''
  categoryDialog.value = false
}
function useTemplate(template: { title: string; color: string }) {
  open()
  form.title = template.title
  form.color = template.color
}
let draggable: Draggable | undefined
function open(event?: EventApi, start?: string, end?: string) {
  editing.value = event?.id || ''
  form.title = event?.title || ''
  form.start = event?.startStr.slice(0, 19) || start?.slice(0, 19) || date + 'T09:00:00'
  form.end = event?.endStr.slice(0, 19) || end?.slice(0, 19) || ''
  form.allDay = event?.allDay || false
  form.color = event?.className || 'event-teal'
  dialog.value = true
}
function track(event: EventApi) {
  const input: EventInput = {
    id: event.id,
    title: event.title,
    start: event.startStr,
    end: event.endStr || undefined,
    allDay: event.allDay,
    className: event.className,
  }
  const found = events.value.some((item) => item.id === input.id)
  events.value = found
    ? events.value.map((item) => (item.id === input.id ? input : item))
    : [...events.value, input]
}
const options = computed<CalendarOptions>(() => ({
  plugins: [dayGrid, timeGrid, interaction, classic],
  initialView: 'dayGridMonth',
  height: 'auto',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: events.value,
  editable: true,
  droppable: true,
  selectable: true,
  dayMaxEvents: true,
  eventClick: (info) => open(info.event),
  select: (info) => {
    open(undefined, info.startStr, info.endStr)
    form.allDay = info.allDay
  },
  eventChange: (info) => track(info.event),
  eventReceive: (info) => {
    info.event.setProp('id', crypto.randomUUID())
    track(info.event)
    if (removeAfterDrop.value)
      externalLabels.value = externalLabels.value.filter(
        (label) => label.id !== info.draggedEl.dataset.templateId,
      )
  },
}))
async function save() {
  if (!(await formRef.value?.validate().catch(() => false))) return
  if (form.end && new Date(form.end) <= new Date(form.start)) {
    ElMessage.error('End must be after start')
    return
  }
  const item: EventInput = {
    id: editing.value || crypto.randomUUID(),
    title: form.title.trim(),
    start: form.allDay ? form.start.slice(0, 10) : form.start,
    end: form.end
      ? form.allDay
        ? form.end.slice(0, 10) === form.start.slice(0, 10)
          ? undefined
          : form.end.slice(0, 10)
        : form.end
      : undefined,
    allDay: form.allDay,
    className: form.color,
  }
  events.value = editing.value
    ? events.value.map((event) => (event.id === editing.value ? item : event))
    : [...events.value, item]
  dialog.value = false
  ElMessage.success('Event saved in demo memory')
}
async function remove() {
  try {
    await ElMessageBox.confirm(`Delete “${form.title}”?`, 'Delete event', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    })
    events.value = events.value.filter((event) => event.id !== editing.value)
    dialog.value = false
    ElMessage.success('Event deleted')
  } catch {
    /* cancelled */
  }
}
onMounted(() => {
  if (external.value)
    draggable = new Draggable(external.value, {
      itemSelector: '.external-event',
      eventData: (el) => ({
        title: el.textContent?.trim() || 'New event',
        className: el.dataset.color || 'event-teal',
      }),
    })
})
onBeforeUnmount(() => draggable?.destroy())
</script>
<template>
  <div class="calendar-layout">
    <SectionCard title="Your events"
      ><ElButton type="primary" @click="open()" data-testid="add-event">Add event</ElButton>
      <p class="muted">
        Select a date range or drag an event onto the calendar. Changes are kept in this page only.
      </p>
      <div ref="external" class="external-events">
        <div
          v-for="label in externalLabels"
          :key="label.id"
          class="external-event"
          :class="label.color"
          :data-template-id="label.id"
          :data-color="label.color"
          tabindex="0"
          role="button"
          :aria-label="'Schedule ' + label.title"
          @keydown.enter.prevent="useTemplate(label)"
          @keydown.space.prevent="useTemplate(label)"
          @dblclick="useTemplate(label)"
        >
          {{ label.title }}
        </div>
      </div>
      <ElButton @click="categoryDialog = true">Create category</ElButton>
      <ElCheckbox v-model="removeAfterDrop">Remove after drop</ElCheckbox>
      <p role="status">
        <ElTag>{{ events.length }} scheduled events</ElTag>
      </p></SectionCard
    ><SectionCard><FullCalendar :options="options" /></SectionCard>
  </div>
  <ElDialog v-model="categoryDialog" title="Create category" width="440px"
    ><form @submit.prevent="addCategory">
      <ElFormItem label="Category name"
        ><ElInput v-model="categoryName" aria-label="Category name" /></ElFormItem
      ><ElFormItem label="Color"
        ><ElSelect v-model="categoryColor" aria-label="Category color"
          ><ElOption
            v-for="color in ['teal', 'purple', 'blue']"
            :key="color"
            :value="'event-' + color"
            :label="color" /></ElSelect
      ></ElFormItem>
      <div class="action-bar">
        <ElButton @click="categoryDialog = false">Cancel</ElButton
        ><ElButton type="primary" native-type="submit">Create category</ElButton>
      </div>
    </form></ElDialog
  >
  <ElDialog
    v-model="dialog"
    :title="editing ? 'Edit event' : 'Add event'"
    width="520px"
    destroy-on-close
    ><ElForm ref="formRef" :model="form" label-position="top" @submit.prevent="save"
      ><ElFormItem
        label="Event name"
        prop="title"
        :rules="[
          { required: true, whitespace: true, message: 'Enter an event name', trigger: 'blur' },
        ]"
        ><ElInput v-model="form.title" aria-label="Event name" /></ElFormItem
      ><ElFormItem
        label="Start"
        prop="start"
        :rules="[{ required: true, message: 'Choose a start date' }]"
        ><ElDatePicker
          v-model="form.start"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
          aria-label="Event start" /></ElFormItem
      ><ElFormItem label="End"
        ><ElDatePicker
          v-model="form.end"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
          aria-label="Event end" /></ElFormItem
      ><ElFormItem><ElCheckbox v-model="form.allDay">All day</ElCheckbox></ElFormItem
      ><ElFormItem label="Category"
        ><ElSelect v-model="form.color" aria-label="Event category"
          ><ElOption
            v-for="color in ['teal', 'purple', 'blue']"
            :key="color"
            :value="'event-' + color"
            :label="color" /></ElSelect></ElFormItem></ElForm
    ><template #footer
      ><ElButton v-if="editing" type="danger" plain @click="remove">Delete event</ElButton
      ><ElButton @click="dialog = false">Cancel</ElButton
      ><ElButton type="primary" @click="save">Save event</ElButton></template
    ></ElDialog
  >
</template>
