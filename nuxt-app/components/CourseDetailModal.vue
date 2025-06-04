<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-2xl' }">
    <UCard>
      <template #header>
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ course.title }}</h2>
            <p class="text-gray-600 mt-1">{{ course.description }}</p>
          </div>
          <UButton icon="i-heroicons-x-mark" variant="ghost" @click="$emit('close')" />
        </div>
      </template>
      
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-primary-600">{{ course.progress }}%</div>
            <div class="text-sm text-gray-600">Progress</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ course.lessons }}</div>
            <div class="text-sm text-gray-600">Lessons</div>
          </div>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-900 mb-3">Course Outline</h3>
          <div class="space-y-2">
            <div 
              v-for="(lesson, index) in course.outline" 
              :key="index" 
              class="flex items-center p-3 border rounded-lg"
            >
              <UIcon 
                :name="lesson.completed ? 'i-heroicons-check-circle' : 'i-heroicons-circle'" 
                :class="lesson.completed ? 'text-green-600' : 'text-gray-400'"
                class="w-5 h-5 mr-3" 
              />
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ lesson.title }}</div>
                <div class="text-sm text-gray-600">{{ lesson.duration }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <UButton class="flex-1">
            Continue Learning
          </UButton>
          <UButton variant="outline">
            View Schedule
          </UButton>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>

defineProps({
  course: Object
})

defineEmits(['close'])

const isOpen = ref(true)

watch(isOpen, (value) => {
  if (!value) {
    emit('close')
  }
})
</script>
