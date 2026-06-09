<template>
  <div class="space-y-5 p-4 md:p-6">
    <!-- Page Header -->
    <div class="irb-page-header">
      <div>
        <h1 class="irb-page-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 irb-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          طلبات الإسناد المعلقة
        </h1>
        <p class="irb-page-subtitle">هذه الطلبات تنتظر ردك — اقبل لإضافة البحث لقائمة أعمالك، أو اعتذر مع ذكر السبب.</p>
      </div>
    </div>

    <!-- Flash Messages -->
    <transition name="fade">
      <div v-if="flashSuccess" class="irb-flash irb-flash-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ flashSuccess }}
      </div>
    </transition>
    <transition name="fade">
      <div v-if="flashError" class="irb-flash irb-flash-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {{ flashError }}
      </div>
    </transition>

    <!-- Search Toolbar -->
    <SearchBar
      v-model="searchQuery"
      title="البحث والتصفية"
      search-label="البحث السريع"
      placeholder="ابحث برقم الملف أو عنوان البحث أو القسم..."
      input-id="pendingSearchInput"
      @reset="searchQuery = ''"
    />

    <!-- Results Bar -->
    <div class="irb-results-bar">
      <span class="irb-results-chip">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {{ filteredAssignments.length }} طلب
      </span>
    </div>

    <!-- Data Card -->
    <div class="irb-data-card">
      <!-- Loading -->
      <div v-if="reviewStore.loading" class="irb-loading-state">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- Table -->
      <DataTable 
        v-else
        :data="paginatedAssignments"
        :columns="[
          { key: 'serial_number', label: 'رقم الملف', sortable: true },
          { key: 'research_data', label: 'بيانات البحث', sortable: false },
          { key: 'status', label: 'الحالة', sortable: false },
          { key: 'assigned_at', label: 'تاريخ الإسناد', sortable: true }
        ]"
        :current-sort-column="sortDir ? 'assigned_at' : ''"
        :current-sort-direction="sortDir"
        @sort="toggleSort"
        empty-message="لا توجد طلبات إسناد معلقة حالياً"
      >
        <template #cell(serial_number)="{ item, index }">
          <span class="text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm whitespace-nowrap shadow-sm border border-neutral-content/20" style="background-color: oklch(35% 0.02 245)">
            {{ item.serial_number || '—' }}
          </span>
          <div v-if="index === 0 && currentPage === 1" class="mt-2">
            <span class="inline-flex items-center gap-1 bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-xs font-bold animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              جديد
            </span>
          </div>
        </template>

        <template #cell(research_data)="{ item }">
          <div class="text-base-content font-bold text-[0.97rem] mb-1.5 leading-snug">{{ item.title }}</div>
          <div class="text-sm text-base-content/60 flex items-center gap-1.5 flex-wrap leading-snug">
            <template v-if="isRedacted(item)">
              <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md text-xs font-bold italic">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                هوية محجوبة
              </span>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ item.principal_investigator }}
            </template>
            <template v-if="item.department">
              <span class="text-slate-300">|</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {{ item.department }}
            </template>
          </div>
        </template>

        <template #cell(status)="{ item }">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#856404] bg-[#fff3cd] border border-[#ffeeba]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            بانتظار الرد
          </span>
        </template>

        <template #cell(assigned_at)="{ item }">
          <div class="flex flex-col gap-1">
            <span class="font-bold text-base-content text-[0.92rem]">{{ formatDate(item.assigned_at) }}</span>
            <small class="text-base-content/60 text-[0.78rem] flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatTime(item.assigned_at) }}
            </small>
          </div>
        </template>

        <template #row-actions="{ item }">
          <div class="flex items-center gap-2 flex-wrap">
            <button type="button" class="btn btn-sm btn-primary shrink-0 gap-1.5" @click="openAcceptModal(item.review_id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              قبول
            </button>
            <button type="button" class="btn btn-sm btn-outline btn-error shrink-0 gap-1.5" @click="openRefuseModal(item.review_id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              اعتذار
            </button>
          </div>
        </template>
      </DataTable>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="irb-pagination mt-4">
        <button
          class="irb-page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <span class="irb-page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="irb-page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ─── Accept Modal ──────────────────────────────────────────────────── -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showAcceptModal" class="irb-modal-overlay" @click.self="closeAcceptModal">
          <div class="irb-modal-box">
            <div class="irb-modal-icon irb-modal-icon--confirm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="irb-modal-title">تأكيد قبول الإسناد</h3>
            <p class="irb-modal-sub">هل تؤكد قبول مراجعة هذا البحث؟ سيضاف إلى قائمة أعمالك النشطة.</p>
            <div class="irb-modal-actions">
              <button type="button" class="irb-modal-btn irb-modal-btn--cancel" @click="closeAcceptModal" :disabled="isSubmitting">إلغاء</button>
              <button type="button" class="irb-modal-btn irb-modal-btn--confirm" @click="submitAccept" :disabled="isSubmitting">
                <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                نعم، أقبل الإسناد
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- ─── Refuse Modal ──────────────────────────────────────────────────── -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showRefuseModal" class="irb-modal-overlay" @click.self="closeRefuseModal">
          <div class="irb-modal-box">
            <div class="irb-modal-icon irb-modal-icon--refuse">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="irb-modal-title">الاعتذار عن المراجعة</h3>
            <p class="irb-modal-sub">يرجى ذكر سبب اعتذارك. سيُحفظ هذا للسجل الإداري.</p>
            <label class="irb-modal-label" for="refusalReasonInput">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              سبب الاعتذار (مطلوب)
            </label>
            <textarea
              id="refusalReasonInput"
              v-model="refusalReason"
              class="irb-modal-textarea"
              placeholder="تضارب مصالح، عبء عمل زائد، خارج التخصص..."
              rows="4"
            ></textarea>
            <div class="irb-modal-actions">
              <button type="button" class="irb-modal-btn irb-modal-btn--cancel" @click="closeRefuseModal" :disabled="isSubmitting">إلغاء</button>
              <button
                type="button"
                class="irb-modal-btn irb-modal-btn--refuse"
                @click="submitRefusal"
                :disabled="!refusalReason.trim() || isSubmitting"
              >
                <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                إرسال الاعتذار
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useReviewStore } from '@/store/reviews/index';
import SearchBar from '@/components/common/SearchBar.vue';
import DataTable from '@/components/common/DataTable.vue';

