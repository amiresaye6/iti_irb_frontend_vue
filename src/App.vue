<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import MainLayout from './layouts/MainLayout.vue'
import LandingLayout from './layouts/LandingLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()

const currentLayout = computed(() => {
  switch (route.meta.layout) {
    case 'main': return MainLayout
    case 'auth': return AuthLayout
    case 'landing': return LandingLayout
    default: return LandingLayout
  }
})
</script>

<template>
  <Toaster richColors />
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

<style scoped></style>