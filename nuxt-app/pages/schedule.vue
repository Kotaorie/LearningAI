<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">My Learning Schedule</h1>
      <p class="text-gray-600">Plan and track your study sessions</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendar -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">{{ currentMonth }} {{ currentYear }}</h3>
              <div class="flex space-x-2">
                <UButton icon="i-heroicons-chevron-left" variant="ghost" size="sm" @click="previousMonth" />
                <UButton icon="i-heroicons-chevron-right" variant="ghost" size="sm" @click="nextMonth" />
              </div>
            </div>
          </template>

          <ScheduleCalendar :dates="calendarDates" @select-date="selectDate" />
        </UCard>
      </div>

      <!-- Upcoming Sessions -->
      <div>
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
          </template>

          <div class="space-y-3">
            <SessionCard
              v-for="session in upcomingSessions"
              :key="session.id"
              :session="session"
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>

const upcomingSessions = ref([
  {
    id: 1,
    course: 'Introduction to AI',
    topic: 'Understanding Neural Networks',
    date: '2023-10-15',
    time: '10:00 AM - 11:30 AM',
    duration: '1.5 hours'
  },
  {
    id: 2,
    course: 'Web Development Basics',
    topic: 'HTML & CSS Fundamentals',
    date: '2023-10-16',
    time: '2:00 PM - 3:30 PM',
    duration: '1.5 hours'
  }
])

const currentMonth = ref('')
const currentYear = ref('')
const calendarDates = ref([])

const generateCalendar = () => {
  const now = new Date()
  currentMonth.value = now.toLocaleString('default', { month: 'long' })
  currentYear.value = now.getFullYear()
  
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const dates = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    dates.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === now.getMonth(),
      isToday: date.toDateString() === now.toDateString(),
      hasSession: Math.random() > 0.8
    })
  }
  
  calendarDates.value = dates
}

const previousMonth = () => {
  // Implementation for previous month
}

const nextMonth = () => {
  // Implementation for next month
}

const selectDate = (date) => {
  // Implementation for date selection
}

onMounted(() => {
  generateCalendar()
})

definePageMeta({
  title: 'Schedule'
})
</script>
