<script setup>
import { ref, onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router'
import { applicationServices } from '@/services/applicationServices.js'
import ApplicationStages from '@/components/common/ApplicationStages.vue'

const Base_url = import.meta.env.VITE_BACKEND_SERVER;
const Docs_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;


const appServices = applicationServices();
const route = useRoute();
const router = useRouter();

const application = ref(null);
const docs = ref([])
const isLoading = ref(false);
const errorMessage = ref(null);

const setLoading = (val) => isLoading.value = val;
const setError = (err) => errorMessage.value = err?.message || err;

const fetchApplication = async()=>{
    const appId = route.params.id;
    const data = await appServices.getAppById(appId,setLoading,setError);
    if(data){
        application.value = data;
        console.log(application.value);
    } 
}

const fetchDocuments = async()=>{
    const appId = route.params.id;
    const data = await appServices.getDocsByAppId(appId,setLoading,setError);
    if(data){
        docs.value = data;
        console.log(docs.value);
    } 
}

onMounted(()=>{
    fetchApplication();
    fetchDocuments();
})

const documentTranslations = {
    protocol_review_app: 'طلب مراجعة بروتوكول بحثى',
    oral_presentaion: 'العرض التقديمى الشفهى للبروتوكول البحثى',
    pi_consent: 'اقرار الباحث الرئيسى',
    research_procedures_approval: 'نموذج قرار الموافقة على الاجراءات البحثية',
    conflict_of_interest: 'نموذج عدم تعارض المصالح',
    patient_consent: 'نموذج الموافقة المستنيرة للمريض',
    research_alignment_with_research_plan: 'نموذج تقرير توافق الابحاث مع الخطة البحثية',
    research_protocol: 'البروتوكول البحثى'
};

const stageTranslations = {
    'pending_admin': 'مراجعة اولية',
    'under_review': 'قيد المراجعة',
    'final_review': 'المراجعة النهائية',
    'awaiting_payment': 'في انتظار الدفع',
    'approved': 'مقبول',
    'rejected': 'مرفوض'
};

const getDocumentName = (docType) => {
    return documentTranslations[docType] || docType;
};

const getStageName = (stage) => {
    return stageTranslations[stage] || stage;
};

</script>

<template>
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-8 w-full font-sans">
        
        <div v-if="!application?.needs_modification" class="flex items-center justify-between bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-200/60">
            <div class="flex items-center gap-4">
                <div class="bg-primary/10 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-base-content">تفاصيل البحث</h1>
                    <p class="text-sm text-base-content/60 mt-1">مراجعة شاملة لبيانات الطلب ومرفقاته</p>
                </div>
            </div>
            <button @click="router.push('/student/dashboard')" class="btn btn-outline hover:btn-primary border-base-300 gap-2 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                العودة
            </button>
        </div>
        <div v-if="application?.needs_modification" class="flex items-center justify-between bg-yellow-300 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-200/60">
            <div class="flex items-center gap-4">
                <div class="bg-primary/10 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86l-8.2 14.24A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.41-2.1l-8.2-14.04a1.5 1.5 0 00-2.42 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-base-content">هذا الطلب يحتاج إلى تعديل</h1>
                    <p class="text-sm text-base-content/60 mt-1">يمكنك مراجعة الاشعارات لمعرفة التعديلات المطلوبة </p>
                </div>
            </div>
            <button @click="router.push('/student/dashboard')" class="btn btn-outline hover:btn-primary border-base-300 gap-2 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                العودة للوحة التحكم
            </button>
            
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-base-100 rounded-2xl border border-base-200/60 shadow-sm">
            <span class="loading loading-spinner loading-lg text-primary mb-4"></span>
            <span class="text-lg font-medium text-base-content/70">جاري تحميل البيانات...</span>
        </div>

        <div v-else-if="errorMessage" class="alert alert-error shadow-sm rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <div v-else-if="application" class="space-y-8">
            <ApplicationStages :current-stage="application.current_stage" />
            
            <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden">
                <div class="px-6 py-5 border-b border-base-200/60 flex flex-wrap gap-4 items-center justify-between bg-base-50/50">
                    <h2 class="text-lg font-bold text-base-content flex items-center gap-2">
                        البيانات الأساسية
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
                            <p class="text-base font-medium text-base-content/80 leading-relaxed">{{ application.co_investigators || 'لا يوجد باحثون مشاركون' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden">
                <div class="px-6 py-5 border-b border-base-200/60 bg-base-50/50">
                    <h2 class="text-lg font-bold text-base-content flex items-center gap-2">
                        المستندات المرفقة
                        <span v-if="docs.length > 0" class="badge badge-neutral text-xs opacity-70">{{ docs.length }}</span>
                    </h2>
                </div>
                
                <div class="p-0">
                    <div v-if="docs.length > 0" class="divide-y divide-base-200/60">
                        <div 
                            v-for="doc in docs" 
                            :key="doc.id"
                            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-base-200/20 transition-colors gap-4 group"
                        >
                            <div class="flex items-center gap-4">
                                <div 
                                    class="p-3.5 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                                    :style="{
                                        'protocol_review_app': 'background-color: #D500F9; color: #FFFFFF;', 
                                        'oral_presentaion': 'background-color: #FF6D00; color: #FFFFFF;', 
                                        'pi_consent': 'background-color: #00E5FF; color: #000000;',
                                        'research_procedures_approval': 'background-color: #00E676; color: #000000;', 
                                        'conflict_of_interest': 'background-color: #FF1744; color: #FFFFFF;',
                                        'patient_consent': 'background-color: #F50057; color: #FFFFFF;',
                                        'research_alignment_with_research_plan': 'background-color: #2979FF; color: #FFFFFF;', 
                                        'research_protocol': 'background-color: #FFEA00; color: #000000;'
                                    }[doc.document_type] || 'background-color: #111827; color: #FFFFFF;'"
                                >
                                    <svg v-if="doc.document_type === 'protocol_review_app'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>

                                    <svg v-else-if="doc.document_type === 'oral_presentaion'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>

                                    <svg v-else-if="doc.document_type === 'pi_consent'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>

                                    <svg v-else-if="doc.document_type === 'research_procedures_approval'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>

                                    <svg v-else-if="doc.document_type === 'conflict_of_interest'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>

                                    <svg v-else-if="doc.document_type === 'patient_consent'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>

                                    <svg v-else-if="doc.document_type === 'research_alignment_with_research_plan'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>

                                    <svg v-else-if="doc.document_type === 'research_protocol'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>

                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                
                                <div>
                                    <h3 class="font-bold text-base-content text-lg">{{ getDocumentName(doc.document_type) }}</h3>
                                </div>
                            </div>

                            <a 
                                :href="`${Docs_BASE_URL}storage/${doc.file_path}`" 
                                target="_blank"
                                class="btn btn-primary btn-sm px-8 h-10 font-bold w-full sm:w-auto shadow-sm"
                            >
                                عرض المستند
                            </a>
                        </div>
                    </div>

                    <div v-else class="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div class="bg-base-200/50 p-6 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-base-content mb-1">لا توجد مستندات</h3>
                        <p class="text-base-content/50 text-sm max-w-sm">لم يتم إرفاق أي ملفات خاصة بهذا البحث حتى الآن.</p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    <div v-if="application?.needs_modification" class="flex items-center justify-between bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-200/60">
            <div class="flex items-center gap-4">
                <div class="bg-primary/10 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-base-content">الانتقال الى صفحة التعديل </h1>
                </div>
            </div>
            <button @click="router.push(`/student/edit-application/${application.id}`)" class="btn btn-primary hover:btn-primary border-base-300 gap-2 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                تعديل الطلب
            </button>
        </div>
</template>