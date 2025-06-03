<template>
  <UCard>
    <div class="flex items-center">
      <div :class="[
        'p-3 rounded-lg',
        color === 'blue' ? 'bg-blue-100' :
        color === 'green' ? 'bg-green-100' :
        color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
      ]">
        <UIcon 
          :name="icon" 
          :class="[
            'w-6 h-6',
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-green-600' :
            color === 'purple' ? 'text-purple-600' : 'text-gray-600'
          ]" 
        />
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: {
    type: String,
    default: 'blue'
  }
})
</script>
