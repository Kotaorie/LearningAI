<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">{{ quiz.title }}</h2>
        <UButton icon="i-heroicons-x-mark" variant="ghost" @click="$emit('close')" />
      </div>
    </template>

    <div class="space-y-6">
      <!-- Progress -->
      <div>
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</span>
          <span>{{ Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100) }}% Complete</span>
        </div>
        <UProgress :value="((currentQuestionIndex + 1) / quiz.questions.length) * 100" />
      </div>

      <!-- Question -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ quiz.questions[currentQuestionIndex].question }}
        </h3>
        
        <URadioGroup
            v-model="selectedAnswers[currentQuestionIndex]"
            :items="quiz.questions[currentQuestionIndex].options.map((text, i) => ({
                label: text,
                value: i
            }))"
            />

      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <UButton
          variant="outline"
          :disabled="currentQuestionIndex === 0"
          @click="previousQuestion"
        >
          Previous
        </UButton>
        
        <UButton
          v-if="currentQuestionIndex < quiz.questions.length - 1"
          :disabled="selectedAnswers[currentQuestionIndex] === undefined"
          @click="nextQuestion"
        >
          Next
        </UButton>
        
        <UButton
          v-else
          :disabled="selectedAnswers[currentQuestionIndex] === undefined"
          @click="submitQuiz"
        >
          Submit Quiz
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup>

const props = defineProps({
  quiz: Object
})

const emit = defineEmits(['complete', 'close'])

const currentQuestionIndex = ref(0)
const selectedAnswers = ref({})

const nextQuestion = () => {
  if (currentQuestionIndex.value < props.quiz.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const submitQuiz = () => {
  let correct = 0
  props.quiz.questions.forEach((question, index) => {
    if (selectedAnswers.value[index] === question.correct) {
      correct++
    }
  })
  
  const score = Math.round((correct / props.quiz.questions.length) * 100)
  emit('complete', score)
}
</script>