const reviewStore = useReviewStore();

// ── Search & Sort ─────────────────────────────────────────────────────────────
const searchQuery = ref('');
const sortDir = ref('desc');
const currentPage = ref(1);
const pageSize = 10;

const toggleSort = () => {
  sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc';
  currentPage.value = 1;
};

// Reset page on search
watch(searchQuery, () => { currentPage.value = 1; });

const filteredAssignments = computed(() => {
  let list = [...(reviewStore.pendingAssignments || [])];

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(a => {
      return (
        (a.serial_number || '').toLowerCase().includes(q) ||
        (a.title || '').toLowerCase().includes(q) ||
        (a.department || '').toLowerCase().includes(q) ||
        (a.principal_investigator || '').toLowerCase().includes(q)
      );
    });
  }

  // Sort by date
  list.sort((a, b) => {
    const da = new Date(a.assigned_at || 0);
    const db = new Date(b.assigned_at || 0);
    return sortDir.value === 'desc' ? db - da : da - db;
  });

  return list;
});

const totalPages = computed(() => Math.ceil(filteredAssignments.value.length / pageSize));

const paginatedAssignments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredAssignments.value.slice(start, start + pageSize);
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const isRedacted = (item) => {
  const name = item.principal_investigator || '';
  return name === 'معلومات محجوبة' || name === '';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  } catch { return dateStr; }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('ar-SA', {
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return ''; }
};

// ── Flash Messages ────────────────────────────────────────────────────────────
const flashSuccess = ref('');
const flashError = ref('');

