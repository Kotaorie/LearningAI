<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
      <p class="text-gray-600">Manage your subscription and billing information</p>
    </div>

    <!-- Current Plan -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Current Plan</h2>
          <UBadge color="green" variant="subtle">Active</UBadge>
        </div>
      </template>

      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ currentPlan.name }}</h3>
            <p class="text-gray-600">{{ currentPlan.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900">
              ${{ currentPlan.price }}<span class="text-base font-normal text-gray-600">/month</span>
            </div>
            <p class="text-sm text-gray-600">Billed {{ currentPlan.billing }}</p>
          </div>
        </div>

        <div class="border-t pt-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ usage.coursesGenerated }}</div>
              <div class="text-sm text-gray-600">Courses Generated</div>
              <div class="text-xs text-gray-500">{{ currentPlan.courseLimit }} limit</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ usage.quizzesCompleted }}</div>
              <div class="text-sm text-gray-600">Quizzes Completed</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ usage.studyHours }}</div>
              <div class="text-sm text-gray-600">Study Hours</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <UButton to="/pricing" variant="outline">
            Change Plan
          </UButton>
          <UButton variant="outline" color="red" @click="showCancelModal = true">
            Cancel Subscription
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Billing History -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold text-gray-900">Billing History</h2>
      </template>

      <div class="space-y-4">
        <div
          v-for="invoice in billingHistory"
          :key="invoice.id"
          class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
        >
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ invoice.description }}</p>
              <p class="text-sm text-gray-600">{{ invoice.date }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="font-medium text-gray-900">${{ invoice.amount }}</p>
              <UBadge 
                :color="invoice.status === 'paid' ? 'green' : invoice.status === 'pending' ? 'yellow' : 'red'"
                variant="subtle"
                size="xs"
              >
                {{ invoice.status }}
              </UBadge>
            </div>
            <UButton variant="ghost" size="sm" icon="i-heroicons-arrow-down-tray">
              Download
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Payment Method -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Payment Method</h2>
          <UButton variant="outline" size="sm" @click="showPaymentModal = true">
            Update
          </UButton>
        </div>
      </template>

      <div class="flex items-center space-x-4">
        <div class="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
          <span class="text-white text-xs font-bold">VISA</span>
        </div>
        <div>
          <p class="font-medium text-gray-900">•••• •••• •••• {{ paymentMethod.last4 }}</p>
          <p class="text-sm text-gray-600">Expires {{ paymentMethod.expiry }}</p>
        </div>
      </div>
    </UCard>

    <!-- Cancel Subscription Modal -->
    <UModal v-model="showCancelModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600">
            Are you sure you want to cancel your subscription? You'll lose access to:
          </p>
          <ul class="space-y-2">
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
              <span class="text-sm text-gray-700">Unlimited AI-generated courses</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
              <span class="text-sm text-gray-700">Advanced analytics and reporting</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
              <span class="text-sm text-gray-700">Priority customer support</span>
            </li>
          </ul>
          <p class="text-sm text-gray-600">
            Your subscription will remain active until {{ currentPlan.nextBilling }}.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton variant="outline" @click="showCancelModal = false">
              Keep Subscription
            </UButton>
            <UButton color="red" @click="cancelSubscription">
              Cancel Subscription
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Update Payment Modal -->
    <UModal v-model="showPaymentModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Update Payment Method</h3>
        </template>

        <UForm :state="paymentForm" @submit="updatePaymentMethod" class="space-y-4">
          <UFormGroup label="Card Number" required>
            <UInput v-model="paymentForm.cardNumber" placeholder="1234 5678 9012 3456" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Expiry Date" required>
              <UInput v-model="paymentForm.expiry" placeholder="MM/YY" />
            </UFormGroup>
            <UFormGroup label="CVC" required>
              <UInput v-model="paymentForm.cvc" placeholder="123" />
            </UFormGroup>
          </div>

          <UFormGroup label="Cardholder Name" required>
            <UInput v-model="paymentForm.name" placeholder="John Doe" />
          </UFormGroup>
        </UForm>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton variant="outline" @click="showPaymentModal = false">
              Cancel
            </UButton>
            <UButton @click="updatePaymentMethod" :loading="isUpdatingPayment">
              Update Payment Method
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const toast = useToast()

const showCancelModal = ref(false)
const showPaymentModal = ref(false)
const isUpdatingPayment = ref(false)

const currentPlan = ref({
  name: 'Pro Plan',
  description: 'Perfect for serious learners',
  price: 19,
  billing: 'monthly',
  courseLimit: 'Unlimited',
  nextBilling: 'January 15, 2025'
})

const usage = ref({
  coursesGenerated: 12,
  quizzesCompleted: 45,
  studyHours: 87
})

const billingHistory = ref([
  {
    id: 1,
    description: 'Pro Plan - Monthly',
    date: 'Dec 15, 2024',
    amount: 19,
    status: 'paid'
  },
  {
    id: 2,
    description: 'Pro Plan - Monthly',
    date: 'Nov 15, 2024',
    amount: 19,
    status: 'paid'
  },
  {
    id: 3,
    description: 'Pro Plan - Monthly',
    date: 'Oct 15, 2024',
    amount: 19,
    status: 'paid'
  }
])

const paymentMethod = ref({
  last4: '4242',
  expiry: '12/26'
})

const paymentForm = ref({
  cardNumber: '',
  expiry: '',
  cvc: '',
  name: ''
})

const cancelSubscription = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  toast.add({
    title: 'Subscription Cancelled',
    description: 'Your subscription has been cancelled. You\'ll retain access until January 15, 2025.',
    icon: 'i-heroicons-check-circle'
  })
  
  showCancelModal.value = false
}

const updatePaymentMethod = async () => {
  isUpdatingPayment.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  toast.add({
    title: 'Payment Method Updated',
    description: 'Your payment method has been successfully updated.',
    icon: 'i-heroicons-check-circle'
  })
  
  isUpdatingPayment.value = false
  showPaymentModal.value = false
  
  // Reset form
  paymentForm.value = {
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  }
}

definePageMeta({
  title: 'Billing',
})
</script>
