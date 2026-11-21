<template>
  <main class="account-layout">
    <RouterLink class="account-brand" to="/dashboard">UB<span>O</span>LD</RouterLink><slot />
    <p class="muted">
      A Vue + Element Plus demonstration ·
      <RouterLink to="/dashboard">Explore workspace</RouterLink>
    </p>
  </main>
</template>
