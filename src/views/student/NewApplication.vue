<script setup>
import { ref } from 'vue';
import { applicationServices } from '@/services/applicationServices.js'

const appServices = applicationServices();

const isLoading = ref(false);
const errorMessage = ref(null);
const fileErrors = ref({});
const dataErrors = ref({}); 

const setLoading = (val) => isLoading.value = val;
const setError = (err) => errorMessage.value = err?.message || err;

const title = ref('');
const principal_investigator = ref('');

const coInvestigatorsList = ref([
    { role: 'عضو هيئة تدريس', name: '' }
]);

const addCoInvestigator = () => {
    coInvestigatorsList.value.push({ role: 'عضو هيئة تدريس', name: '' });
};

const removeCoInvestigator = (index) => {
    coInvestigatorsList.value.splice(index, 1);
};

const keywordsList = ref(['']);

const addKeyword = () => {
    keywordsList.value.push('');
};

const removeKeyword = (index) => {
    keywordsList.value.splice(index, 1);
};

const files = ref({
    protocol_review_app: null,
    oral_presentaion: null,
    pi_consent: null,
    research_procedures_approval: null,
    conflict_of_interest: null,
    patient_consent: null,
    research_alignment_with_research_plan: null,
    research_protocol: null
});

const handleInputErrors = () => {
    dataErrors.value = {}; 
    let isValid = true;

    const titleVal = title.value.trim();
    if (!titleVal) {
        dataErrors.value.title = 'عنوان البحث مطلوب.';
        isValid = false;
    } else if (titleVal.length < 3) {
        dataErrors.value.title = 'عنوان البحث يجب ألا يقل عن 3 أحرف.';
        isValid = false;
    } else if (titleVal.length > 255) {
        dataErrors.value.title = 'عنوان البحث يجب ألا يزيد عن 255 حرف.';
        isValid = false;
    }

    const piVal = principal_investigator.value.trim();
    if (!piVal) {
        dataErrors.value.principal_investigator = 'اسم الباحث الرئيسي مطلوب.';
        isValid = false;
    } else if (piVal.length < 3) {
        dataErrors.value.principal_investigator = 'اسم الباحث يجب ألا يقل عن 3 أحرف.';
        isValid = false;
    } else if (piVal.length > 255) {
        dataErrors.value.principal_investigator = 'اسم الباحث يجب ألا يزيد عن 255 حرف.';
        isValid = false;
    }

    dataErrors.value.co_investigators = [];
    coInvestigatorsList.value.forEach((investigator, index) => {
        const nameVal = investigator.name.trim();
        let err = null;
        if (!nameVal) err = 'اسم الباحث مطلوب.';
        else if (nameVal.length < 3) err = 'يجب ألا يقل عن 3 أحرف.';
        else if (nameVal.length > 255) err = 'يجب ألا يزيد عن 255 حرف.';

        if (err) {
            dataErrors.value.co_investigators[index] = err;
            isValid = false;
        }
    });

    dataErrors.value.keywords = [];
    keywordsList.value.forEach((kw, index) => {
        const kwVal = kw.trim();
        let err = null;
        if (!kwVal) err = 'الكلمة المفتاحية مطلوبة.';
        else if (kwVal.length < 3) err = 'يجب ألا تقل عن 3 أحرف.';
        else if (kwVal.length > 50) err = 'يجب ألا تزيد عن 50 حرف.';

        if (err) {
            dataErrors.value.keywords[index] = err;
            isValid = false;
        }
    });

    return isValid;
};

const handleFileUpload = (event, fieldName, maxSizeMB) => {
    const file = event.target.files[0];
    fileErrors.value[fieldName] = null; 

    if (!file) {
        files.value[fieldName] = null;
        return;
    }

    const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
        fileErrors.value[fieldName] = 'عذراً، مسموح فقط بملفات PDF و Word.';
        event.target.value = '';
        files.value[fieldName] = null;
        return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
        fileErrors.value[fieldName] = `حجم الملف يتجاوز الحد الأقصى المسموح (${maxSizeMB} MB).`;
        event.target.value = ''; 
        files.value[fieldName] = null;
        return;
    }

    files.value[fieldName] = file;
};

