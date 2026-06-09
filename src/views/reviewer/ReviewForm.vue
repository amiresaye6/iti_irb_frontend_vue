<template>
  <div class="space-y-6 p-4 md:p-6 pb-24">
    <template v-if="reviewStore.loading && !app.id">
      <div class="flex justify-center p-12">
        <Spinner />
      </div>
    </template>

    <template v-else-if="reviewStore.currentReviewDetails">

      <!-- Status Banners -->
      <div v-if="app.current_stage === 'approved'"
        class="bg-gradient-to-br from-[#27ae60] to-[#2ecc71] text-white p-5 rounded-lg flex items-center gap-4 font-bold shadow-md mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <div class="text-lg">تم الاعتماد النهائي من الإدارة</div>
          <div class="text-sm font-medium opacity-90 mt-0.5">هذا البحث حاصل على الموافقة النهائية ولا يمكن تعديل القرار.
          </div>
        </div>
      </div>

      <div v-if="app.current_stage === 'rejected'"
        class="bg-gradient-to-br from-[#cf0f2c] to-[#c42817] text-white p-5 rounded-lg flex items-center gap-4 font-bold shadow-md mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <div>
          <div class="text-lg">تم الرفض النهائي</div>
          <div class="text-sm font-medium opacity-90 mt-0.5">هذا البحث مرفوض نهائياً ولا يمكن تعديل القرار.</div>
        </div>
      </div>

      <!-- Application Details -->
      <div class="card bg-base-100 shadow-sm border border-base-200 mb-6">
        <div class="card-body p-6">
          <h3 class="card-title text-lg border-b pb-3 mb-4 text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            بيانات البحث
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">رقم الملف</span>
              <span
                class="text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm shadow-sm border border-neutral-content/20 mt-2 inline-block"
                style="background-color: oklch(35% 0.02 245)">
                {{ app.serial_number || '—' }}
              </span>
            </div>

            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">تاريخ التقديم</span>
              <div class="font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span dir="ltr">{{ formatDate(app.created_at) }}</span>
              </div>
            </div>

            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200 md:col-span-2">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">عنوان البحث</span>
              <div class="font-bold text-base-content flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent mt-1 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ app.title }}
              </div>
            </div>

            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">الباحث الرئيسي</span>
              <div v-if="isBlinded" class="font-bold text-error flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                معلومات محجوبة
              </div>
              <div v-else class="font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ app.principal_investigator }}
              </div>
            </div>

            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">الكلية / القسم</span>
              <div class="font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ app.student?.faculty || app.faculty || 'غير متوفر' }} — {{ app.student?.department || app.department
                  || '' }}
              </div>
            </div>

            <div v-if="!isBlinded"
              class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200 md:col-span-2">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">الباحثون المشاركون</span>
              <div v-if="coInvestigators.length > 0" class="flex flex-wrap gap-2">
                <span v-for="(co, i) in coInvestigators" :key="i"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-full text-[0.88rem] font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/70" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ co }}
                </span>
              </div>
              <div v-else class="text-sm font-semibold text-slate-500">لا يوجد باحثون مشاركون</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden mb-6">
        <div class="px-6 py-5 border-b border-base-200/60 bg-base-50/50">
          <h2 class="text-lg font-bold text-base-content flex items-center gap-2">
            المستندات المرفقة
            <span v-if="app.documents?.length > 0" class="badge text-white text-xs opacity-70" style="background-color: var(--color-primary);">{{
              app.documents.length }}</span>
          </h2>
        </div>

        <div class="p-6">
          <div v-if="app.documents?.length > 0" class="docs-grid">
            <div v-for="doc in app.documents" :key="doc.id" class="doc-card">
              <div class="doc-icon shadow-sm" :style="{
                'protocol_review_app': 'background-color: #D500F9; color: #FFFFFF;',
                'oral_presentaion': 'background-color: #FF6D00; color: #FFFFFF;',
                'pi_consent': 'background-color: #00E5FF; color: #000000;',
                'research_procedures_approval': 'background-color: #00E676; color: #000000;',
                'conflict_of_interest': 'background-color: #FF1744; color: #FFFFFF;',
                'patient_consent': 'background-color: #F50057; color: #FFFFFF;',
                'research_alignment_with_research_plan': 'background-color: #2979FF; color: #FFFFFF;',
                'research_protocol': 'background-color: #FFEA00; color: #000000;'
              }[doc.document_type] || 'background-color: #111827; color: #FFFFFF;'">
                <svg v-if="doc.document_type === 'protocol_review_app'" xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>

                <svg v-else-if="doc.document_type === 'oral_presentaion'" xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>

                <svg v-else-if="doc.document_type === 'pi_consent'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>

                <svg v-else-if="doc.document_type === 'research_procedures_approval'" xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>

                <svg v-else-if="doc.document_type === 'conflict_of_interest'" xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>

                <svg v-else-if="doc.document_type === 'patient_consent'" xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>

                <svg v-else-if="doc.document_type === 'research_alignment_with_research_plan'"
                  xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>

                <svg v-else-if="doc.document_type === 'research_protocol'" xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>

                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              <div class="doc-info">
                <div class="doc-name">{{ getDocMeta(doc.document_type).label }}</div>
                <div class="doc-actions">
                  <a :href="docUrl(doc.file_path)" target="_blank" class="doc-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    عرض
                  </a>
                  <a :href="docUrl(doc.file_path)" class="doc-btn"
                    @click.prevent="downloadDoc(docUrl(doc.file_path), doc.file_path)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    تحميل
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div class="bg-base-200/50 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-base-content mb-1">لا توجد مستندات</h3>
            <p class="text-base-content/50 text-sm max-w-sm">لم يتم إرفاق أي ملفات خاصة بهذا البحث حتى الآن.</p>
          </div>
        </div>
      </div>

      <!-- Decision Form -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-6">
          <h3 class="card-title text-lg border-b pb-3 mb-4 text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            قراري وتعليقاتي
          </h3>

          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-4">
              <!-- Current Decision Status -->
              <div class="bg-base-200/50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p class="text-sm font-bold text-base-content/70 mb-2">القرار الحالي للمراجعة:</p>
                  <span v-if="reviewStore.currentReviewDetails?.decision === 'pending'"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-base-content/70 bg-base-200">
                    <i class="fa-solid fa-hourglass-half"></i> قيد المراجعة
                  </span>
                  <span v-else-if="reviewStore.currentReviewDetails?.decision === 'approved'"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-[#155724] bg-[#d4edda]">
                    <i class="fa-solid fa-check-double"></i> مقبول
                  </span>
                  <span v-else-if="reviewStore.currentReviewDetails?.decision === 'rejected'"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-[#721c24] bg-[#f8d7da]">
                    <i class="fa-solid fa-xmark"></i> مرفوض
                  </span>
                  <span v-else-if="reviewStore.currentReviewDetails?.decision === 'needs_modification'"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-[#b9770e] bg-[#fdf2e9]">
                    <i class="fa-solid fa-pen"></i> يحتاج تعديل
                  </span>
                </div>
                <button v-if="!isReadonly" class="btn btn-primary" onclick="decisionModal.showModal()">إضافة
                  قرار</button>
              </div>

              <!-- Past Comments History -->
              <div v-if="comments.length > 0" class="mt-6">
                <h4 class="font-extrabold text-lg mb-4 text-primary flex items-center gap-2">
                  <i class="fa-solid fa-clock-rotate-left"></i>
                  سجل التعليقات السابقة
                </h4>
                <div class="space-y-4 max-h-96 overflow-y-auto pl-2 border-r-4 border-base-300 pr-5 relative py-2">
                  <div v-for="c in comments" :key="c.id"
                    class="bg-base-100 p-5 rounded-xl border border-base-200 shadow-sm relative transition-all hover:shadow-md">
                    <div class="absolute -right-[31px] top-6 w-4 h-4 rounded-full border-4 border-base-100"
                      :class="c.decision === 'rejected' ? 'bg-error' : (c.decision === 'needs_modification' ? 'bg-warning' : 'bg-primary')">
                    </div>
                    <div class="flex justify-between items-start mb-2">
                      <span class="font-bold text-base-content">{{ c.decision_label || 'تعليق مراجع' }}</span>
                      <span class="text-sm font-bold text-base-content/60 bg-base-200 px-2 py-0.5 rounded" dir="ltr">{{
                        new Date(c.created_at).toLocaleString('ar-SA') }}</span>
                    </div>
                    <p class="leading-relaxed text-base-content/90 text-[1.05rem]">{{ c.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decision Modal -->
      <dialog id="decisionModal" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">اتخاذ قرار المراجعة</h3>

          <div class="space-y-5">
            <div class="form-control">
              <label class="label"><span class="label-text font-bold">قرار المراجعة <span
                    class="text-error">*</span></span></label>
              <select v-model="form.decision" class="select select-bordered w-full">
                <option value="" disabled>-- اختر القرار --</option>
                <option value="approved">موافقة</option>
                <option value="needs_modification">طلب تعديل</option>
                <option value="rejected">رفض</option>
              </select>
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text font-bold">ملاحظات وتعليقات</span></label>
              <textarea v-model="form.comment" class="textarea textarea-bordered h-32 text-base leading-relaxed"
                placeholder="أدخل ملاحظاتك هنا... (مطلوب في حال طلب التعديل أو الرفض)"></textarea>
            </div>

            <div class="modal-action">
              <form method="dialog">
                <button class="btn btn-outline border-2 px-6 ml-2">إلغاء</button>
              </form>
              <button class="btn btn-primary px-8 border-none text-white font-bold" @click="submit"
                :disabled="isSubmitting || !isFormValid">
                <span v-if="isSubmitting" class="loading loading-spinner"></span>
                حفظ القرار
              </button>
            </div>

            <!-- Inline feedback -->
            <div v-if="submitSuccess"
              class="mt-3 p-3 bg-success/10 border border-success text-success rounded-lg text-sm font-bold flex items-center gap-2">
              <i class="fa-solid fa-check-circle"></i> تم حفظ القرار بنجاح! جاري التحويل...
            </div>
            <div v-if="submitError"
              class="mt-3 p-3 bg-error/10 border border-error text-error rounded-lg text-sm font-bold flex items-center gap-2">
              <i class="fa-solid fa-circle-exclamation"></i> {{ submitError }}
            </div>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReviewStore } from '@/store/reviews/index';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

const applicationId = route.params.id;

const form = ref({
  decision: '',
  comment: ''
});

const isSubmitting = ref(false);

onMounted(async () => {
  await reviewStore.fetchReviewDetails(applicationId);
  const review = reviewStore.currentReviewDetails;
  if (review) {
    form.value.decision = review.decision !== 'pending' ? review.decision : '';
  }
});

const app = computed(() => reviewStore.currentReviewDetails?.application || {});
const comments = computed(() => reviewStore.currentReviewDetails?.comments || []);

const isBlinded = computed(() => {
  return app.value.is_blinded || app.value.principal_investigator === 'معلومات محجوبة';
});

const coInvestigators = computed(() => {
  if (!app.value.co_investigators) return [];
  try {
    const parsed = JSON.parse(app.value.co_investigators);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

// Readonly if application is not under_review
const isReadonly = computed(() => {
  return app.value.current_stage !== 'under_review';
});

const isFormValid = computed(() => {
  if (!form.value.decision) return false;
  if ((form.value.decision === 'needs_modification' || form.value.decision === 'rejected') && !form.value.comment.trim()) {
    return false;
  }
  return true;
});

const submitError = ref('');
const submitSuccess = ref(false);

const submit = async () => {
  submitError.value = '';
  isSubmitting.value = true;
  const result = await reviewStore.submitDecision(applicationId, form.value);
  isSubmitting.value = false;

  if (result.success) {
    submitSuccess.value = true;
    await reviewStore.fetchReviewDetails(applicationId);
    setTimeout(() => {
      router.push({ name: 'AssignedResearches' });
    }, 1500);
  } else {
    submitError.value = result.message || 'حدث خطأ أثناء الحفظ';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const docMeta = {
  'protocol_review_app': { label: 'طلب مراجعة بروتوكول بحثى', icon: 'fa-file-lines', color: '#2980b9' },
  'oral_presentaion': { label: 'العرض التقديمى الشفهى للبروتوكول البحثى', icon: 'fa-chalkboard-user', color: '#8e44ad' },
  'pi_consent': { label: 'اقرار الباحث الرئيسى', icon: 'fa-signature', color: '#27ae60' },
  'research_procedures_approval': { label: 'نموذج قرار الموافقة على الاجراءات البحثية', icon: 'fa-file-circle-check', color: '#16a085' },
  'conflict_of_interest': { label: 'نموذج عدم تعارض المصالح', icon: 'fa-scale-balanced', color: '#e67e22' },
  'patient_consent': { label: 'نموذج الموافقة المستنيرة للمريض', icon: 'fa-hand-holding-medical', color: '#c0392b' },
  'research_alignment_with_research_plan': { label: 'نموذج تقرير توافق الابحاث مع الخطة البحثية', icon: 'fa-bars-progress', color: '#2c3e50' },
  'research_protocol': { label: 'البروتوكول البحثى', icon: 'fa-file-medical', color: '#1abc9c' }
};

const getDocMeta = (type) => {
  return docMeta[type] || { label: 'مستند: ' + type, icon: 'fa-file', color: '#7f8c8d' };
};

const getDocName = (type) => getDocMeta(type).label;

const docUrl = (filePath) => {
  const base = import.meta.env.VITE_BACKEND_SERVER?.replace('/api', '') || '';
  return `${base}/storage/${filePath}`;
};

const downloadDoc = async (url, filePath) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        // Extract just the filename from the path
        link.download = filePath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (e) {
        console.error('Download failed:', e);
    }
};

</script>

<style scoped>
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 4px;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.doc-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.doc-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
  color: #fff;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  font-weight: 700;
  font-size: 0.92rem;
  color: #1e293b;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-actions {
  display: flex;
  gap: 8px;
}

/* .doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  background: oklch(var(--p));
  color: white;
  transition: opacity 0.2s;
}

.doc-btn:hover {
  opacity: 0.85;
}

.doc-btn+.doc-btn {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
} */
 .doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
  /* View button — explicit primary color */
  background: var(--color-primary);
  color: white;
  border: 1px solid transparent;
}

.doc-btn:hover {
  opacity: 0.85;
}

.doc-btn + .doc-btn {
  /* Download button */
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}
</style>
