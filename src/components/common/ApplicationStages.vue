<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentStage: { type: String, required: true }
})

const allStages = [
  { id: 'pending_admin',    label: 'مراجعة أولية',     icon: 'M9 12h.01M15 12h.01M3 7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { id: 'under_review',     label: 'قيد المراجعة',     icon: 'M21 21l-4-4m0 0A7 7 0 1117 17zM11 8v3l2 2' },
  { id: 'final_review',     label: 'المراجعة النهائية', icon: 'M9 12l2 2 4-4M5 12a7 7 0 1114 0 7 7 0 01-14 0z' },
  { id: 'awaiting_payment', label: 'انتظار الدفع',     icon: 'M2 6h20v13a3 3 0 01-3 3H5a3 3 0 01-3-3V6zM2 11h20M6 15h3' },
  { id: 'approved',         label: 'مقبول',            icon: 'M5 13l4 4L19 7' },
  { id: 'rejected',         label: 'مرفوض',            icon: 'M18 6L6 18M6 6l12 12' },
]

const CHECK_ICON = 'M5 13l4 4L19 7'

const isRejected = computed(() => props.currentStage === 'rejected')

const visibleStages = computed(() =>
  isRejected.value
    ? [...allStages.slice(0, 4), allStages[5]]
    : allStages.slice(0, 5)
)

const currentIdx = computed(() =>
  visibleStages.value.findIndex(s => s.id === props.currentStage)
)

const getState = (idx) => {
  const stage = visibleStages.value[idx]
  if (stage.id === props.currentStage) return isRejected.value ? 'rejected' : 'current'
  if (idx < currentIdx.value) return 'done'
  return 'idle'
}

const connectorWidth = (idx) => {
  if (idx < currentIdx.value - 1) return '100%'
  if (idx === currentIdx.value - 1) return '60%'
  return '0%'
}
</script>

<template>
  <div dir="rtl" class="bg-white rounded-2xl border border-base-200 shadow-sm p-6">

    <!-- Header -->
    <div class="flex items-center gap-2 mb-7 pb-4 border-b border-base-200">
      <div class="w-8 h-8 rounded-full bg-base-200 border border-base-300 flex items-center justify-center">
        <svg class="w-4 h-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="text-sm font-medium text-base-content">مسار العمل والتقدم</span>
    </div>

    <!-- Steps row -->
    <div class="flex items-center w-full">

      <template v-for="(stage, idx) in visibleStages" :key="stage.id">

        <!-- Step -->
        <div class="flex flex-col items-center gap-2.5" style="flex: 0 0 auto; width: 72px;">

          <!-- Circle -->
          <div
            class="w-13 h-13 rounded-full flex items-center justify-center border-2 transition-all duration-300"
            :class="{
              'bg-emerald-50   border-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.15)]': getState(idx) === 'current',
              'bg-emerald-500  border-emerald-500':  getState(idx) === 'current',
              'bg-emerald-50   border-emerald-400':  getState(idx) === 'done',
              'bg-red-50       border-red-400':      getState(idx) === 'rejected',
              'bg-base-200     border-base-300':     getState(idx) === 'idle',
            }"
            style="width: 52px; height: 52px;"
          >
            <svg
              class="w-5 h-5 transition-colors"
              :class="{
                'text-white':          getState(idx) === 'current',
                'text-emerald-600':    getState(idx) === 'done',
                'text-red-500':        getState(idx) === 'rejected',
                'text-base-content/30': getState(idx) === 'idle',
              }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            >
              <path :d="getState(idx) === 'done' ? CHECK_ICON : stage.icon" />
            </svg>
          </div>

          <!-- Label -->
          <span
            class="text-xs text-center leading-snug transition-colors"
            style="max-width: 70px;"
            :class="{
              'text-emerald-600 font-semibold': getState(idx) === 'current',
              'text-emerald-600 font-medium':   getState(idx) === 'done',
              'text-red-500 font-medium':        getState(idx) === 'rejected',
              'text-base-content/40':            getState(idx) === 'idle',
            }"
          >{{ stage.label }}</span>
        </div>

        <!-- Connector line -->
        <div
          v-if="idx < visibleStages.length - 1"
          class="flex-1 h-0.5 rounded-full bg-base-300 overflow-hidden"
          style="position: relative; top: -11px;"
        >
          <div
            class="h-full rounded-full bg-emerald-400 transition-all duration-500"
            :style="{ width: connectorWidth(idx) }"
          />
        </div>

      </template>
    </div>
  </div>
</template>