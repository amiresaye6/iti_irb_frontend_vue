<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { applicationServices } from '@/services/applicationServices.js'

const Base_url = import.meta.env.VITE_BACKEND_SERVER;
const appServices = applicationServices();
const route = useRoute();
const router = useRouter();

const application  = ref(null);
const docs         = ref([]);
const isLoading    = ref(false);
const errorMessage = ref(null);

const newFiles      = ref({});  
const fileErrors    = ref({});   
const fileInputRefs = ref({});  

const setLoading = (val) => isLoading.value = val;
const setError   = (err) => errorMessage.value = err?.message || err;

// ─── Validation constants
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_DEFAULT = 3  * 1024 * 1024;  
const MAX_SIZE_LAST    = 15 * 1024 * 1024; 

const isLastDoc = (doc) => docs.value.at(-1)?.id === doc.id;

const validateFile = (file, isLast = false) => {
    const ext      = '.' + file.name.split('.').pop().toLowerCase();
    const validExt = ALLOWED_EXTENSIONS.includes(ext);
    const validMime = file.type === '' || ALLOWED_MIME_TYPES.includes(file.type);

    if (!validExt || !validMime) {
        return 'صيغة غير مدعومة — يُسمح فقط بـ PDF أو Word (.pdf, .doc, .docx)';
    }

    const maxSize = isLast ? MAX_SIZE_LAST : MAX_SIZE_DEFAULT;
    if (file.size > maxSize) {
        const limitMB  = isLast ? 15 : 3;
        const actualMB = (file.size / (1024 * 1024)).toFixed(1);
        return `حجم الملف (${actualMB} MB) يتجاوز الحد المسموح (${limitMB} MB)`;
    }

    return null; 
};

const shortFileName = (name) => name.length > 30 ? name.slice(0, 27) + '…' : name;

// ─── Fetch
const fetchApplication = async () => {
    const data = await appServices.getAppById(route.params.id, setLoading, setError);
    if (data) application.value = data;
    console.log(application.value.serial_number);
};

const fetchDocuments = async () => {
    const data = await appServices.getDocsByAppId(route.params.id, setLoading, setError);
    if (data) docs.value = data;
};

onMounted(() => {
    fetchApplication();
    fetchDocuments();
});

// ─── File handling
const triggerFileInput = (docId) => fileInputRefs.value[docId]?.click();

const handleFileSelect = (doc, event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; 
    if (!file) return;

    const error = validateFile(file, isLastDoc(doc));

    if (error) {
        fileErrors.value = { ...fileErrors.value, [doc.id]: error };
        return;
    }

    const updatedErrors = { ...fileErrors.value };
    delete updatedErrors[doc.id];

    fileErrors.value = updatedErrors;
    newFiles.value   = { ...newFiles.value, [doc.id]: file };
};

const removeNewFile = (docId) => {
    const files  = { ...newFiles.value };
    const errors = { ...fileErrors.value };
    delete files[docId];
    delete errors[docId];
    newFiles.value   = files;
    fileErrors.value = errors;
};

// ─── Submit 
const editApplication = async () => {
    const freshErrors = {};
    let hasError = false;

    Object.entries(newFiles.value).forEach(([docId, file]) => {
        const doc   = docs.value.find(d => String(d.id) === String(docId));
        const error = validateFile(file, isLastDoc(doc));
        if (error) {
            freshErrors[docId] = error;
            hasError = true;
        }
    });

    if (hasError) {
        fileErrors.value = { ...fileErrors.value, ...freshErrors };
        return;
    }

    const formData = new FormData();

    formData.append('_method', 'PATCH'); 

    Object.entries(newFiles.value).forEach(([docId, file]) => {
        const doc = docs.value.find(d => String(d.id) === String(docId));
        if (doc) {
            formData.append(doc.document_type, file);
        }
    });

    const data = await appServices.patchAppById(
        route.params.id,
        formData,       
        setLoading,
        setError
    );

    if (data) {
        application.value = data;
        newFiles.value    = {};
        fileErrors.value  = {};
        router.push({
            path: '/student/accept-modification',
            state: {
                fromSubmission: true,
            }
        });
    }
};

