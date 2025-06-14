<template>
  <div class="py-12">
    <UContainer>
      <!-- Header -->
      <div class="text-center space-y-4 mb-16">
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900">
          Simple, Transparent Pricing
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the plan that fits your learning goals. All plans include AI-generated courses, 
          smart scheduling, and progress tracking.
        </p>
      </div>

      <!-- Billing Toggle -->
      <div class="flex justify-center mb-12">
        <div class="bg-gray-100 p-1 rounded-lg">
          <button
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              !isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            ]"
            @click="isAnnual = false"
          >
            Monthly
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            ]"
            @click="isAnnual = true"
          >
            Annual
            <span class="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Free Plan -->
        <PricingCard
          name="Free"
          :price="0"
          :annual-price="0"
          :is-annual="isAnnual"
          description="Perfect for trying out AI-powered learning"
          :features="[
            '1 AI-generated course per month',
            'Basic quizzes and assessments',
            'Community support',
            'Mobile app access',
            'Progress tracking'
          ]"
          cta-text="Get Started Free"
          cta-link="/auth/register"
        />

        <!-- Pro Plan -->
        <PricingCard
          name="Pro"
          :price="19"
          :annual-price="15"
          :is-annual="isAnnual"
          description="For serious learners who want unlimited access"
          :features="[
            'Unlimited AI-generated courses',
            'Advanced quizzes with explanations',
            'Smart scheduling optimization',
            'Priority support',
            'Detailed analytics',
            'Custom learning paths',
            'Offline course downloads'
          ]"
          cta-text="Start Pro Trial"
          cta-link="/auth/register?plan=pro"
          is-popular
        />

        <!-- Enterprise Plan -->
        <PricingCard
          name="Enterprise"
          :price="49"
          :annual-price="39"
          :is-annual="isAnnual"
          description="For teams and organizations"
          :features="[
            'Everything in Pro',
            'Team management dashboard',
            'Custom branding',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
            'Advanced reporting',
            'SSO authentication'
          ]"
          cta-text="Contact Sales"
          cta-link="/contact"
        />
      </div>

      <!-- FAQ Section -->
      <div class="mt-20">
        <div class="text-center space-y-4 mb-12">
          <h2 class="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p class="text-gray-600">
            Everything you need to know about our pricing and plans
          </p>
        </div>

        <div class="max-w-3xl mx-auto">
          <UAccordion :items="faqItems" />
        </div>
      </div>

      <!-- Money Back Guarantee -->
      <div class="mt-16 text-center">
        <div class="bg-green-50 rounded-2xl p-8 max-w-2xl mx-auto">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            30-Day Money-Back Guarantee
          </h3>
          <p class="text-gray-600">
            Try any paid plan risk-free. If you're not completely satisfied within 30 days, 
            we'll refund your money, no questions asked.
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>

const isAnnual = ref(false)

const faqItems = [
  {
    label: 'Can I change my plan at any time?',
    content: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    defaultOpen: true
  },
  {
    label: 'What happens to my courses if I cancel?',
    content: 'You\'ll retain access to all your courses and progress for 30 days after cancellation. You can export your data anytime.'
  },
  {
    label: 'Do you offer student discounts?',
    content: 'Yes! Students with a valid .edu email address get 50% off any paid plan. Contact support to apply your discount.'
  },
  {
    label: 'How does the AI course generation work?',
    content: 'Our AI analyzes your learning goals, current knowledge level, and preferences to create personalized courses with lessons, quizzes, and schedules.'
  },
  {
    label: 'Is there a limit to how many courses I can create?',
    content: 'Free plan allows 1 course per month. Pro and Enterprise plans have unlimited course generation.'
  },
  {
    label: 'Can I use this for my team or organization?',
    content: 'Our Enterprise plan includes team management features, custom branding, and advanced reporting for organizations.'
  }
]

definePageMeta({
  title: 'Pricing - AI Learning Hub'
})
</script>
