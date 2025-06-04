<template>
  <div class="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
    <div class="flex items-center justify-between mb-2">
      <span class="font-medium text-gray-900">{{ session.course }}</span>
      <span class="text-xs text-gray-500">{{ session.duration }}</span>
    </div>
    <div class="text-sm text-gray-600 mb-1">{{ session.topic }}</div>
    <div class="flex items-center text-xs text-gray-500">
      <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
      {{ session.date }} at {{ session.time }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  session: Object
})
</script>
