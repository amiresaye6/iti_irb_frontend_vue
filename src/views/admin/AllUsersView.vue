<script setup>
import { ref, computed, onMounted } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import FilterDock from '@/components/common/FilterDock.vue';
import DataTable  from '@/components/common/DataTable.vue';
import { getAllUsers, deleteUser } from '@/services/authService';

const userRole = ref('');
const allUsers     = ref([]);
const isLoading    = ref(false);
const errorMessage = ref(null);
const setLoading   = (v)   => (isLoading.value = v);
const setError     = (err) => (errorMessage.value = err ? (err.message || err) : null);

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
        placeholder: 'ابحث بالاسم أو البريد...',
    },
    {
        key: 'role',
        type: 'select',
        label: 'الدور',
        options: [
            { label: 'كل الأدوار',  value: ''         },
            { label: 'باحث',        value: 'student'  },
            { label: 'مراجع',       value: 'reviewer' },
            { label: 'مدير',        value: 'manager'  },
            { label: 'مسؤول',       value: 'admin'    },
        ],
    },
    {
        key: 'status',
        type: 'select',
        label: 'الحالة',
        options: [
            { label: 'الكل',        value: ''      },
            { label: 'مفعّل',       value: 'true'  },
            { label: 'غير مفعّل',   value: 'false' },
        ],
    },
];

const handleFilterChange = (filters) => {
    activeFilters.value = filters;
    currentPage.value   = 1;
};

const displayedUsers = computed(() => {
    let list = [...allUsers.value];

    if (activeFilters.value.search) {
        const q = activeFilters.value.search.toLowerCase();
        list = list.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    }
    if (activeFilters.value.role) {
        list = list.filter(u => u.role === activeFilters.value.role);
    }
    if (activeFilters.value.status !== undefined && activeFilters.value.status !== '') {
        const active = activeFilters.value.status === 'true';
        list = list.filter(u => u.is_active === active);
    }

    if (sortCol.value) {
        list.sort((a, b) => {
            const cmp = String(a[sortCol.value] ?? '').localeCompare(String(b[sortCol.value] ?? ''), 'ar');
            return sortDir.value === 'desc' ? -cmp : cmp;
        });
    }

    return list;
});

const currentPage  = ref(1);
const itemsPerPage = ref(10);
const totalItems   = computed(() => displayedUsers.value.length);
const totalPages   = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return displayedUsers.value.slice(start, start + itemsPerPage.value);
});
const handlePageChange = (page) => (currentPage.value = page);

const columns = [
    { key: 'full_name',      label: 'الاسم',              sortable: true  },
    { key: 'email',     label: 'البريد الإلكتروني',   sortable: true  },
    { key: 'role',      label: 'الدور',               sortable: true  },
    { key: 'faculty',   label: 'الكلية',              sortable: true  },
    { key: 'is_active', label: 'الحالة',              sortable: true  },
];

const ROLE_MAP = {
    student:  { label: 'باحث',   class: 'badge-info'    },
    reviewer: { label: 'مراجع',  class: 'badge-warning' },
    manager:  { label: 'مدير',   class: 'badge-accent'  },
    admin:    { label: 'مسؤول',  class: 'badge-neutral' },
};

const fetchUsers = async () => {
    const res = await getAllUsers({ setLoading, setError });
    if (res) allUsers.value = Array.isArray(res) ? res : (res.data ?? []);
};
// onMounted(fetchUsers);
onMounted(async () => {
    await fetchUsers();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    userRole.value = user?.role || '';
});

const actionLoadingId = ref(null);
const handleDelete = async (user) => {
    if (userRole.value === 'super_admin') return;
    if (!confirm(`هل أنت متأكد من حذف حساب "${user.name}"؟`)) return;
    actionLoadingId.value = user.id;
    const res = await deleteUser({ id: user.id, setLoading: () => {}, setError });
    if (res !== null) allUsers.value = allUsers.value.filter(u => u.id !== user.id);
    actionLoadingId.value = null;
};
</script>

<template>
    <div class="p-4 md:p-6 space-y-2">

        <PageHeader
            title="جميع مستخدمي المنظومة"
            note="عرض شامل لجميع الحسابات مع إمكانية البحث والتصفية والحذف"
        >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </template>

            <!-- <template #actions>
                <div class="flex items-center gap-2">
                    <div class="badge badge-primary badge-lg font-semibold">
                        {{ totalItems }} مستخدم
                    </div>
                    <button class="btn btn-sm btn-ghost btn-circle"
                        :disabled="isLoading" @click="fetchUsers">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <RouterLink to="/admin/add-staff" class="btn btn-sm btn-primary gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4v16m8-8H4" />
                        </svg>
                        إضافة موظف
                    </RouterLink>
                </div>
            </template> -->
            <template #actions>
    <div class="flex items-center gap-2">
        <div class="badge badge-primary badge-lg font-semibold">
            {{ totalItems }} مستخدم
        </div>
        <button class="btn btn-sm btn-ghost btn-circle"
            :disabled="isLoading" @click="fetchUsers">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </button>
        
        <RouterLink v-if="userRole !== 'super_admin'" to="/admin/add-staff" class="btn btn-sm btn-primary gap-1">
            <svg xmlns="http://www.w3.org/2000/xl" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            إضافة موظف
        </RouterLink>
    </div>
</template>
        </PageHeader>

        <!-- Error -->
        <div v-if="errorMessage" role="alert"
            class="flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <FilterDock :config="filterConfig" @filter="handleFilterChange" />

        <DataTable
            :data="paginatedUsers"
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
            <!-- Role badge -->
            <template #cell(role)="{ item }">
                <span class="badge badge-sm font-medium"
                    :class="ROLE_MAP[item.role]?.class ?? 'badge-ghost'">
                    {{ ROLE_MAP[item.role]?.label ?? item.role }}
                </span>
            </template>

            <!-- Status badge -->
            <template #cell(is_active)="{ item }">
                <span class="badge badge-sm font-medium"
                    :class="item.is_active ? 'badge-success' : 'badge-warning'">
                    {{ item.is_active ? 'مفعّل' : 'معلّق' }}
                </span>
            </template>

            <!-- Row actions -->
            <!-- <template #row-actions="{ item }">
                <button
                    class="btn btn-xs btn-error btn-outline gap-1"
                    :disabled="actionLoadingId === item.id"
                    @click="handleDelete(item)"
                >
                    <span v-if="actionLoadingId === item.id"
                        class="loading loading-spinner loading-xs"></span>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    حذف
                </button>
            </template> -->
            <template #row-actions="{ item }">
    <span v-if="userRole === 'super_admin'" class="text-xs text-base-content/40 font-medium">
        معاينة فقط
    </span>

    <button v-else
        class="btn btn-xs btn-error btn-outline gap-1"
        :disabled="actionLoadingId === item.id"
        @click="handleDelete(item)"
    >
        <span v-if="actionLoadingId === item.id" class="loading loading-spinner loading-xs"></span>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        حذف
    </button>
</template>
        </DataTable>

    </div>
</template>