// ─── Translations
const documentTranslations = {
    protocol_review_app:                   'طلب مراجعة بروتوكول بحثى',
    oral_presentaion:                       'العرض التقديمى الشفهى للبروتوكول البحثى',
    pi_consent:                             'اقرار الباحث الرئيسى',
    research_procedures_approval:           'نموذج قرار الموافقة على الاجراءات البحثية',
    conflict_of_interest:                   'نموذج عدم تعارض المصالح',
    patient_consent:                        'نموذج الموافقة المستنيرة للمريض',
    research_alignment_with_research_plan:  'نموذج تقرير توافق الابحاث مع الخطة البحثية',
    research_protocol:                      'البروتوكول البحثى',
};

const stageTranslations = {
    'pending_admin':    'في انتظار الإدارة',
    'under_review':     'قيد المراجعة',
    'final_review':     'المراجعة النهائية',
    'awaiting_payment': 'في انتظار الدفع',
    'approved':         'مقبول',
    'rejected':         'مرفوض',
};

const docIconColors = {
    protocol_review_app:                   'background-color:#D500F9;color:#fff',
    oral_presentaion:                      'background-color:#FF6D00;color:#fff',
    pi_consent:                            'background-color:#00E5FF;color:#000',
    research_procedures_approval:          'background-color:#00E676;color:#000',
    conflict_of_interest:                  'background-color:#FF1744;color:#fff',
    patient_consent:                       'background-color:#F50057;color:#fff',
    research_alignment_with_research_plan: 'background-color:#2979FF;color:#fff',
    research_protocol:                     'background-color:#FFEA00;color:#000',
};

const getDocumentName = (t) => documentTranslations[t] || t;
const getStageName    = (s) => stageTranslations[s]    || s;
const getIconStyle    = (t) => docIconColors[t]        || 'background-color:#111827;color:#fff';
</script>

