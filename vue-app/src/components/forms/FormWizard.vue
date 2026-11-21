<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElSteps,
  ElStep,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElButton,
  ElResult,
  ElDescriptions,
  ElDescriptionsItem,
} from 'element-plus'
const step = ref(0),
  done = ref(false),
  formRef = ref<InstanceType<typeof ElForm>>()
const form = reactive({ name: '', email: '', team: 'Design', agree: false })
async function next() {
  if (step.value < 2 && !(await formRef.value?.validate().catch(() => false))) return
  if (step.value === 2) {
    if (form.agree) done.value = true
  } else step.value++
}

function restart() {
  done.value = false
  step.value = 0
}
</script>
<template>
  <ElResult
    v-if="done"
    icon="success"
    title="Demo completed"
    sub-title="Your entries were validated locally. No account or service was created."
    ><template #extra><ElButton @click="restart">Start again</ElButton></template></ElResult
  ><template v-else
    ><ElSteps :active="step" finish-status="success" align-center
      ><ElStep title="Account" /><ElStep title="Team" /><ElStep title="Review" /></ElSteps
    ><ElForm ref="formRef" :model="form" label-position="top" class="wizard-form"
      ><template v-if="step === 0"
        ><ElFormItem
          label="Name"
          prop="name"
          :rules="[{ required: true, message: 'Enter your name' }]"
          ><ElInput v-model="form.name" aria-label="Name" /></ElFormItem
        ><ElFormItem
          label="Email"
          prop="email"
          :rules="[
            { required: true, message: 'Enter your email' },
            { type: 'email', message: 'Enter a valid email' },
          ]"
          ><ElInput v-model="form.email" aria-label="Email" /></ElFormItem></template
      ><ElFormItem
        v-else-if="step === 1"
        label="Team"
        prop="team"
        :rules="[{ required: true, message: 'Choose a team' }]"
        ><ElSelect v-model="form.team"
          ><ElOption
            v-for="team in ['Design', 'Engineering', 'Operations']"
            :key="team"
            :value="team" /></ElSelect></ElFormItem
      ><template v-else
        ><ElDescriptions :column="1" border
          ><ElDescriptionsItem label="Name">{{ form.name }}</ElDescriptionsItem
          ><ElDescriptionsItem label="Email">{{ form.email }}</ElDescriptionsItem
          ><ElDescriptionsItem label="Team">{{ form.team }}</ElDescriptionsItem></ElDescriptions
        ><ElCheckbox v-model="form.agree"
          >I understand this is a local demonstration</ElCheckbox
        ></template
      ></ElForm
    >
    <div class="action-bar">
      <ElButton :disabled="step === 0" @click="step--">Back</ElButton
      ><ElButton type="primary" :disabled="step === 2 && !form.agree" @click="next">{{
        step === 2 ? 'Finish demo' : 'Next'
      }}</ElButton>
    </div></template
  >
</template>
