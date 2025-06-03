<template>
  <UCard class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('start', quiz)">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900">{{ quiz.title }}</h3>
        <span class="text-sm text-gray-500">{{ quiz.questions.length }} questions</span>
      </div>
      
      <p class="text-sm text-gray-600">{{ quiz.description }}</p>
      
      <div class="flex items-center justify-between">
        <UBadge :color="difficultyColor" variant="subtle">
          {{ quiz.difficulty }}
        </UBadge>
        <span class="text-xs text-gray-500">{{ quiz.duration }} min</span>
      </div>
      
      <UButton block>
        Start Quiz
      </UButton>
    </div>
  </UCard>
</template>

<script setup>

const props = defineProps({
  quiz: Object
})

defineEmits(['start'])

const difficultyColor = computed(() => {
  const difficulty = props.quiz?.difficulty?.toLowerCase?.() || '';
  switch (difficulty) {
    case 'beginner': return 'green'
    case 'intermediate': return 'yellow'
    case 'advanced': return 'red'
    default: return 'gray'
  }
})
</script>
