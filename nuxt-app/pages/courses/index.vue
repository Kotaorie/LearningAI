<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Courses</h1>
        <p class="text-gray-600">Manage and track your learning progress</p>
      </div>
      
      <UButton to="/courses/request" icon="i-heroicons-plus">
        Request New Course
      </UButton>
    </div>
    <div class="flex space-x-2">
      <UButton
        v-for="filter in courseFilters"
        :key="filter"
        :variant="activeCourseFilter === filter ? 'solid' : 'outline'"
        size="sm"
        @click="activeCourseFilter = filter"
      >
        {{ filter }}
      </UButton>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        @click="selectedCourse = course"
      />
    </div>
    <CourseDetailModal
      v-if="selectedCourse"
      :course="selectedCourse"
      @close="selectedCourse = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CourseCard from '~/components/CourseCard.vue'
import CourseDetailModal from '~/components/CourseDetailModal.vue'

const activeCourses = ref([
  {
    id: 1,
    title: 'Introduction to AI',
    description: 'Learn the basics of Artificial Intelligence.',
    status: 'in-progress',
    level: 'Beginner',
    progress: 60,
    duration: '4 weeks',
    lessons: 10,
    outline: [
      { title: 'What is AI?', completed: true, duration: '1 week' },
      { title: 'Machine Learning Basics', completed: false, duration: '1 week' },
      { title: 'Deep Learning Overview', completed: false, duration: '2 weeks' }
    ]
  },
  {
    id: 2,
    title: 'Advanced Machine Learning',
    description: 'Dive deep into machine learning algorithms.',
    status: 'completed',
    level: 'Advanced',
    progress: 100,
    duration: '6 weeks',
    lessons: 15,
    outline: [
      { title: 'Supervised Learning', completed: true, duration: '2 weeks' },
      { title: 'Unsupervised Learning', completed: true, duration: '2 weeks' },
      { title: 'Reinforcement Learning', completed: true, duration: '2 weeks' }
    ]
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    description: 'Understand the core concepts of data science.',
    status: 'not-started',
    level: 'Intermediate',
    progress: 0,
    duration: '5 weeks',
    lessons: 12,
    outline: [
      { title: 'Data Collection', completed: false, duration: '1 week' },
      { title: 'Data Cleaning', completed: false, duration: '1 week' },
      { title: 'Data Visualization', completed: false, duration: '3 weeks' }
    ]
  }
])

const courseFilters = ['All', 'In Progress', 'Completed', 'Not Started']
const activeCourseFilter = ref('All')
const selectedCourse = ref(null)

const filteredCourses = computed(() => {
  if (activeCourseFilter.value === 'All') return activeCourses.value
  return activeCourses.value.filter(course => {
    switch (activeCourseFilter.value) {
      case 'In Progress':
        return course.status === 'in-progress'
      case 'Completed':
        return course.status === 'completed'
      case 'Not Started':
        return course.status === 'not-started'
      default:
        return true
    }
  })
})

definePageMeta({
  title: 'My Courses'
})
</script>
