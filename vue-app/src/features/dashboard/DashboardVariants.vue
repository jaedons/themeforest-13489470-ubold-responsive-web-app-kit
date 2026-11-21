<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ElButton,
  ElInput,
  ElCheckbox,
  ElProgress,
  ElTable,
  ElTableColumn,
  ElEmpty,
  ElMessage,
} from 'element-plus'
import StatCard from '../../components/display/StatCard.vue'
import SectionCard from '../../components/display/SectionCard.vue'
import ChartView from '../../components/charts/ChartView.vue'
import DataTable from '../../components/tables/DataTable.vue'
import { usePage } from '../../composables/usePage'
const page = usePage()
const analytics = computed(() => page.value.id === 'dashboard_2')
const projects = computed(() => page.value.id === 'dashboard_3')
const crm = computed(() => page.value.id === 'crm-dashboard')
const metrics = computed(() =>
  analytics.value
    ? [
        ['Total Revenue', '$50,568'],
        ['Sales', '1,256'],
        ['Stores', '18'],
        ['Users', '8,564'],
      ]
    : crm.value
      ? [
          ['Active deals', '120'],
          ['Won deals', '95'],
          ['Lost deals', '85'],
          ['Average time for deal', '12 days'],
        ]
      : projects.value
        ? [
            ['Total Sales', '12,560'],
            ['New Customers', '356'],
            ['Total Visitors', '96,562'],
          ]
        : [
            ['Total Revenue', '$31,570'],
            ['Sales', '280'],
            ['Orders', '125'],
            ['Customers', '1,256'],
          ],
)
const tables = computed(() =>
  page.value.tables
    .filter((t) => t.headers.length && t.rows.length)
    .map((t, index) => {
      const cols = t.headers
        .map((label, i) => ({ label, i }))
        .filter((c) => c.label && !/^(action|actions)$/i.test(c.label))
      return {
        title: projects.value
          ? 'Projects'
          : crm.value
            ? 'Contacts'
            : index
              ? 'Popular Products'
              : 'Recent Orders',
        columns: cols.map((c) => ({ key: 'c' + c.i, label: c.label })),
        rows: t.rows.map((r, i) => ({
          id: String(i),
          ...Object.fromEntries(cols.map((c) => ['c' + c.i, r[c.i] || '—'])),
        })),
      }
    }),
)
const todo = ref([
  { id: 1, title: 'Design a new dashboard', done: false },
  { id: 2, title: 'Review project updates', done: true },
  { id: 3, title: 'Send weekly report', done: false },
])
const task = ref(''),
  message = ref('')