<template>
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-8 w-full font-sans">

        <!-- Loading -->
        <div v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-base-100 rounded-2xl border border-base-200/60 shadow-sm">
            <span class="loading loading-spinner loading-lg text-primary mb-4"></span>
            <span class="text-lg font-medium text-base-content/70">جاري تحميل البيانات...</span>
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="alert alert-error shadow-sm rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <div v-else-if="application" class="space-y-8">

            <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden">
                <div class="px-6 py-5 border-b border-base-200/60 flex flex-wrap gap-4 items-center justify-between bg-base-50/50">
                    <h2 class="text-lg font-bold text-base-content flex items-center gap-2">
                        البيانات الأساسية
                        <span class="badge badge-ghost text-xs opacity-60">للعرض فقط</span>
                    </h2>
                    <div class="badge badge-primary px-4 py-3 text-sm font-medium shadow-sm">
                        {{ getStageName(application.current_stage) }}
                    </div>
                </div>

                <div class="p-6 sm:p-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-2 border-r-4 border-primary/20 pr-4">
                            <span class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">رقم البحث</span>
                            <p class="text-xl font-bold text-base-content">{{ application.serial_number || '---' }}</p>
                        </div>
                        <div class="space-y-2 border-r-4 border-primary/20 pr-4">
                            <span class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">الباحث الرئيسي</span>
                            <p class="text-xl font-bold text-base-content">{{ application.principal_investigator || '---' }}</p>
                        </div>
                        <div class="md:col-span-2 space-y-2 border-r-4 border-primary/20 pr-4 bg-base-200/20 p-4 rounded-xl">
                            <span class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">عنوان البحث</span>
                            <p class="text-lg font-medium text-base-content leading-relaxed">{{ application.title || '---' }}</p>
                        </div>
                        <div class="md:col-span-2 space-y-2 border-r-4 border-primary/20 pr-4">
                            <span class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">الباحثون المشاركون</span>
                            <p class="text-base font-medium text-base-content/80 leading-relaxed">
                                {{ application.co_investigators || 'لا يوجد باحثون مشاركون' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden">
                <div class="px-6 py-5 border-b border-base-200/60 bg-base-50/50 flex flex-wrap items-center gap-3">
                    <h2 class="text-lg font-bold text-base-content">المستندات المرفقة</h2>
                    <span v-if="docs.length > 0" class="badge badge-neutral text-xs opacity-70">{{ docs.length }}</span>

                    <span v-if="Object.keys(newFiles).length > 0"
                        class="badge badge-warning text-xs font-bold gap-1 mr-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {{ Object.keys(newFiles).length }} ملف جديد معلق
                    </span>

                    <span class="text-xs text-base-content/40 mr-auto flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        pdf / doc / docx &nbsp;·&nbsp; 3 MB لكل ملف &nbsp;·&nbsp; 15 MB لآخر ملف
                    </span>
                </div>

                <div class="p-0">
                    <div v-if="docs.length > 0" class="divide-y divide-base-200/60">
                        <div v-for="(doc, index) in docs" :key="doc.id"
                            class="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 hover:bg-base-200/10 transition-colors gap-3 group"
                            :class="{ 'bg-error/5': fileErrors[doc.id] }">

                            <div class="flex items-start gap-4 min-w-0 flex-1">
                                <div class="p-3.5 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                                    :style="getIconStyle(doc.document_type)">
                                    <svg v-if="doc.document_type === 'protocol_review_app'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                    <svg v-else-if="doc.document_type === 'oral_presentaion'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                                    <svg v-else-if="doc.document_type === 'pi_consent'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    <svg v-else-if="doc.document_type === 'research_procedures_approval'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    <svg v-else-if="doc.document_type === 'conflict_of_interest'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <svg v-else-if="doc.document_type === 'patient_consent'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <svg v-else-if="doc.document_type === 'research_alignment_with_research_plan'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    <svg v-else-if="doc.document_type === 'research_protocol'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>

                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <h3 class="font-bold text-base-content text-base leading-snug">
                                            {{ getDocumentName(doc.document_type) }}
                                        </h3>
                                        <span v-if="isLastDoc(doc)"
                                            class="badge badge-outline badge-sm text-xs opacity-60">
                                            حد أقصى 15 MB
                                        </span>
                                    </div>

                                    <div v-if="newFiles[doc.id]"
                                        class="flex items-center gap-1.5 mt-1.5 text-success text-xs font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span class="truncate max-w-[220px]">{{ shortFileName(newFiles[doc.id].name) }}</span>
                                    </div>

                                    <div v-if="fileErrors[doc.id]"
                                        class="flex items-center gap-1.5 mt-1.5 text-error text-xs font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>{{ fileErrors[doc.id] }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">

                                <a :href="`${Base_url}/storage/${doc.file_path}`" target="_blank"
                                    class="btn btn-outline btn-sm h-10 px-5 font-bold gap-2 flex-1 lg:flex-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    عرض الملف الحالى
                                </a>

                                <input type="file" class="hidden"
                                    :ref="el => { if (el) fileInputRefs[doc.id] = el }"
                                    @change="handleFileSelect(doc, $event)"
                                    accept=".pdf,.doc,.docx" />

                                <template v-if="newFiles[doc.id]">
                                    <button @click="triggerFileInput(doc.id)"
                                        class="btn btn-success btn-sm h-10 px-5 font-bold gap-2 flex-1 lg:flex-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        تغيير الملف
                                    </button>
                                    <button @click="removeNewFile(doc.id)"
                                        class="btn btn-ghost btn-sm btn-square h-10 w-10 text-error hover:bg-error/10"
                                        title="إلغاء الاختيار">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </template>

                                <template v-else>
                                    <button @click="triggerFileInput(doc.id)"
                                        class="btn btn-primary btn-sm h-10 px-5 font-bold gap-2 flex-1 lg:flex-none"
                                        :class="{ 'btn-error btn-outline': fileErrors[doc.id] }">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        {{ fileErrors[doc.id] ? 'اختر ملفاً صحيحاً' : 'رفع ملف جديد' }}
                                    </button>
                                </template>

                            </div>
                        </div>
                    </div>

                    <div v-else class="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div class="bg-base-200/50 p-6 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-base-content mb-1">لا توجد مستندات</h3>
                        <p class="text-base-content/50 text-sm max-w-sm">لم يتم إرفاق أي ملفات حتى الآن.</p>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div v-if="application?.needs_modification"
        class="flex items-center justify-between bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-200/60 max-w-6xl mx-auto px-4 mt-4">
        <div class="flex items-center gap-4">
            <div class="bg-primary/10 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-base-content">
                    تأكيد التعديل وإعادة الإرسال للمراجعة
                </h1>
                <p v-if="Object.keys(newFiles).length > 0" class="text-sm text-success font-medium mt-0.5">
                    ✓ {{ Object.keys(newFiles).length }} ملف جديد جاهز للرفع
                </p>
                <p v-else class="text-sm text-base-content/50 mt-0.5">
                    لم تقم برفع أي ملفات جديدة بعد
                </p>
            </div>
        </div>

        <button @click="editApplication" :disabled="isLoading || Object.keys(fileErrors).length > 0"
            class="btn btn-primary gap-2 px-6"
            :class="{ 'btn-disabled': isLoading || Object.keys(fileErrors).length > 0 }">
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            تأكيد التعديل
        </button>
    </div>
</template>