const Apply = async () => {
    const isTextsValid = handleInputErrors();
    
    let isFilesValid = true;
    for (const key in files.value) {
        if (!files.value[key]) {
            if (!fileErrors.value[key]) {
                fileErrors.value[key] = 'هذا المرفق مطلوب.';
            }
            isFilesValid = false;
        }
    }

    if (!isTextsValid || !isFilesValid) {
        errorMessage.value = "يرجى تصحيح الأخطاء في الحقول والمرفقات لتتمكن من التقديم.";
        return; 
    }
    
    errorMessage.value = null;

    const co_investigators_str = coInvestigatorsList.value
        .map(c => `${c.role} ${c.name.trim()}`)
        .join('، ');

    const keywords_str = keywordsList.value
        .map(k => k.trim())
        .join('، ');

    const application = {
        title: title.value.trim(),
        principal_investigator: principal_investigator.value.trim(),
        co_investigators: co_investigators_str,
        keywords: keywords_str,
        ...files.value
    };

    console.log("application", application);

    const data = await appServices.postApplication(
        application,
        setLoading,
        setError
    );
};
</script>

<template>
    <form @submit.prevent="Apply" novalidate class="max-w-5xl mx-auto px-4 py-10 space-y-8 font-sans" dir="rtl">
        
        <div class="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center gap-4">
            <div class="bg-primary text-primary-content p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-base-content">تقديم بروتوكول بحثي جديد</h1>
                <p class="text-sm text-base-content/60 mt-1">يرجى ملء كافة البيانات ورفع المرفقات المطلوبة بدقة.</p>
            </div>
        </div>

        <div v-if="errorMessage" class="alert alert-error shadow-sm rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-7 space-y-6">
                <div class="card bg-base-100 shadow-sm border border-base-200/60 p-6">
                    <h2 class="text-lg font-bold border-b border-base-200 pb-4 mb-6 text-primary">البيانات الأساسية</h2>
                    
                    <div class="space-y-5">
                        
                        <div class="form-control w-full">
                            <label class="label"><span class="label-text font-semibold">عنوان البحث</span></label>
                            <input type="text" v-model="title" :class="{'input-error': dataErrors.title}" class="input input-bordered w-full focus:input-primary" placeholder="اكتب عنوان البحث بدقة..." />
                            <span v-if="dataErrors.title" class="text-error text-xs mt-1 font-semibold">{{ dataErrors.title }}</span>
                        </div>

                        <div class="form-control w-full">
                            <label class="label"><span class="label-text font-semibold">اسم الباحث الرئيسي</span></label>
                            <input type="text" v-model="principal_investigator" :class="{'input-error': dataErrors.principal_investigator}" class="input input-bordered w-full focus:input-primary" placeholder="الاسم رباعي..." />
                            <span v-if="dataErrors.principal_investigator" class="text-error text-xs mt-1 font-semibold">{{ dataErrors.principal_investigator }}</span>
                        </div>

                        <div class="form-control w-full">
                            <label class="label"><span class="label-text font-semibold">الباحثون المشاركون</span></label>
                            <div class="space-y-3">
                                <div v-for="(investigator, index) in coInvestigatorsList" :key="index">
                                    <div class="flex items-center gap-2">
                                        <select v-model="investigator.role" class="select select-bordered focus:select-primary w-1/3">
                                            <option value="عضو هيئة تدريس">عضو هيئة تدريس</option>
                                            <option value="طالب">طالب</option>
                                            <option value="باحث">باحث</option>
                                        </select>
                                        <input type="text" v-model="investigator.name" :class="{'input-error': dataErrors.co_investigators?.[index]}" class="input input-bordered focus:input-primary flex-1" placeholder="اسم الباحث..." />
                                        
                                        <button v-if="index === coInvestigatorsList.length - 1" @click="addCoInvestigator" class="btn btn-square btn-primary btn-outline" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                        <button v-if="coInvestigatorsList.length > 1" @click="removeCoInvestigator(index)" class="btn btn-square btn-error btn-outline" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                                        </button>
                                    </div>
                                    <span v-if="dataErrors.co_investigators?.[index]" class="text-error text-xs mt-1 font-semibold block">{{ dataErrors.co_investigators[index] }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-control w-full">
                            <label class="label"><span class="label-text font-semibold">الكلمات المفتاحية (Keywords)</span></label>
                            <div class="space-y-3">
                                <div v-for="(keyword, index) in keywordsList" :key="'kw'+index">
                                    <div class="flex items-center gap-2">
                                        <input type="text" v-model="keywordsList[index]" :class="{'input-error': dataErrors.keywords?.[index]}" class="input input-bordered focus:input-primary flex-1" placeholder="مثال: ذكاء اصطناعي..." />
                                        
                                        <button v-if="index === keywordsList.length - 1" @click="addKeyword" class="btn btn-square btn-primary btn-outline" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                        <button v-if="keywordsList.length > 1" @click="removeKeyword(index)" class="btn btn-square btn-error btn-outline" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                                        </button>
                                    </div>
                                    <span v-if="dataErrors.keywords?.[index]" class="text-error text-xs mt-1 font-semibold block">{{ dataErrors.keywords[index] }}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="lg:col-span-5 space-y-6">
                <div class="card bg-base-100 shadow-sm border border-base-200/60 p-6">
                    <h2 class="text-lg font-bold border-b border-base-200 pb-4 mb-6 text-primary">المرفقات (PDF, Word)</h2>
                    
                    <div class="space-y-5">
                        <div v-for="(item, key) in {
                            protocol_review_app: { label: 'طلب مراجعة بروتوكول بحثى', max: 3 },
                            oral_presentaion: { label: 'العرض التقديمى الشفهى', max: 3 },
                            pi_consent: { label: 'اقرار الباحث الرئيسى', max: 3 },
                            research_procedures_approval: { label: 'نموذج الموافقة على الاجراءات', max: 3 },
                            conflict_of_interest: { label: 'نموذج عدم تعارض المصالح', max: 3 },
                            patient_consent: { label: 'نموذج الموافقة المستنيرة', max: 3 },
                            research_alignment_with_research_plan: { label: 'تقرير توافق الابحاث', max: 3 },
                            research_protocol: { label: 'البروتوكول البحثى', max: 15 }
                        }" :key="key" class="form-control w-full">
                            
                            <label class="label py-1">
                                <span class="label-text font-medium" :class="{'text-error': fileErrors[key]}">{{ item.label }}</span>
                                <span class="label-text-alt text-base-content/50">Max {{ item.max }}MB</span>
                            </label>
                            
                            <input type="file" 
                                @change="handleFileUpload($event, key, item.max)" 
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                :class="[
                                    'file-input file-input-bordered file-input-sm w-full transition-colors',
                                    fileErrors[key] ? 'file-input-error text-error focus:file-input-error' : 'file-input-primary'
                                ]"
                            />
                            
                            <span v-if="fileErrors[key]" class="text-error text-xs mt-1 font-semibold flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {{ fileErrors[key] }}
                            </span>
                        </div>
                    </div>
                </div>
</div>
            
        </div>

        <div class="flex justify-end pt-6 border-t border-base-200">
            <button type="submit" class="btn btn-primary btn-lg px-12 shadow-lg" :disabled="isLoading">
                <span v-if="isLoading" class="loading loading-spinner"></span>
                <span v-else>تقديم الطلب</span>
            </button>
        </div>
        
    </form>
</template>