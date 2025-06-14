<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Welcome back! Here's your learning overview.</p>
    </div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Active Courses"
        :value="activeCourses"
        icon="i-heroicons-book-open"
        color="blue"
      />
      <StatsCard
        title="Completed Quizzes"
        :value="completedQuizzes"
        icon="i-heroicons-check-circle"
        color="green"
      />
      <StatsCard
        title="Study Hours"
        :value="`${studyHours}h`"
        icon="i-heroicons-clock"
        color="purple"
      />
    </div>
    <!-- Recent Activity -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </template>
      
      <div class="space-y-4">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-center space-x-3"
        >
          <UIcon :name="activity.icon" :class="['w-5 h-5', activity.color]" />
          <div class="flex-1">
            <p class="text-sm text-gray-900">{{ activity.description }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { definePageMeta } from '#imports'

const activeCourses = 3
const completedQuizzes = 5
const studyHours = 12
const recentActivity = [
  { id: 1, description: 'Completed "Introduction to AI" course', time: '2 hours ago', icon: 'i-heroicons-check-circle', color: 'text-green-600' },
  { id: 2, description: 'Started "Machine Learning Basics" course', time: '1 day ago', icon: 'i-heroicons-book-open', color: 'text-blue-600' },
  { id: 3, description: 'Scored 85% on "AI Fundamentals" quiz', time: '3 days ago', icon: 'i-heroicons-check-circle', color: 'text-green-600' }
]


definePageMeta({
  title: 'Dashboard'
})
</script>
