<template>
  <!--
    USAGE:
    <SearchBar
      v-model="searchQuery"
      placeholder="ابحث برقم الملف أو عنوان البحث..."
      title="البحث والتصفية"
      @reset="handleReset"
    />
  -->
  <div class="irb-toolbar-card">
    <div class="irb-toolbar-meta">
      <h3 class="irb-toolbar-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="irb-toolbar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {{ title }}
      </h3>
      <button type="button" class="irb-btn-reset" @click="handleReset">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        إعادة ضبط
      </button>
    </div>

    <div class="flex flex-col md:flex-row items-end gap-4 w-full">
      <div class="irb-filter-group flex-1 w-full">
        <label class="irb-filter-label" :for="inputId">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ searchLabel }}
        </label>
        <div class="irb-search-wrapper">
          <input
            :id="inputId"
            type="text"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder"
            class="irb-search-input"
          />
          <span class="irb-search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      <!-- Slot for extra filters -->
      <slot name="extra-filters"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'البحث والتصفية'
  },
  searchLabel: {
    type: String,
    default: 'البحث السريع'
  },
  placeholder: {
    type: String,
    default: 'ابحث هنا...'
  },
  inputId: {
    type: String,
    default: 'searchBarInput'
  }
})

const emit = defineEmits(['update:modelValue', 'reset'])

const handleReset = () => {
  emit('update:modelValue', '')
  emit('reset')
}
</script>

<style scoped>
.irb-toolbar-card {
  background: linear-gradient(180deg, rgba(44,62,80,0.04) 0%, rgba(255,255,255,0.92) 100%);
  border: 1px solid rgba(189,195,199,0.6);
  border-radius: var(--rounded-box, 1rem);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06));
  padding: 14px 18px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.irb-toolbar-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.irb-toolbar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: oklch(var(--p));
  font-weight: 800;
  font-size: 0.95rem;
  margin: 0;
}

.irb-toolbar-icon {
  width: 18px;
  height: 18px;
}

.irb-btn-reset {
  border: 1.5px solid oklch(var(--b3, 89.824% 0.00952 262.71));
  background: #fff;
  color: oklch(var(--p));
  border-radius: 10px;
  padding: 7px 14px;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  font-size: 0.88rem;
}

.irb-btn-reset:hover {
  background: oklch(var(--p) / 0.1);
  border-color: oklch(var(--p));
}

.irb-filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.irb-filter-label {
  font-size: 0.78rem;
  font-weight: 800;
  color: oklch(var(--p));
  display: flex;
  align-items: center;
  gap: 6px;
}

.irb-search-wrapper {
  position: relative;
}

.irb-search-input {
  width: 100%;
  border: 1.5px solid rgba(189,195,199,0.9);
  border-radius: 10px;
  background: #fff;
  color: inherit;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 9px 38px 9px 12px;
  box-sizing: border-box;
  transition: all 0.2s ease;
  outline: none;
}

.irb-search-input:focus {
  border-color: var(--a, oklch(74.51% 0.167 183.61));
  box-shadow: 0 0 0 3px rgba(26,188,156,0.12);
}

.irb-search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(127,140,141,0.7);
  pointer-events: none;
  display: flex;
  align-items: center;
}

/* dark mode */
:root[data-theme="dark"] .irb-toolbar-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(30,40,55,0.92) 100%);
  border-color: rgba(255,255,255,0.08);
}

:root[data-theme="dark"] .irb-btn-reset {
  background: transparent;
  border-color: rgba(255,255,255,0.15);
}

:root[data-theme="dark"] .irb-search-input {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.15);
  color: inherit;
}
</style>