const showFlash = (type, msg) => {
  if (type === 'success') {
    flashSuccess.value = msg;
    setTimeout(() => { flashSuccess.value = ''; }, 4000);
  } else {
    flashError.value = msg;
    setTimeout(() => { flashError.value = ''; }, 4000);
  }
};

// ── Modal State ───────────────────────────────────────────────────────────────
const showAcceptModal = ref(false);
const showRefuseModal = ref(false);
const selectedReviewId = ref(null);
const refusalReason = ref('');
const isSubmitting = ref(false);

const openAcceptModal = (id) => {
  selectedReviewId.value = id;
  showAcceptModal.value = true;
};

const closeAcceptModal = () => {
  showAcceptModal.value = false;
  selectedReviewId.value = null;
};

const openRefuseModal = (id) => {
  selectedReviewId.value = id;
  refusalReason.value = '';
  showRefuseModal.value = true;
  // Focus textarea after transition
  setTimeout(() => {
    document.getElementById('refusalReasonInput')?.focus();
  }, 150);
};

const closeRefuseModal = () => {
  showRefuseModal.value = false;
  selectedReviewId.value = null;
  refusalReason.value = '';
};

// Close on Escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    closeAcceptModal();
    closeRefuseModal();
  }
};

onMounted(() => {
  reviewStore.fetchPendingAssignments();
  document.addEventListener('keydown', handleKeydown);
});

