<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-semibold text-gray-900">Request a New Course</h1>
        <p class="text-gray-600">Let AI generate a personalized course for you</p>
      </template>

      <UForm :state="courseRequest" @submit="generateCourse" class="space-y-6">
        <UFormField label="Course Topic" required>
          <UInput
            v-model="courseRequest.topic"
            placeholder="e.g., JavaScript Fundamentals, Data Science, Digital Marketing"
            size="xl"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Difficulty Level">
          <USelect
            v-model="courseRequest.level"
            :items="levelOptions"
            size="xl"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Preferred Duration">
          <USelect
            v-model="courseRequest.duration"
            :items="durationOptions"
            size="xl"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Available Study Times">
          <div class="grid grid-cols-2 gap-4">
            <UCheckbox
              v-for="time in availableTimes"
              :key="time.value"
              v-model="courseRequest.availableTimes"
              :value="time.value"
              :label="time.label"
            />
          </div>
        </UFormField>

        <UFormField label="Learning Goals (Optional)">
          <UTextarea
            v-model="courseRequest.goals"
            placeholder="What do you hope to achieve with this course?"
            :rows="3"
            size="xl"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="isGenerating"
          :disabled="!courseRequest.topic"
          block
          icon="i-heroicons-sparkles"
        >
          {{ isGenerating ? 'Generating Course...' : 'Generate Course with AI' }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup>

const toast = useToast()

const isGenerating = ref(false)
const courseRequest = ref({
  topic: '',
  level: '',
  duration: '',
  availableTimes: [],
  goals: ''
})

const levelOptions = ref([
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' }
])

const durationOptions = [
  { label: '1 Week', value: '1-week' },
  { label: '2 Weeks', value: '2-weeks' },
  { label: '1 Month', value: '1-month' },
  { label: '3 Months', value: '3-months' }
]

const availableTimes = [
  { label: 'Morning (6-12 PM)', value: 'morning' },
  { label: 'Afternoon (12-6 PM)', value: 'afternoon' },
  { label: 'Evening (6-10 PM)', value: 'evening' },
  { label: 'Weekends', value: 'weekend' }
]

const generateCourse = async () => {
  isGenerating.value = true
  
  try {
    // Simulate AI course generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newCourse = {
      title: `${courseRequest.value.topic} Course`,
      description: `AI-generated course for ${courseRequest.value.topic}`,
      level: courseRequest.value.level,
      duration: courseRequest.value.duration,
      lessons: Math.floor(Math.random() * 15) + 5,
      outline: [
        { title: 'Introduction', duration: '30 min', completed: false },
        { title: 'Core Concepts', duration: '45 min', completed: false },
        { title: 'Practical Applications', duration: '60 min', completed: false },
        { title: 'Advanced Topics', duration: '90 min', completed: false }
      ]
    }
    
    addCourse(newCourse)
    
    toast.add({
      title: 'Course Generated!',
      description: `Your ${courseRequest.value.topic} course has been created successfully.`,
      icon: 'i-heroicons-check-circle'
    })
    
    // Reset form
    courseRequest.value = {
      topic: '',
      level: 'beginner',
      duration: '2-weeks',
      availableTimes: [],
      goals: ''
    }
    
    // Navigate to courses page
    await navigateTo('/courses')
    
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to generate course. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle'
    })
  } finally {
    isGenerating.value = false
  }
}

definePageMeta({
  title: 'Request Course'
})
</script>
