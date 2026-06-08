<script setup>
import { ref, computed, onMounted } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import FilterDock from '@/components/common/FilterDock.vue';
import DataTable  from '@/components/common/DataTable.vue';
import { getPendingUsers, activateUser, deleteUser } from '@/services/authService';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const allStudents   = ref([]);
const isLoading     = ref(false);
const errorMessage  = ref(null);
const userRole = ref('');

const setLoading = (val) => (isLoading.value = val);
const setError   = (err) => (errorMessage.value = err ? (err.message || err) : null);

const sortCol = ref('');
const sortDir = ref('');

const handleSort = ({ column, direction }) => {
    sortCol.value = column;
    sortDir.value = direction;
};

const activeFilters = ref({});

const filterConfig = [
    {
        key: 'search',
        type: 'text',
        label: 'بحث سريع',
        placeholder: 'ابحث بالاسم أو البريد الإلكتروني...',
    },
];

const handleFilterChange = (filters) => {
    activeFilters.value = filters;
};

const displayedStudents = computed(() => {
    let list = [...allStudents.value];

    if (activeFilters.value.search) {
        const q = activeFilters.value.search.toLowerCase();
        list = list.filter(s =>
            s.name?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q)
        );
    }

    if (activeFilters.value.faculty) {
        list = list.filter(s => s.faculty === activeFilters.value.faculty);
    }

    if (sortCol.value) {
        list.sort((a, b) => {
            const valA = a[sortCol.value] ?? '';
            const valB = b[sortCol.value] ?? '';
            const cmp  = String(valA).localeCompare(String(valB), 'ar');
            return sortDir.value === 'desc' ? -cmp : cmp;
        });
    }

    return list;
});

const currentPage  = ref(1);
const itemsPerPage = ref(10);

const totalItems = computed(() => displayedStudents.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return displayedStudents.value.slice(start, start + itemsPerPage.value);
});

const handlePageChange = (page) => (currentPage.value = page);

const columns = [
    { key: 'full_name',       label: 'الاسم الكامل',      sortable: true  },
    { key: 'email',      label: 'البريد الإلكتروني',  sortable: true  },
    { key: 'faculty',    label: 'الكلية',             sortable: true  },
    { key: 'department', label: 'القسم',              sortable: false },
    { key: 'phone_number',      label: 'رقم الهاتف',         sortable: false },
    { key: 'id_docs',    label: 'وثائق الهوية',        sortable: false },
];

const fetchStudents = async () => {
    const res = await getPendingUsers({ setLoading, setError });
    if (res) {
        allStudents.value = Array.isArray(res) ? res : (res.data ?? []);
    }
};

onMounted(async () => {
    await fetchStudents();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    userRole.value = user?.role || '';
});

const previewStudent = ref(null);
const showPreview    = ref(false);

const openPreview = (student) => {
    previewStudent.value = student;
    showPreview.value    = true;
};
const closePreview = () => (showPreview.value = false);

const actionLoadingId = ref(null);

const handleActivate = async (student) => {
    if (userRole.value === 'super_admin') return;
    actionLoadingId.value = student.id;
    const res = await activateUser({
        id: student.id,
        setLoading: () => {},
        setError,
    });
    if (res !== null) {
        allStudents.value = allStudents.value.filter(s => s.id !== student.id);
        closePreview();
    }
    actionLoadingId.value = null;
};

const handleDelete = async (student) => {
    if (userRole.value === 'super_admin') return;
    if (!confirm(`هل أنت متأكد من حذف حساب ؟`)) return;
    actionLoadingId.value = student.id;
    const res = await deleteUser({
        id: student.id,
        setLoading: () => {},
        setError,
    });
    if (res !== null) {
        allStudents.value = allStudents.value.filter(s => s.id !== student.id);
        closePreview();
    }
    actionLoadingId.value = null;
};
</script>

<template>
    <div class="p-4 md:p-6 space-y-2">

        <!-- Page Header -->
        <PageHeader
            title="طلبات التفعيل المعلّقة"
            note="راجع وثائق الهوية وفعّل حسابات الباحثين الجدد أو احذفها"
        >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </template>

            <template #actions>
                <div class="flex items-center gap-2">
                    <div class="badge badge-warning badge-lg gap-1 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ totalItems }} طلب معلّق
                    </div>
                    <button class="btn btn-sm btn-ghost btn-circle" :disabled="isLoading" @click="fetchStudents">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </template>
        </PageHeader>

        <!-- Error Alert -->
        <div
            v-if="errorMessage"
            role="alert"
            class="flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm mb-4"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <!-- Filter Dock -->
        <FilterDock :config="filterConfig" @filter="handleFilterChange" />

        <!-- Data Table -->
        <DataTable
            :data="paginatedStudents"
            :columns="columns"
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
            <!-- ID Docs cell -->
            <template #cell(id_docs)="{ item }">
                <button
                    class="btn btn-xs btn-outline btn-primary gap-1"
                    @click="openPreview(item)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    عرض الهوية
                </button>
            </template>

            <!-- Row actions -->
            <!-- <template #row-actions="{ item }">
                <div class="flex items-center gap-2">
                    <button
                        class="btn btn-xs btn-success gap-1"
                        :disabled="actionLoadingId === item.id"
                        @click="handleActivate(item)"
                    >
                        <span v-if="actionLoadingId === item.id" class="loading loading-spinner loading-xs"></span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 13l4 4L19 7" />
                        </svg>
                        تفعيل
                    </button>
                    <button
                        class="btn btn-xs btn-error btn-outline gap-1"
                        :disabled="actionLoadingId === item.id"
                        @click="handleDelete(item)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        حذف
                    </button>
                </div>
            </template> -->
            <template #row-actions="{ item }">
    <span v-if="userRole === 'super_admin'" class="text-xs text-base-content/40 font-medium px-2">
        وضع المعاينة
    </span>

    <div v-else class="flex items-center gap-2">
        <button
            class="btn btn-xs btn-success gap-1"
            :disabled="actionLoadingId === item.id"
            @click="handleActivate(item)"
        >
            <span v-if="actionLoadingId === item.id" class="loading loading-spinner loading-xs"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            تفعيل
        </button>
        <button
            class="btn btn-xs btn-error btn-outline gap-1"
            :disabled="actionLoadingId === item.id"
            @click="handleDelete(item)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            حذف
        </button>
    </div>
