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
  <thead class="text-neutral-content text-sm" style="background-color: oklch(35% 0.02 245)">
    <tr>
      <th 
        v-for="col in columns" 
        :key="col.key"
        class="px-6 py-4 font-extrabold text-start whitespace-nowrap border-b-[2px] border-primary"
        :class="[col.sortable ? 'cursor-pointer hover:brightness-110 transition-all select-none' : '', col.class]"
        @click="col.sortable ? emitSort(col.key) : null"
      >
        <div class="flex items-center gap-2">
          {{ col.label }}
          
          <!-- Sort Indicator -->
          <div v-if="col.sortable" class="flex items-center justify-center w-6 h-6 rounded-full bg-white/15" :class="{ 'bg-white/25': currentSortColumn === col.key }">
            <svg 
              v-if="currentSortColumn !== col.key || currentSortDirection === 'asc'"
              xmlns="http://www.w3.org/2000/svg" 
              class="h-3.5 w-3.5 transition-all" 
              :class="{ 'opacity-50': currentSortColumn !== col.key }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <svg 
              v-else-if="currentSortColumn === col.key && currentSortDirection === 'desc'"
              xmlns="http://www.w3.org/2000/svg" 
              class="h-3.5 w-3.5 transition-all" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
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