const chat = ref([
  { id: 1, author: 'John Doe', text: 'Hello! How is the project going?' },
  { id: 2, author: 'Tomaslau', text: 'The dashboard is ready for review.' },
])
function addTask() {
  if (!task.value.trim()) return ElMessage.warning('Enter a task')
  todo.value.push({ id: Date.now(), title: task.value.trim(), done: false })
  task.value = ''
}
function send() {
  if (!message.value.trim()) return
  chat.value.push({ id: Date.now(), author: 'You', text: message.value.trim() })
  message.value = ''
}
const transactions = [
  { name: 'Tomaslau', amount: '$25', status: 'Paid' },
  { name: 'Chadengle', amount: '$100', status: 'Pending' },
  { name: 'Stillnotdavid', amount: '$35', status: 'Paid' },
]
</script>
<template>
  <div class="stat-grid" :class="{ 'three-metrics': projects }">
    <StatCard
      v-for="(stat, i) in metrics"
      :key="stat[0]"
      :label="stat[0]!"
      :value="stat[1]!"
      :icon="i"
      trend="Current period"
      :tone="['teal', 'pink', 'purple', 'blue'][i]"
    />
  </div>
  <template v-if="analytics">
    <div class="dashboard-charts analytics-charts">
      <SectionCard title="Total Revenue"
        ><ChartView
          kind="line"
          label="Total revenue"
          :values="[32, 45, 40, 65, 51, 82, 90]"
          :secondary="[20, 30, 25, 40, 45, 58, 64]"
      /></SectionCard>
      <SectionCard title="Sales by product"
        ><div
          v-for="(product, i) in ['iMacs', 'iBooks', 'iPhone 5s', 'iPhone 6', 'iPhone 6s']"
          :key="product"
          class="product-progress"
        >
          <span>{{ product }}</span><ElProgress :percentage="[80, 50, 70, 65, 40][i]" /></div
      ></SectionCard>
    </div>
    <div class="three-column">
      <SectionCard
        v-for="(title, i) in ['Total Visitors', 'New Visitors', 'Returning Visitors']"
        :key="title"
        :title="title"
        ><strong class="visitor-total">{{ ['6,842', '3,421', '3,421'][i] }}</strong
        ><ChartView kind="line" :label="title" :values="[20, 35, 30, 50, 40, 68, 80]" :height="100"
      /></SectionCard>
    </div>
    <div class="three-column">
      <SectionCard title="Last Transactions"
        ><ElTable :data="transactions"
          ><ElTableColumn prop="name" label="Name" min-width="130" /><ElTableColumn
            prop="amount"
            label="Amount" /><ElTableColumn prop="status" label="Status" /></ElTable
      ></SectionCard>
      <SectionCard title="Chat"
        ><div class="dashboard-chat" aria-live="polite">
          <p v-for="item in chat" :key="item.id">
            <b>{{ item.author }}</b><br />{{ item.text }}
          </p>
        </div>
        <form class="inline-form" @submit.prevent="send">
          <ElInput
            v-model="message"
            aria-label="Chat message"
            placeholder="Type a message…"
          /><ElButton native-type="submit" type="primary">Send</ElButton>
        </form></SectionCard
      >
      <SectionCard title="Todo"
        ><template #actions
          ><ElButton text @click="todo = todo.filter((t) => !t.done)"
            >Archive completed</ElButton
          ></template
        >
        <div class="dashboard-tasks">
          <ElCheckbox
            v-for="item in todo"
            :key="item.id"
            v-model="item.done"
            :class="{ 'task-done': item.done }"
            >{{ item.title }}</ElCheckbox><ElEmpty
            v-if="!todo.length"
            description="No tasks"
            :image-size="40"
          />
        </div>
        <form class="inline-form" @submit.prevent="addTask">
          <ElInput v-model="task" aria-label="New task" placeholder="New task…" /><ElButton
            native-type="submit"
            type="primary"
            >Add task</ElButton
          >
        </form></SectionCard
      >
    </div>
  </template>
  <div v-else-if="projects" class="three-column">
    <SectionCard
      v-for="(title, i) in ['Daily Sales', 'Weekly Sales', 'Monthly Sales']"
      :key="title"
      :title="title"
      ><ChartView
        :kind="i === 2 ? 'line' : 'doughnut'"
        :label="title"
        :values="i === 2 ? [30, 45, 55, 40, 60, 82, 90] : [30, 45, 25]"
        :height="230"
    /></SectionCard>
  </div>
  <template v-else-if="crm"
    ><SectionCard title="Deals Analytics"
      ><ChartView
        kind="line"
        label="Deals analytics"
        :values="[30, 55, 42, 70, 85, 72, 95]"
        :secondary="[10, 20, 15, 35, 25, 40, 30]"
    /></SectionCard>
    <div class="two-column">
      <SectionCard title="Sales by product group"
        ><ChartView
          kind="doughnut"
          label="Sales by product group"
          :labels="['Software', 'Services', 'Hardware']"
          :values="[45, 30, 25]" /></SectionCard
      ><SectionCard title="Activities"
        ><ul class="activity-list">
          <li>John Doe created a new deal.</li>
          <li>Sales team updated the monthly forecast.</li>
          <li>Tomaslau scheduled a customer meeting.</li>
        </ul>
        <RouterLink to="/crm/opportunities">View opportunities</RouterLink></SectionCard
      >
    </div></template
  >
  <SectionCard v-else title="Total Revenue"
    ><ChartView
      kind="line"
      label="Commerce revenue"
      :values="[30, 45, 55, 40, 60, 82, 90]"
      :secondary="[20, 35, 30, 28, 45, 60, 75]"
  /></SectionCard>
  <SectionCard v-for="table in tables" :key="table.title" :title="table.title"
    ><DataTable :rows="table.rows" :columns="table.columns" :selectable="false"
  /></SectionCard>
</template>
