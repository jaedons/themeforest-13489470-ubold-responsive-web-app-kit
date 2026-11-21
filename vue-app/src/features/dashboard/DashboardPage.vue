<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElSelect, ElOption, ElProgress, ElTable, ElTableColumn, ElTag } from 'element-plus'
import DashboardVariants from './DashboardVariants.vue'
import StatCard from '../../components/display/StatCard.vue'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
import ChartView from '../../components/charts/ChartView.vue'
import { usePage } from '../../composables/usePage'
const page = usePage(),
  period = ref('month')
const stats = computed(() =>
  page.value.id === 'crm-dashboard'
    ? [
        ['Customers', '3,214', '+8.2% this month'],
        ['Opportunities', '128', '24 open opportunities'],
        ['Conversion', '26.4%', '+2.1% this month'],
        ['Revenue', '$31,570', '+12.8% this month'],
      ]
    : [
        ['Total Revenue', '$31,570', '+12.8% this month'],
        ['Today’s Sales', '280', '+8.2% this week'],
        ['Conversion', '0.16%', '+0.04% this month'],
        ['Today’s Visits', '64,570', '+5.4% this week'],
      ],
)
const sales = computed(() =>
  period.value === 'week' ? [25, 43, 31, 58, 66, 44, 72] : [65, 59, 90, 81, 56, 55, 84],
)
const orders = [
  { name: 'Apple iPhone', customer: 'Tomaslau', amount: '$230', status: 'Completed' },
  { name: 'Samsung Phone', customer: 'Chadengle', amount: '$450', status: 'Processing' },
  { name: 'Apple iPad', customer: 'Stillnotdavid', amount: '$680', status: 'Completed' },
  { name: 'LG Phone', customer: 'Ok', amount: '$320', status: 'Pending' },
]
</script>
<template>
  <DashboardVariants v-if="page.id !== 'index'" />
  <template v-else>
    <div class="stat-grid">
      <StatCard
        v-for="(stat, i) in stats"
        :key="stat[0]"
        :label="stat[0]!"
        :value="stat[1]!"
        :trend="stat[2]!"
        :icon="i"
        :tone="['teal', 'pink', 'purple', 'blue'][i]"
      />
    </div>
    <div class="dashboard-charts">
      <SectionCard title="Total revenue" description="Sales performance for the current period"
        ><div class="revenue-summary">
          <strong>$75,420</strong><span class="muted">Total sales this month</span
          ><ElProgress type="dashboard" :percentage="80" :width="170" color="#5fbeaa" />
        </div>
        <div class="metric-strip">
          <span>Target <b>$100,000</b></span
          ><span>Last week <b>$23,540</b></span
          ><span>Last month <b>$65,210</b></span>
        </div></SectionCard
      ><SectionCard title="Sales analytics"
        ><template #actions
          ><ElSelect v-model="period" aria-label="Sales period" style="width: 130px"
            ><ElOption label="This month" value="month" /><ElOption
              label="This week"
              value="week" /></ElSelect></template
        ><ChartView
          :label="page.title + ' sales'"
          :values="sales"
          :secondary="[28, 48, 40, 19, 56, 27, 60]"
          :height="320"
      /></SectionCard>
    </div>
    <div class="two-column">
      <SectionCard title="Audience overview"
        ><ChartView
          kind="line"
          label="Audience activity"
          :values="[28, 48, 40, 65, 56, 78, 90]"
          :height="290" /></SectionCard
      ><SectionCard title="Recent orders"
        ><template #actions><RouterLink to="/ecommerce/orders">View all</RouterLink></template
        ><ElTable :data="orders"
          ><ElTableColumn prop="name" label="Item" min-width="140" /><ElTableColumn
            prop="amount"
            label="Amount"
          /><ElTableColumn label="Status" min-width="120"
            ><template #default="{ row }"
              ><ElTag :type="row.status === 'Completed' ? 'success' : 'warning'">{{
                row.status
              }}</ElTag></template
            ></ElTableColumn
          ></ElTable
        ></SectionCard
      >
    </div>
  </template>
</template>
