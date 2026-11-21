<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElButton,
  ElAlert,
  ElTabs,
  ElTabPane,
  ElAvatar,
} from 'element-plus'
import { usePage } from '../composables/usePage'
const page = usePage(),
  router = useRouter(),
  tab = ref('login'),
  notice = ref(''),
  formRef = ref<InstanceType<typeof ElForm>>()
const kind = computed(() =>
  page.value.id.includes('recover')
    ? 'recover'
    : page.value.id.includes('lock')
      ? 'lock'
      : page.value.id.includes('signup-signin')
        ? tab.value
        : page.value.id.includes('register')
          ? 'register'
          : 'login',
)
const form = reactive({ name: '', email: '', password: '', confirm: '', terms: false })
const rules = computed(() => ({
  name: [{ required: kind.value === 'register', message: 'Enter your name', trigger: 'blur' }],
  email: [
    { required: kind.value !== 'lock', message: 'Enter your email', trigger: 'blur' },
    { type: 'email' as const, message: 'Enter a valid email', trigger: 'blur' },
  ],
  password: [
    { required: kind.value !== 'recover', message: 'Enter a password', trigger: 'blur' },
    { min: 8, message: 'Use at least 8 characters', trigger: 'blur' },
  ],
  confirm: [
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) =>
        callback(value === form.password ? undefined : new Error('Passwords do not match')),
      trigger: 'blur',
    },
  ],
  terms: [
    {
      validator: (_rule: unknown, value: boolean, callback: (error?: Error) => void) =>
        callback(value ? undefined : new Error('Accept the demo terms to continue')),
      trigger: 'change',
    },
  ],
}))
async function submit() {
  if (!(await formRef.value?.validate().catch(() => false))) return
  if (kind.value === 'recover')
    notice.value =
      'Recovery request validated locally. No email was sent because this demo has no account service.'
  else {
    notice.value = 'Form validated locally. No account was created or authenticated.'
    form.password = ''
    form.confirm = ''
  }
}
</script>
<template>
  <ElCard class="account-card" shadow="never"
    ><div class="account-title">
      <ElAvatar v-if="kind === 'lock'" :size="72" src="/assets/images/users/avatar-1.jpg" />
      <h1>
        {{
          kind === 'recover'
            ? 'Reset password'
            : kind === 'register'
              ? 'Create account'
              : kind === 'lock'
                ? 'Unlock workspace'
                : 'Welcome back'
        }}
      </h1>
      <p class="muted">
        {{
          kind === 'lock'
            ? 'John Doe · demo lock screen'
            : 'Enter your details to try the account form.'
        }}
      </p>
    </div>
    <ElAlert
      title="Demo only: no authentication or account service is connected."
      type="info"
      :closable="false"
      show-icon
    /><ElTabs v-if="page.id === 'page-signup-signin'" v-model="tab"
      ><ElTabPane label="Sign in" name="login" /><ElTabPane
        label="Register"
        name="register" /></ElTabs
    ><ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="submit"
      ><ElFormItem v-if="kind === 'register'" label="Name" prop="name"
        ><ElInput v-model="form.name" aria-label="Name" autocomplete="name" /></ElFormItem
      ><ElFormItem v-if="kind !== 'lock'" label="Email" prop="email"
        ><ElInput
          v-model="form.email"
          aria-label="Email"
          type="email"
          autocomplete="email" /></ElFormItem
      ><ElFormItem v-if="kind !== 'recover'" label="Password" prop="password"
        ><ElInput
          v-model="form.password"
          aria-label="Password"
          type="password"
          show-password
          :autocomplete="kind === 'register' ? 'new-password' : 'current-password'" /></ElFormItem
      ><ElFormItem v-if="kind === 'register'" label="Confirm password" prop="confirm"
        ><ElInput
          v-model="form.confirm"
          aria-label="Confirm password"
          type="password"
          autocomplete="new-password"
          show-password /></ElFormItem
      ><ElFormItem v-if="kind === 'register'" prop="terms"
        ><ElCheckbox v-model="form.terms">I understand this is a local demo</ElCheckbox></ElFormItem
      ><ElButton type="primary" native-type="submit" class="full-width"
        >Validate
        {{
          kind === 'recover'
            ? 'recovery request'
            : kind === 'register'
              ? 'registration'
              : 'sign-in form'
        }}</ElButton
      ></ElForm
    ><ElAlert v-if="notice" :title="notice" type="success" :closable="false" />
    <div class="account-links">
      <RouterLink to="/account/recover">Forgot password?</RouterLink
      ><RouterLink :to="kind === 'register' ? '/login' : '/register'">{{
        kind === 'register' ? 'Sign in' : 'Register'
      }}</RouterLink>
    </div>
    <ElButton class="full-width" @click="router.push('/dashboard')"
      >Open demo workspace</ElButton
    ></ElCard
  >
</template>
