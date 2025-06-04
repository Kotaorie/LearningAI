<template>
  <div class="flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <UIcon name="i-heroicons-academic-cap" class="mx-auto h-12 w-12 text-primary-600" />
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>
      <!-- Register Form -->
      <UCard>
        <UForm :state="registerForm" @submit="handleRegister" class="space-y-4">
          <UFormField label="Full Name" required>
            <UInput
              v-model="registerForm.name"
              placeholder="Enter your full name"
              icon="i-heroicons-user"
              required
              variant="subtle"
              size="xl"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Email address" required>
            <UInput
              v-model="registerForm.email"
              type="email"
              placeholder="Enter your email"
              icon="i-heroicons-envelope"
              required
              variant="subtle"
              size="xl"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" required>
            <UInput
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              icon="i-heroicons-lock-closed"
              required
              variant="subtle"
              size="xl"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  variant="ghost"
                  size="sm"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Confirm Password" required>
            <UInput
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              icon="i-heroicons-lock-closed"
              required
              variant="subtle"
              size="xl"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  variant="ghost"
                  size="sm"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="space-y-3">
            <UCheckbox 
              v-model="registerForm.agreeToTerms" 
              required
            >
              <template #label>
                <span class="text-sm">
                  I agree to the 
                  <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-500">Terms of Service</NuxtLink>
                  and 
                  <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-500">Privacy Policy</NuxtLink>
                </span>
              </template>
            </UCheckbox>

            <UCheckbox v-model="registerForm.subscribeNewsletter">
              <template #label>
                <span class="text-sm">Subscribe to our newsletter for learning tips and updates</span>
              </template>
            </UCheckbox>
          </div>

          <UButton
            type="submit"
            :loading="isLoading"
            :disabled="!isFormValid"
            block
            size="lg"
          >
            Create Account
          </UButton>
        </UForm>
        <div class="mt-6">
            <div class="relative flex items-center my-4">
            <div class="flex-1 border-t border-gray-300"></div>
            <span class="px-4 text-sm text-gray-500">Or continue with</span>
            <div class="flex-1 border-t border-gray-300"></div>
            </div>
  
          <div class="mt-6 grid grid-cols-2 gap-3">
            <UButton variant="outline" block @click="loginWithProvider('google')">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </UButton>
            
            <UButton variant="outline" block @click="loginWithProvider('github')">
              <UIcon name="i-simple-icons-github" class="w-5 h-5 mr-2" />
              GitHub
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

definePageMeta({
  title: 'Register'
})

var register = false
var isAuthenticated = false
const toast = useToast()

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  subscribeNewsletter: false
})

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated) {
    navigateTo('/')
  }
})

const isFormValid = computed(() => {
  return registerForm.value.name &&
         registerForm.value.email &&
         registerForm.value.password &&
         registerForm.value.confirmPassword &&
         registerForm.value.password === registerForm.value.confirmPassword &&
         registerForm.value.agreeToTerms
})

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    toast.add({
      title: 'Password Mismatch',
      description: 'Passwords do not match. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle'
    })
    return
  }

  isLoading.value = true
  
  try {
    await register(registerForm.value)
    toast.add({
      title: 'Account Created!',
      description: 'Welcome to AI Learning Hub. Your account has been created successfully.',
      icon: 'i-heroicons-check-circle'
    })
    
    await navigateTo('/')
  } catch (error) {
    toast.add({
      title: 'Registration Failed',
      description: 'Something went wrong. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle'
    })
  } finally {
    isLoading.value = false
  }
}

const registerWithProvider = (provider) => {
  toast.add({
    title: 'Coming Soon',
    description: `${provider} registration will be available soon.`,
    icon: 'i-heroicons-information-circle'
  })
}
</script>
