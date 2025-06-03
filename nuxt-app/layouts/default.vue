<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <UContainer>
      <header class="bg-white border-b border-gray-200">
        <div class="flex justify-between items-center h-16 px-4">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <UIcon name="i-heroicons-academic-cap" class="w-8 h-8 text-primary-600" />
            <h1 class="text-xl font-bold text-gray-900">AI Learning Hub</h1>
          </NuxtLink>
          
          <div class="flex items-center space-x-4">
            <!-- Navigation (only show when authenticated) -->
            <nav v-if="isAuthenticated" class="flex space-x-1">
              <UButton
                v-for="item in navigation"
                :key="item.to"
                :to="item.to"
                :variant="$route.path === item.to ? 'solid' : 'ghost'"
                :icon="item.icon"
                size="sm"
              >
                {{ item.label }}
              </UButton>
            </nav>

            <!-- User Menu (when authenticated) -->
            <UDropdownMenu v-if="isAuthenticated" :items="userMenuItems">
              <UButton variant="ghost" class="flex items-center space-x-2">
                <UAvatar :src="user?.avatar" :alt="user?.name" size="sm" />
                <span class="hidden md:block">{{ user?.name }}</span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
              </UButton>
            </UDropdownMenu>

            <!-- Auth Buttons (when not authenticated) -->
            <div v-else class="flex items-center space-x-2">
              <UButton to="/auth/login" variant="ghost">
                Login
              </UButton>
              <UButton to="/auth/register">
                Sign Up
              </UButton>
            </div>
          </div>
        </div>
      </header>
    </UContainer>

    <!-- Main Content -->
    <main class="py-8">
      <UContainer>
        <slot />
      </UContainer>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const user = {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150'
}
const isAuthenticated = ref(true)
const logout = async () => {
  console.log('Logging out...')
}

const navigation = [
  { label: 'Dashboard', to: '/', icon: 'i-heroicons-home' },
  { label: 'Request Course', to: '/courses/request', icon: 'i-heroicons-plus' },
  { label: 'My Courses', to: '/courses', icon: 'i-heroicons-book-open' },
  { label: 'Quizzes', to: '/quiz', icon: 'i-heroicons-academic-cap' },
  { label: 'Schedule', to: '/schedule', icon: 'i-heroicons-calendar' }
]

const userMenuItems = [
  { label: 'Profile', icon: 'i-heroicons-user', to: '/profile' },
  { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/settings' },
  { label: 'Logout', icon: 'i-heroicons-arrow-right-on-rectangle', click: logout }
]

</script>
