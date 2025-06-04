<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div v-if="!activeQuiz">
      <!-- Quiz Selection -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Available Quizzes</h1>
        <p class="text-gray-600">Test your knowledge and track your progress</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuizCard
          v-for="quiz in availableQuizzes"
          :key="quiz.id"
          :quiz="quiz"
          @start="startQuiz"
        />
      </div>
    </div>

    <!-- Active Quiz -->
    <QuizInterface
      v-else
      :quiz="activeQuiz"
      @complete="completeQuiz"
      @close="activeQuiz = null"
    />
  </div>
</template>

<script setup>

const availableQuizzes = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals.',
    questions: [
      { question: 'What is a closure?', options: ['A function', 'A variable', 'An object'], answer: 0 },
      { question: 'What is the output of `console.log(typeof null)`?', options: ['null', 'object', 'undefined'], answer: 1 }
    ]
  },
  {
    id: 2,
    title: 'CSS Flexbox',
    description: 'Assess your understanding of CSS Flexbox layout.',
    questions: [
      { question: 'What does `flex-direction` do?', options: ['Sets the direction of flex items', 'Sets the size of flex items', 'Aligns flex items'], answer: 0 },
      { question: 'What is the default value of `flex-wrap`?', options: ['nowrap', 'wrap', 'wrap-reverse'], answer: 0 }
    ]
  }
]

const toast = useToast()

const activeQuiz = ref(null)

const startQuiz = (quiz) => {
  activeQuiz.value = quiz
}

const completeQuiz = (score) => {
  toast.add({
    title: 'Quiz Completed!',
    description: `Your score: ${score}%`,
    icon: 'i-heroicons-check-circle'
  })
  activeQuiz.value = null
}

definePageMeta({
  title: 'Quizzes'
})
</script>
