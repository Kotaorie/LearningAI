<template>
  <UCard class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click')">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <UBadge 
          :color="statusColor" 
          variant="subtle"
        >
          {{ course.status.replace('-', ' ') }}
        </UBadge>
        <span class="text-xs text-gray-500">{{ course.level }}</span>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ course.title }}</h3>
        <p class="text-sm text-gray-600">{{ course.description }}</p>
      </div>
      
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Progress</span>
          <span class="font-medium">{{ course.progress }}%</span>
        </div>
        <UProgress :value="course.progress" />
      </div>
      
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
          {{ course.duration }}
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-book-open" class="w-4 h-4 mr-1" />
          {{ course.lessons }} lessons
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { computed } from 'vue';

defineEmits(['click'])

const props = defineProps({
  course: Object
})

const statusColor = computed(() => {
  switch (props.course.status) {
    case 'completed': return 'green'
    case 'in-progress': return 'blue'
    default: return 'gray'
  }
})
</script>