</template>
        </DataTable>

        <!-- ── ID Preview Modal ─────────────────────────── -->
        <Teleport to="body">
            <div
                v-if="showPreview"
                class="fixed inset-0 z-50 flex items-center justify-center p-4"
                @click.self="closePreview"
            >
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-neutral/60 backdrop-blur-sm"></div>

                <!-- Modal Card -->
                <div class="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">

                    <!-- Modal Header -->
                    <div class="flex items-center justify-between p-6 border-b border-base-200/60">
                        <div>
                            <h2 class="text-lg font-bold text-base-content">مراجعة وثائق الهوية</h2>
                            <p class="text-sm text-base-content/50 mt-0.5">{{ previewStudent?.name }}</p>
                        </div>
                        <button class="btn btn-sm btn-ghost btn-circle" @click="closePreview">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Student Info -->
                    <div class="p-6 grid grid-cols-2 gap-4 border-b border-base-200/60">
                        <div v-for="field in [
                            { label: 'البريد الإلكتروني', value: previewStudent?.email },
                            { label: 'رقم الهاتف',        value: previewStudent?.phone_number },
                            { label: 'الكلية',            value: previewStudent?.faculty },
                            { label: 'القسم',             value: previewStudent?.department },
                        ]" :key="field.label" class="flex flex-col gap-1">
                            <span class="text-xs text-base-content/40 font-semibold">{{ field.label }}</span>
                            <span class="text-sm text-base-content font-medium">{{ field.value ?? '—' }}</span>
                        </div>
                    </div>

                    <!-- ID Images -->
                    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-base-200/60">
                        <div v-for="doc in [
                            { label: 'الهوية — الوجه الأمامي', url: IMAGE_BASE_URL + previewStudent?.id_front_url },
                            { label: 'الهوية — الوجه الخلفي',  url: IMAGE_BASE_URL +previewStudent?.id_back_url  },
                        ]" :key="doc.label" class="flex flex-col gap-2">
                            <span class="text-xs font-semibold text-base-content/50">{{ doc.label }}</span>
                            <div class="rounded-xl overflow-hidden border border-base-200/60 bg-base-200/40 aspect-video flex items-center justify-center">
                                <img
                                    v-if="doc.url"
                                    :src="doc.url"
                                    :alt="doc.label"
                                    class="w-full h-full object-cover"
                                />
                                <span v-else class="text-xs text-base-content/30">لا توجد صورة</span>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Actions -->
                    <!-- <div class="p-6 flex items-center justify-end gap-3">
                        <button class="btn btn-ghost" @click="closePreview">إلغاء</button>
                        <button
                            class="btn btn-error btn-outline gap-2"
                            :disabled="actionLoadingId === previewStudent?.id"
                            @click="handleDelete(previewStudent)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            حذف الحساب
                        </button>
                        <button
                            class="btn btn-success gap-2"
                            :disabled="actionLoadingId === previewStudent?.id"
                            @click="handleActivate(previewStudent)"
                        >
                            <span v-if="actionLoadingId === previewStudent?.id" class="loading loading-spinner loading-sm"></span>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            تفعيل الحساب
                        </button>
                    </div> -->
                    <div class="p-6 flex items-center justify-end gap-3">
                        <button v-if="userRole === 'super_admin'" class="btn btn-primary btn-sm rounded-xl px-6" @click="closePreview">
                            إغلاق المعاينة
                        </button>

                        <template v-else>
                            <button class="btn btn-ghost" @click="closePreview">إلغاء</button>
                            <button
                                class="btn btn-error btn-outline gap-2"
                                :disabled="actionLoadingId === previewStudent?.id"
                                @click="handleDelete(previewStudent)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                حذف الحساب
                            </button>
                            <button
                                class="btn btn-success gap-2"
                                :disabled="actionLoadingId === previewStudent?.id"
                                @click="handleActivate(previewStudent)"
                            >
                                <span v-if="actionLoadingId === previewStudent?.id" class="loading loading-spinner loading-sm"></span>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                تفعيل الحساب
                            </button>
                        </template>
                    </div>

                </div>
            </div>
        </Teleport>

    </div>
</template>