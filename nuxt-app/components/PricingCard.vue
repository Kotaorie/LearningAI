<template>
  <div :class="[
    'relative rounded-2xl border p-8 transition-all duration-200',
    isPopular 
      ? 'border-primary-200 bg-primary-50 shadow-lg scale-105' 
      : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300'
  ]">
    <!-- Popular Badge -->
    <div v-if="isPopular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
      <span class="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
        Most Popular
      </span>
    </div>

    <div class="space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h3 class="text-xl font-semibold text-gray-900">{{ name }}</h3>
        <p class="text-gray-600 mt-2">{{ description }}</p>
      </div>

      <!-- Price -->
      <div class="text-center">
        <div class="flex items-baseline justify-center">
          <span class="text-4xl font-bold text-gray-900">
            ${{ isAnnual ? annualPrice : price }}
          </span>
          <span class="text-gray-600 ml-1">
            /{{ isAnnual ? 'year' : 'month' }}
          </span>
        </div>
        <div v-if="isAnnual && price > 0" class="text-sm text-green-600 mt-1">
          Save ${{ (price * 12 - annualPrice * 12) }} per year
        </div>
      </div>

      <!-- Features -->
      <ul class="space-y-3">
        <li v-for="feature in features" :key="feature" class="flex items-start">
          <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <span class="text-gray-700">{{ feature }}</span>
        </li>
      </ul>

      <!-- CTA Button -->
      <UButton
        :to="ctaLink"
        :variant="isPopular ? 'solid' : 'outline'"
        size="lg"
        block
        class="justify-center"
      >
        {{ ctaText }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  price: Number,
  annualPrice: Number,
  isAnnual: Boolean,
  description: String,
  features: Array,
  ctaText: String,
  ctaLink: String,
  isPopular: {
    type: Boolean,
    default: false
  }
})
</script>
