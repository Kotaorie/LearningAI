<template>
  <div>
    <!-- Days Header -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div 
        v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
        :key="day" 
        class="p-2 text-center text-sm font-medium text-gray-500"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="date in dates"
        :key="date.date"
        :class="[
          'p-2 text-center text-sm border rounded cursor-pointer transition-colors relative',
          date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
          date.hasSession ? 'bg-primary-50 border-primary-200' : 'border-gray-200 hover:bg-gray-50',
          date.isToday ? 'bg-primary-600 text-white' : ''
        ]"
        @click="$emit('selectDate', date)"
      >
        {{ date.day }}
        <div 
          v-if="date.hasSession && !date.isToday" 
          class="w-1 h-1 bg-primary-600 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dates: Array
})

defineEmits(['selectDate'])
</script>