// ── Actions ───────────────────────────────────────────────────────────────────
const submitAccept = async () => {
  if (!selectedReviewId.value || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const result = await reviewStore.acceptAssignment(selectedReviewId.value);
    closeAcceptModal();
    if (result?.success !== false) {
      showFlash('success', 'تم قبول الإسناد بنجاح. تمت إضافة البحث لقائمة أعمالك.');
    } else {
      showFlash('error', result?.message || 'حدث خطأ أثناء القبول.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const submitRefusal = async () => {
  if (!refusalReason.value.trim() || !selectedReviewId.value || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const result = await reviewStore.refuseAssignment(selectedReviewId.value, refusalReason.value);
    closeRefuseModal();
    if (result?.success !== false) {
      showFlash('success', 'تم إرسال اعتذارك بنجاح.');
    } else {
      showFlash('error', result?.message || 'حدث خطأ أثناء الإرسال.');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* ─── Page Header ────────────────────────────────────────────────────────── */
.irb-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 2px solid oklch(var(--p) / 0.15);
}

.irb-page-title {

  font-weight: 800;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 6px 0;
}

.irb-title-icon {
  color: #f59e0b;
}

.irb-page-subtitle {
  color: oklch(var(--bc) / 0.6);
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}

/* ─── Flash Messages ─────────────────────────────────────────────────────── */
.irb-flash {
  padding: 12px 18px;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.irb-flash-success { background: #d1fae5; color: #065f46; border: 1.5px solid #6ee7b7; }
.irb-flash-error   { background: #fee2e2; color: #991b1b; border: 1.5px solid #fca5a5; }

/* ─── Results Bar ────────────────────────────────────────────────────────── */
.irb-results-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.irb-results-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: oklch(var(--p) / 0.1);
 color: oklch(var(--p));
  font-weight: 700;
  font-size: 0.85rem;
}

/* ─── Data Card ─────────────────────────────────────────────────────────── */
.irb-data-card {
  background: var(--b1, #fff);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  border: 1px solid oklch(var(--b3, 89.824% 0.00952 262.71));
  overflow: hidden;
}

.irb-loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

/* ─── Cells ─────────────────────────────────────────────────────────────── */
.irb-badge-serial {
  display: inline-block;
  background: oklch(var(--p) / 0.12);
  color: oklch(var(--p));
  font-weight: 800;
  font-size: 0.82rem;
  padding: 5px 12px;
  border-radius: 6px;
  white-space: nowrap;
}

.irb-new-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
  margin-top: 5px;
}

.irb-app-title {
  font-weight: 800;
  color: var(--bc, #1f2937);
  font-size: 0.95rem;
  margin-bottom: 5px;
  line-height: 1.4;
}

.irb-app-meta {
  font-size: 0.8rem;
  color: oklch(var(--bc) / 0.6);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 3px;
}

.irb-redacted-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
}

.irb-date-cell { display: flex; flex-direction: column; gap: 3px; }
.irb-date-main { font-weight: 700; color: var(--bc, #1f2937); font-size: 0.9rem; }
.irb-date-time {
  font-size: 0.78rem;
  color: oklch(var(--bc) / 0.55);
  display: flex;
  align-items: center;
  gap: 4px;
}

.irb-status-awaiting {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ─── Action Buttons ─────────────────────────────────────────────────────── */
.irb-actions-wrap { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

.irb-btn-accept {
  background: linear-gradient(135deg, oklch(var(--p)), var(--a, oklch(74.51% 0.167 183.61)));
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-family: inherit;
  font-weight: 800;
  font-size: 0.83rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.irb-btn-accept:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(26,188,156,0.35);
}

.irb-btn-refuse {
  background: #fff;
  color: #dc2626;
  border: 1.5px solid #fca5a5;
  border-radius: 10px;
  padding: 7px 14px;
  font-family: inherit;
  font-weight: 800;
  font-size: 0.83rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.irb-btn-refuse:hover:not(:disabled) {
  background: #fee2e2;
  transform: translateY(-1px);
}

/* ─── Empty State ────────────────────────────────────────────────────────── */
.irb-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: oklch(var(--bc) / 0.5);
}

.irb-empty-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 14px;
  opacity: 0.35;
}

.irb-empty-state h3 {
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--bc, #1f2937);
  margin-bottom: 6px;
}

/* ─── Pagination ─────────────────────────────────────────────────────────── */
.irb-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid oklch(var(--b3, 89.824% 0.00952 262.71));
}

.irb-page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid oklch(var(--b3, 89.824% 0.00952 262.71));
  background: var(--b1, #fff);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--bc, #1f2937);
}

.irb-page-btn:hover:not(:disabled) {
  background: oklch(var(--p) / 0.1);
  border-color: oklch(var(--p));
  color: oklch(var(--p));
}

.irb-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.irb-page-info {
  font-weight: 700;
  font-size: 0.9rem;
  color: oklch(var(--p));
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
.irb-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.irb-modal-box {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  position: relative;
  text-align: center;
}

.irb-modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.irb-modal-icon--confirm { background: #d1fae5; color: #059669; }
.irb-modal-icon--refuse  { background: #fee2e2; color: #dc2626; }

.irb-modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.irb-modal-sub {
  font-size: 0.88rem;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.irb-modal-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #dc2626;
  margin-bottom: 8px;
  text-align: right;
}

.irb-modal-textarea {
  width: 100%;
  border: 1.5px solid #fca5a5;
  border-radius: 10px;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
  resize: vertical;
  min-height: 100px;
  outline: none;
  background: #fff9f9;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  text-align: right;
}

.irb-modal-textarea:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
}

.irb-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.irb-modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-family: inherit;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.irb-modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.irb-modal-btn--cancel {
  flex: 0 0 auto;
  background: #f1f5f9;
  color: #334155;
  padding: 12px 20px;
}

.irb-modal-btn--cancel:hover:not(:disabled) { background: #e2e8f0; }

.irb-modal-btn--confirm {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.irb-modal-btn--confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16,185,129,0.35);
}

.irb-modal-btn--refuse {
  background: #dc2626;
  color: white;
}

.irb-modal-btn--refuse:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(220,38,38,0.35);
}

/* ─── Transitions ────────────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-enter-active { transition: all 0.25s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from   { opacity: 0; }
.modal-enter-from .irb-modal-box { transform: scale(0.94) translateY(-12px); }
.modal-leave-to     { opacity: 0; }
.modal-leave-to .irb-modal-box   { transform: scale(0.96) translateY(-8px); }

/* ─── Mobile Cards ───────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .irb-actions-wrap { flex-direction: column; width: 100%; gap: 8px; }
  .irb-btn-accept, .irb-btn-refuse { width: 100%; justify-content: center; }
  .irb-page-title { font-size: 1.3rem; }
}
</style>
