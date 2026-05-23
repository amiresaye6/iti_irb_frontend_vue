<template>
  <!--
    USAGE:
    <DataTableHeader 
      :columns="[
        { key: 'id', label: 'رقم الطلب', sortable: true },
        { key: 'title', label: 'عنوان البحث', sortable: true },
        { key: 'researcher', label: 'الباحث الرئيسي', sortable: false }
      ]"
      :currentSortColumn="sortCol"
      :currentSortDirection="sortDir"
      @sort="handleSort"
    />
  -->
  <thead class="bg-base-200/50 text-base-content/70 text-sm">
    <tr>
      <th 
        v-for="col in columns" 
        :key="col.key"
        class="px-6 py-4 font-semibold text-start whitespace-nowrap"
        :class="[col.sortable ? 'cursor-pointer hover:bg-base-200 transition-colors select-none' : '', col.class]"
        @click="col.sortable ? emitSort(col.key) : null"
      >
        <div class="flex items-center gap-2">
          {{ col.label }}
          
          <!-- Sort Indicator -->
          <div v-if="col.sortable" class="flex flex-col opacity-40" :class="{ 'opacity-100 text-primary': currentSortColumn === col.key }">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-3 w-3 -mb-1" 
              :class="{ 'text-primary opacity-100': currentSortColumn === col.key && currentSortDirection === 'asc' }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-3 w-3" 
              :class="{ 'text-primary opacity-100': currentSortColumn === col.key && currentSortDirection === 'desc' }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </th>
      <!-- Optional slot for extra headers, e.g., Actions column -->
      <slot></slot>
    </tr>
  </thead>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
    // Expected structure: { key: String, label: String, sortable: Boolean, class: String }
  },
  currentSortColumn: {
    type: String,
    default: ''
  },
  currentSortDirection: {
    type: String,
    default: 'asc',
    validator: (value) => ['asc', 'desc', ''].includes(value)
  }
})

const emit = defineEmits(['sort'])

const emitSort = (columnKey) => {
  let newDirection = 'asc'
  
  if (props.currentSortColumn === columnKey) {
    if (props.currentSortDirection === 'asc') {
      newDirection = 'desc'
    } else if (props.currentSortDirection === 'desc') {
      // Third click removes sorting
      newDirection = ''
      columnKey = ''
    }
  }

  emit('sort', { column: columnKey, direction: newDirection })
}
</script>
