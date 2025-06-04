<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
      <p class="text-gray-600">Manage your account information and preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
          </template>

          <UForm :state="profileForm" @submit="updatePersonalInfo" class="space-y-6">
            <div class="flex items-center space-x-6">
              <UAvatar :src="user?.avatar" :alt="user?.name" size="xl" />
              <div>
                <UButton variant="outline" size="sm">
                  Change Photo
                </UButton>
                <p class="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Full Name">
                <UInput v-model="profileForm.name" size="xl" class="w-full" />
              </UFormField>

              <UFormField label="Email">
                <UInput v-model="profileForm.email" type="email"  size="xl" class="w-full" />
              </UFormField>
            </div>

            <UFormField label="Bio">
              <UTextarea 
                v-model="profileForm.bio" 
                placeholder="Tell us about yourself..."
                :rows="3"
                size="xl" 
                class="w-full" 
              />
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Location">
                <UInput v-model="profileForm.location" placeholder="City, Country" size="xl" class="w-full"  />
              </UFormField>

              <UFormField label="Website">
                <UInput v-model="profileForm.website" placeholder="https://..." size="xl" class="w-full"  />
              </UFormField>
            </div>

            <UButton type="submit" :loading="isSaving">
              Save Changes
            </UButton>
          </UForm>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          </template>

          <div class="space-y-3">
            <div
              v-for="achievement in achievements"
              :key="achievement.id"
              class="flex items-center space-x-3"
            >
              <div :class="['p-2 rounded-lg', achievement.color]">
                <UIcon :name="achievement.icon" class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ achievement.title }}</p>
                <p class="text-xs text-gray-500">{{ achievement.date }}</p>
              </div>
            </div>
          </div>
        </UCard>

      </div>
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Account Stats</h3>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Member since</span>
              <span class="font-medium">{{ formatDate(user?.joinedDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Courses completed</span>
              <span class="font-medium">{{ completedCourses }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total study time</span>
              <span class="font-medium">{{ studyHours }}h</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Quiz average</span>
              <span class="font-medium">{{ quizAverage }}%</span>
            </div>
          </div>
        </UCard>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
          </template>

          <div class="space-y-4">
            <UFormField>
              <UCheckbox
                v-model="notifications.email"
                label="Email notifications"
              />
            </UFormField>

            <UFormField>
              <UCheckbox
                v-model="notifications.push"
                label="Push notifications"
              />
            </UFormField>

            <UFormField>
              <UCheckbox
                v-model="notifications.reminders"
                label="Study reminders"
              />
            </UFormField>

            <UFormField>
              <UCheckbox
                v-model="notifications.achievements"
                label="Achievement alerts"
              />
            </UFormField>

            <UButton @click="saveNotifications" size="sm" block>
              Save Settings
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: 'Profile'
})

var studyHours = 12
var updateProfile = {}
var user = {
    name: 'John Doe',
    email: 'john@gmail.com',
    avatar: 'https://example.com/avatar.jpg',
    joinedDate: '2022-01-15',
    bio: 'Avid learner and tech enthusiast.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com'
}
const toast = useToast()

const isSaving = ref(false)
const isSavingPreferences = ref(false)

const profileForm = ref({
  name: '',
  email: '',
  bio: '',
  location: '',
  website: ''
})

const preferences = ref({
  learningStyle: '',
  studyTimes: [],
  difficulty: 3
})

const notifications = ref({
  email: true,
  push: true,
  reminders: true,
  achievements: true
})

const learningStyles = [
  { label: 'Visual', value: 'visual' },
  { label: 'Auditory', value: 'auditory' },
  { label: 'Kinesthetic', value: 'kinesthetic' },
  { label: 'Reading/Writing', value: 'reading' }
]

const studyTimes = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
  { label: 'Night', value: 'night' }
]

const completedCourses = computed(() => {
  // Calculate from actual data
  return 3
})

const quizAverage = computed(() => {
  // Calculate from actual quiz scores
  return 87
})

const achievements = ref([
  {
    id: 1,
    title: 'First Course Completed',
    date: '2 days ago',
    icon: 'i-heroicons-trophy',
    color: 'bg-yellow-500'
  },
  {
    id: 2,
    title: 'Quiz Master',
    date: '1 week ago',
    icon: 'i-heroicons-academic-cap',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    title: 'Study Streak',
    date: '2 weeks ago',
    icon: 'i-heroicons-fire',
    color: 'bg-red-500'
  }
])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const updatePersonalInfo = async () => {
  isSaving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    updateProfile(profileForm.value)
    
    toast.add({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Update Failed',
      description: 'Failed to update profile. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle'
    })
  } finally {
    isSaving.value = false
  }
}

const savePreferences = async () => {
  isSavingPreferences.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      title: 'Preferences Saved',
      description: 'Your learning preferences have been updated.',
      icon: 'i-heroicons-check-circle'
    })
  } finally {
    isSavingPreferences.value = false
  }
}

const saveNotifications = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast.add({
      title: 'Settings Saved',
      description: 'Your notification preferences have been updated.',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Save Failed',
      description: 'Failed to save notification settings.',
      color: 'red'
    })
  }
}

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      bio: user.value.bio || '',
      location: user.value.location || '',
      website: user.value.website || ''
    }
  }
})
</script>
