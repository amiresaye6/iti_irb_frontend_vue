<template>
  <!--
    USAGE:
    <DataTablePagination 
      :currentPage="page"
      :totalPages="10"
      :totalItems="100"
      :itemsPerPage="10"
      @page-change="handlePageChange"
    />
  -->
  <div class="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-base-100 border-t border-base-200/60 gap-4">
    
    <!-- Info Section -->
    <div class="text-sm text-base-content/60 font-medium w-full sm:w-auto text-center sm:text-start">
      <span v-if="totalItems > 0">
        عرض {{ startItem }} - {{ endItem }} من إجمالي {{ totalItems }}
      </span>
      <span v-else>لا توجد بيانات</span>
    </div>

    <!-- Pagination Controls -->
    <div class="join w-full sm:w-auto justify-center" dir="ltr">
      <!-- We use dir="ltr" to keep next/prev buttons logically aligned, but we map arrows based on RTL/LTR layout context visually. -->
      
      <!-- Previous Button (RTL Right Arrow) -->
      <button 
        class="join-item btn btn-sm bg-base-100 hover:bg-base-200 border-base-200"
        :disabled="currentPage === 1"
        @click="emitPage(currentPage - 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Page Numbers Container -->
      <div class="join-item btn btn-sm bg-base-100 border-base-200 pointer-events-none font-semibold text-primary">
        {{ currentPage }} / {{ totalPages || 1 }}
      </div>

      <!-- Next Button (RTL Left Arrow) -->
      <button 
        class="join-item btn btn-sm bg-base-100 hover:bg-base-200 border-base-200"
        :disabled="currentPage === totalPages || totalPages === 0"
        @click="emitPage(currentPage + 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['page-change'])

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return ((props.currentPage - 1) * props.itemsPerPage) + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return end > props.totalItems ? props.totalItems : end
})

const emitPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= props.totalPages) {
    emit('page-change', pageNumber)
  }
}
</script>
