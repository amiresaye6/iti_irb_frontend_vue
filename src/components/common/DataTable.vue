<template>
  <!--
    USAGE:
    <DataTable 
      :data="tableData" 
      :columns="[
        { key: 'id', label: 'رقم الطلب', sortable: true },
        { key: 'title', label: 'عنوان البحث', sortable: true },
        { key: 'researcher', label: 'الباحث الرئيسي', sortable: false },
        { key: 'status', label: 'المرحلة الحالية', sortable: true }
      ]"
      :loading="isLoading"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      :currentSortColumn="sortCol"
      :currentSortDirection="sortDir"
      @sort="handleSort"
      @page-change="handlePageChange"
    >
      <template #cell(status)="{ item }">
        <div class="badge badge-success gap-2">
          {{ item.status }}
        </div>
      </template>
    </DataTable>
  -->
  <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden transition-all hover:shadow-md flex flex-col w-full relative">
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-base-100/60 backdrop-blur-sm flex items-center justify-center z-10">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="block lg:hidden p-4 space-y-4">

      
      <div 
        v-for="(item, index) in data" 
        :key="index"
        class="bg-base-100 rounded-xl p-4 border border-base-200 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
      >
        <div class="flex flex-col gap-3">
          <div 
            v-for="col in columns" 
            :key="col.key"
            class="flex flex-col gap-2 border-b border-primary/20 pb-3 last:border-0 last:pb-0"
          >
            <span class="text-sm font-extrabold text-primary border-b-2 border-accent w-fit pb-0.5">{{ col.label }}</span>
            <div class="text-sm font-medium text-base-content flex flex-col gap-2">
              <slot :name="`cell(${col.key})`" :item="item">
                {{ item[col.key] }}
              </slot>
            </div>
          </div>
          
          <!-- Optional Mobile Row Actions -->
          <div v-if="hasRowActionsSlot" class="pt-3 mt-1 border-t border-base-200 flex flex-col gap-2">
            <slot name="row-actions" :item="item"></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block overflow-x-auto w-full">
      <table class="table w-full">
        <DataTableHeader 
          :columns="columns" 
          :currentSortColumn="currentSortColumn"
          :currentSortDirection="currentSortDirection"
          @sort="(payload) => $emit('sort', payload)"
        >
          <!-- Forward the header slot if needed for actions -->
          <template #default>
            <slot name="header-actions">
              <th v-if="hasRowActionsSlot" class="px-6 py-4 font-extrabold text-center border-b-[2px] border-primary w-24">الإجراءات</th>
            </slot>
          </template>
        </DataTableHeader>
        
        <tbody>

          <tr 
            v-for="(item, index) in data" 
            :key="index"
            class="hover bg-base-100 border-b border-base-200/60 transition-colors"
          >
            <td 
              v-for="col in columns" 
              :key="col.key"
              class="px-6 py-4"
              :class="col.class"
            >
              <slot :name="`cell(${col.key})`" :item="item">
                {{ item[col.key] }}
              </slot>
            </td>
            <!-- Actions slot for each row if needed -->
            <td v-if="hasRowActionsSlot" class="px-6 py-4">
              <slot name="row-actions" :item="item"></slot>
            </td>
          </tr>
          <!-- Empty state row -->
          <tr v-if="data.length === 0">
            <td :colspan="columns.length + (hasRowActionsSlot ? 1 : 0)" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-2 text-base-content/50">
                <i class="fa-solid fa-inbox text-4xl opacity-30"></i>
                <p class="font-bold text-[0.95rem]">{{ emptyMessage }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <DataTablePagination 
      v-if="totalPages > 0 || totalItems > 0"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      @page-change="(page) => $emit('page-change', page)"
    />
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import DataTableHeader from './DataTableHeader.vue'
import DataTablePagination from './DataTablePagination.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    default: 0
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  currentSortColumn: {
    type: String,
    default: ''
  },
  currentSortDirection: {
    type: String,
    default: ''
  },
  emptyMessage: {
    type: String,
    default: 'لا توجد بيانات'
  }
})

defineEmits(['sort', 'page-change'])

const slots = useSlots()
const hasHeaderActionsSlot = computed(() => !!slots['header-actions'])
const hasRowActionsSlot = computed(() => !!slots['row-actions'])
</script>
