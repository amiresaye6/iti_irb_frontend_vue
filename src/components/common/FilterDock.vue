<template>
  <!--
    USAGE:
    <FilterDock 
      :config="[
        { key: 'status', type: 'select', label: 'الحالة', options: [{label: 'الكل', value: ''}, {label: 'معتمد نهائياً', value: 'approved'}] },
        { key: 'search', type: 'text', label: 'البحث السريع', placeholder: 'ابحث برقم الطلب أو العنوان...' }
      ]"
      @filter="handleFilterChange"
    />
  -->
  <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-sm border border-base-200/60 mb-6 transition-all hover:shadow-md">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      
      <!-- Filters Form -->
      <div class="flex flex-wrap flex-1 gap-4 w-full">
        <div 
          v-for="(filter, index) in config" 
          :key="index"
          class="flex flex-col gap-1.5"
          :class="filter.type === 'text' ? 'flex-1 min-w-[250px]' : 'w-full sm:w-[200px]'"
        >
          <label :for="`filter-${filter.key}`" class="text-xs font-semibold text-base-content/70 flex items-center gap-1">
            <svg v-if="filter.type === 'select'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <svg v-if="filter.type === 'text'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {{ filter.label }}
          </label>
          
          <!-- Select Filter -->
          <div v-if="filter.type === 'select'" class="relative">
            <select 
              :id="`filter-${filter.key}`"
              v-model="filterValues[filter.key]"
              @change="emitFilter"
              class="select select-bordered select-sm w-full bg-base-50 focus:border-primary focus:ring-1 focus:ring-primary appearance-none h-10 rounded-lg text-sm"
            >
              <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          
          <!-- Text/Search Filter -->
          <div v-else-if="filter.type === 'text'" class="relative flex-1">
            <input 
              :id="`filter-${filter.key}`"
              type="text" 
              v-model="filterValues[filter.key]"
              @input="handleInputDebounce"
              :placeholder="filter.placeholder || filter.label"
              class="input input-bordered input-sm w-full bg-base-50 focus:border-primary focus:ring-1 focus:ring-primary h-10 rounded-lg text-sm pr-10"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-base-content/40">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Area: Reset Button & Info -->
      <div class="flex items-center gap-3 w-full md:w-auto">
        <button 
          @click="resetFilters" 
          class="btn btn-outline btn-sm h-10 rounded-lg gap-2 text-base-content/70 hover:text-error hover:border-error hover:bg-error/10 transition-colors w-full md:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          إعادة ضبط
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  config: {
    type: Array,
    required: true,
    // Example: [{ key: 'status', type: 'select', label: 'Status', options: [...] }, { key: 'search', type: 'text', label: 'Search' }]
  },
  debounceTime: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['filter'])

const filterValues = ref({})
let debounceTimer = null

// Initialize filters with empty strings or default values if needed
const initFilters = () => {
  const initial = {}
  props.config.forEach(filter => {
    // If it's a select with options, maybe set default to first option's value or empty
    initial[filter.key] = filter.defaultValue !== undefined ? filter.defaultValue : ''
  })
  filterValues.value = initial
}

onMounted(() => {
  initFilters()
})

const emitFilter = () => {
  // Clean up empty filters before emitting to keep URL clean
  const cleanedFilters = Object.entries(filterValues.value).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {})
  
  emit('filter', cleanedFilters)
}

const handleInputDebounce = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emitFilter()
  }, props.debounceTime)
}

const resetFilters = () => {
  initFilters()
  emitFilter()
}

// Watch for config changes (if dynamic)
watch(() => props.config, () => {
  initFilters()
}, { deep: true })
</script>
