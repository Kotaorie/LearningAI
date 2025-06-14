<template>
  <div v-if="!isAuthenticated">
    <!-- Landing Page -->
    <LandingPage />
  </div>
  <div v-else>
    <!-- Redirect to dashboard for authenticated users -->
    <div class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
        <p class="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  </div>
</template>

<script setup>

const isAuthenticated = false
const initAuth = () => {
  // Simulate authentication check
  setTimeout(() => {
    isAuthenticated.value = true // Set to true for testing purposes
  }, 1000)
}

// Initialize auth
onMounted(() => {
  initAuth()
})

// Watch for auth changes
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    navigateTo('/dashboard')
  }
})

definePageMeta({
  title: 'AI Learning Hub - Personalized Learning Platform'
})
</script>
