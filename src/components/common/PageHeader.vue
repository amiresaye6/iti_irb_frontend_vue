<template>
  <!--
    USAGE:
    <PageHeader 
      title="طلباتي البحثية الأخيرة" 
      note="نظرة عامة على نشاطك ومتابعة سريعة لأحدث طلبات البحث"
    >
      <template #icon>
        <svg>...</svg>
      </template>
      <template #actions>
        <button class="btn btn-primary">تقديم بحث جديد</button>
      </template>
    </PageHeader>
  -->
  <div class="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200/60 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md">
    
    <!-- Right Section: Icon + Title + Note (RTL layout) -->
    <div class="flex items-center gap-4 w-full sm:w-auto">
      <!-- Icon Container -->
      <div class="hidden sm:flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary">
        <slot name="icon">
          <!-- Default Icon if none provided -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </slot>
      </div>
      
      <!-- Text Content -->
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold text-base-content flex items-center gap-2">
          <!-- Mobile Icon -->
          <div class="sm:hidden text-primary">
             <slot name="icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </slot>
          </div>
          {{ title }}
        </h1>
        <p v-if="note" class="text-sm text-base-content/60 mt-1">{{ note }}</p>
      </div>
    </div>

    <!-- Left Section: Actions -->
    <div class="w-full sm:w-auto flex justify-end">
      <slot name="actions"></slot>
    </div>
    
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  note: {
    type: String,
    default: ''
  }
})
</script>
