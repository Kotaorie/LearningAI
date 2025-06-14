<template>
  <UCard class="h-full">
    <div class="space-y-4">
      <div class="flex items-center space-x-1 text-yellow-400">
        <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-4 h-4" />
      </div>
      <blockquote class="text-gray-700 italic">
        "{{ quote }}"
      </blockquote>
      <div class="flex items-center space-x-3">
        <UAvatar :src="avatar" :alt="author" size="sm" />
        <div>
          <p class="font-semibold text-gray-900">{{ author }}</p>
          <p class="text-sm text-gray-600">{{ role }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  quote: String,
  author: String,
  role: String,
  avatar: String
})
</script>
