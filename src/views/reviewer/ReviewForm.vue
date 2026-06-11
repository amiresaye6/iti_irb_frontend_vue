<template>
  <div class="space-y-6 p-4 md:p-6 pb-24" dir="rtl">
    <template v-if="reviewStore.loading && !app.id">
      <div class="flex justify-center p-12">
        <Spinner />
      </div>
    </template>

    <template v-else-if="reviewStore.currentReviewDetails">

      <!-- ══════════════════════════════════════════════════════════
           STATUS BANNERS
      ══════════════════════════════════════════════════════════ -->
      <div v-if="app.current_stage === 'approved'" class="status-banner status-banner--approved">
        <div class="status-banner__icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <div class="text-base font-extrabold">تم الاعتماد النهائي من الإدارة</div>
          <div class="text-sm opacity-80 mt-0.5">هذا البحث حاصل على الموافقة النهائية ولا يمكن تعديل القرار.</div>
        </div>
      </div>

      <div v-if="app.current_stage === 'rejected'" class="status-banner status-banner--rejected">
        <div class="status-banner__icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <div>
          <div class="text-base font-extrabold">تم الرفض النهائي</div>
          <div class="text-sm opacity-80 mt-0.5">هذا البحث مرفوض نهائياً ولا يمكن تعديل القرار.</div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════
           APPLICATION DETAILS
      ══════════════════════════════════════════════════════════ -->
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
            <div class="info-cell">
              <span class="info-cell__label">رقم الملف</span>
              <span class="serial-badge">{{ app.serial_number || '—' }}</span>
            </div>

            <div class="info-cell">
              <span class="info-cell__label">تاريخ التقديم</span>
              <div class="font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span dir="ltr">{{ formatDate(app.created_at) }}</span>
              </div>
            </div>

            <div class="info-cell md:col-span-2">
              <span class="info-cell__label">عنوان البحث</span>
              <div class="font-bold text-base-content flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent mt-1 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ app.title }}
              </div>
            </div>

            <div class="info-cell">
              <span class="info-cell__label">الباحث الرئيسي</span>
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

            <div class="info-cell">
              <span class="info-cell__label">الكلية / القسم</span>
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

            <div v-if="!isBlinded" class="info-cell md:col-span-2">
              <span class="info-cell__label">الباحثون المشاركون</span>
              <div v-if="coInvestigators.length > 0" class="flex flex-wrap gap-2 mt-1">
                <span v-for="(co, i) in coInvestigators" :key="i" class="co-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
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

      <!-- ══════════════════════════════════════════════════════════
           APPLICATION DOCUMENTS
      ══════════════════════════════════════════════════════════ -->
      <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden mb-6">
        <div class="px-6 py-5 border-b border-base-200/60 bg-base-50/50 flex items-center gap-3">
          <div class="section-icon-wrap section-icon-wrap--blue">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-base-content flex items-center gap-2">
            مستندات الطلب
            <span v-if="app.documents?.length > 0" class="badge text-white text-xs"
              style="background-color: var(--color-primary);">
              {{ app.documents.length }}
            </span>
          </h2>
        </div>

        <div class="p-6">
          <div v-if="app.documents?.length > 0" class="docs-grid">
            <div v-for="doc in app.documents" :key="doc.id" class="doc-card">
              <div class="doc-icon" :style="docIconStyle(doc.document_type)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="doc-info">
                <div class="doc-name">{{ getDocMeta(doc.document_type).label }}</div>
                <div class="doc-actions">
                  <a :href="docUrl(doc.file_path)" target="_blank" class="doc-btn doc-btn--view">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    عرض
                  </a>
                  <a :href="docUrl(doc.file_path)" class="doc-btn doc-btn--dl"
                    :download="doc.file_path.split('/').pop()" target="_blank">
                    <svg xmlns=" http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
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
          <div v-else class="empty-state">
            <div class="empty-state__icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-base-content mb-1">لا توجد مستندات</h3>
            <p class="text-base-content/50 text-sm">لم يتم إرفاق أي ملفات بهذا الطلب.</p>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════
           REVIEWER CHECKLIST — UPLOADED DOCUMENT (readonly)
      ══════════════════════════════════════════════════════════ -->
      <div v-if="reviewStore.currentReviewDetails?.review_document_url" class="review-doc-section mb-6">
        <div class="review-doc-section__header">
          <div class="section-icon-wrap section-icon-wrap--teal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-extrabold text-base-content">قائمة تدقيق المراجعة — المرفوعة</h2>
            <p class="text-xs text-base-content/50 mt-0.5">النموذج المعبأ والمرفوع من المراجع</p>
          </div>
        </div>
        <div class="review-doc-card">
          <div class="review-doc-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-base-content text-sm mb-0.5">قائمة تدقيق المراجعة</div>
            <div class="text-xs text-base-content/50">نموذج IRB المعبأ · PDF / DOC</div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <a :href="reviewStore.currentReviewDetails.review_document_url" target="_blank"
              class="doc-btn doc-btn--view">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              عرض
            </a>
            <a :href="reviewStore.currentReviewDetails.review_document_url" class="doc-btn doc-btn--dl"
              :download="reviewStore.currentReviewDetails.review_document.split('/').pop()" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              تحميل
            </a>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════
           DECISION PANEL
      ══════════════════════════════════════════════════════════ -->
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

          <!-- Current decision + action button -->
          <div class="bg-base-200/50 p-4 rounded-xl flex justify-between items-center mb-4">
            <div>
              <p class="text-xs font-bold text-base-content/60 mb-2 uppercase tracking-wide">القرار الحالي</p>
              <span v-if="reviewStore.currentReviewDetails?.decision === 'pending'"
                class="decision-badge decision-badge--pending">
                <i class="fa-solid fa-hourglass-half"></i> قيد المراجعة
              </span>
              <span v-else-if="reviewStore.currentReviewDetails?.decision === 'approved'"
                class="decision-badge decision-badge--approved">
                <i class="fa-solid fa-check-double"></i> مقبول
              </span>
              <span v-else-if="reviewStore.currentReviewDetails?.decision === 'rejected'"
                class="decision-badge decision-badge--rejected">
                <i class="fa-solid fa-xmark"></i> مرفوض
              </span>
              <span v-else-if="reviewStore.currentReviewDetails?.decision === 'needs_modification'"
                class="decision-badge decision-badge--modify">
                <i class="fa-solid fa-pen"></i> يحتاج تعديل
              </span>
            </div>
            <button v-if="!isReadonly" class="btn btn-primary gap-2" @click="openDecisionModal">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              إضافة قرار
            </button>
          </div>

          <!-- Comments timeline -->
          <div v-if="comments.length > 0" class="mt-2">
            <h4 class="font-extrabold text-base mb-4 text-primary flex items-center gap-2">
              <i class="fa-solid fa-clock-rotate-left"></i>
              سجل التعليقات السابقة
            </h4>
            <div class="timeline-list">
              <div v-for="c in comments" :key="c.id" class="timeline-item">
                <div class="timeline-dot"
                  :class="c.decision === 'rejected' ? 'timeline-dot--rejected' : (c.decision === 'needs_modification' ? 'timeline-dot--modify' : 'timeline-dot--approved')">
                </div>
                <div class="timeline-card">
                  <div class="flex justify-between items-start mb-2 gap-2 flex-wrap">
                    <span class="font-bold text-base-content text-sm">{{ c.decision_label || 'تعليق مراجع' }}</span>
                    <span class="text-xs font-bold text-base-content/50 bg-base-200 px-2 py-0.5 rounded" dir="ltr">
                      {{ new Date(c.created_at).toLocaleString('ar-SA') }}
                    </span>
                  </div>
                  <p class="leading-relaxed text-base-content/85 text-sm">{{ c.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- ══════════════════════════════════════════════════════════
         DECISION MODAL
    ══════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-panel" role="dialog" aria-modal="true">

            <!-- Header -->
            <div class="modal-header">
              <div class="modal-header__icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-base-content">اتخاذ قرار المراجعة</h3>
                <p class="text-xs text-base-content/50 mt-0.5">اختر القرار المناسب وأرفق النموذج المعبأ عند الاقتضاء</p>
              </div>
              <button class="modal-close-btn" @click="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body">

              <!-- ── IRB Checklist template download banner ─────────────── -->
              <div v-if="checklistTemplateUrl" class="checklist-banner">
                <div class="checklist-banner__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-extrabold text-[#064e3b]">نموذج قائمة تدقيق المراجعة (IRB)</p>
                  <p class="text-xs text-[#065f46]/70 mt-0.5">حمّل النموذج، عبّئه، ثم ارفعه أدناه مع قرارك.</p>
                </div>
                <a :href="checklistTemplateUrl" class="checklist-banner__btn" download="IRB-ReviewerCHECKLIST.doc">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  تحميل النموذج
                </a>
              </div>

              <!-- ── Decision card selector ──────────────────────────────── -->
              <div class="field-group">
                <label class="field-label">قرار المراجعة <span class="text-error">*</span></label>
                <div class="decision-cards">
                  <button v-for="opt in decisionOptions" :key="opt.value" type="button" class="decision-option"
                    :class="[`decision-option--${opt.value}`, form.decision === opt.value && 'decision-option--selected']"
                    @click="form.decision = opt.value">
                    <span class="decision-option__icon" v-html="opt.icon"></span>
                    <span class="decision-option__label">{{ opt.label }}</span>
                  </button>
                </div>
              </div>

              <!-- ── Comment textarea ───────────────────────────────────── -->
              <div class="field-group">
                <label class="field-label">
                  الملاحظات والتعليقات
                  <span v-if="form.decision && form.decision !== 'approved'" class="text-error">*</span>
                  <span v-else class="text-base-content/40 font-normal text-xs">(اختياري)</span>
                </label>
                <textarea v-model="form.comment"
                  class="textarea textarea-bordered w-full h-28 text-sm leading-relaxed resize-none"
                  placeholder="أدخل ملاحظاتك وتعليقاتك هنا…"></textarea>
              </div>

              <!-- ── Review checklist upload ─────────────────────────────── -->
              <div class="field-group">
                <label class="field-label">
                  رفع قائمة تدقيق المراجعة المعبأة
                  <span v-if="requiresDocument" class="text-error">*</span>
                  <span v-else class="text-base-content/40 font-normal text-xs">(اختياري)</span>
                </label>
                <p class="text-xs text-base-content/50 mb-3">
                  <span v-if="requiresDocument" class="text-amber-600 font-bold">
                    ⚠ مطلوب عند الموافقة أو الرفض —
                  </span>
                  ارفع النموذج بعد تعبئته (PDF أو Word، الحد الأقصى 4 MB).
                </p>

                <!-- Drop zone -->
                <label class="upload-zone"
                  :class="{ 'upload-zone--active': isDragOver, 'upload-zone--filled': form.reviewDocument }"
                  @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false"
                  @drop.prevent="handleDrop">
                  <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" class="sr-only"
                    @change="handleFileChange" />

                  <template v-if="!form.reviewDocument">
                    <div class="upload-zone__placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/25 mb-3" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="text-sm font-bold text-base-content/60">اسحب وأفلت الملف هنا</p>
                      <p class="text-xs text-base-content/40 mt-1">أو <span class="text-primary font-bold">اضغط
                          للاختيار</span></p>
                      <p class="text-xs text-base-content/30 mt-2">PDF · DOC · DOCX — الحد الأقصى 4 MB</p>
                    </div>
                  </template>

                  <template v-else>
                    <div class="upload-zone__file-preview">
                      <div class="upload-zone__file-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0 text-right">
                        <p class="text-sm font-bold text-base-content truncate">{{ form.reviewDocument.name }}</p>
                        <p class="text-xs text-base-content/50">{{ formatFileSize(form.reviewDocument.size) }}</p>
                      </div>
                      <button type="button" class="upload-zone__remove-btn" @click.prevent="removeFile">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </template>
                </label>

                <p v-if="fileError" class="text-xs text-error mt-2 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i> {{ fileError }}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <Transition name="fade-up">
                <div v-if="submitSuccess" class="modal-feedback modal-feedback--success">
                  <i class="fa-solid fa-check-circle"></i> تم حفظ القرار بنجاح! جاري التحويل…
                </div>
                <div v-else-if="submitError" class="modal-feedback modal-feedback--error">
                  <i class="fa-solid fa-circle-exclamation"></i> {{ submitError }}
                </div>
              </Transition>

              <div class="flex gap-3 justify-end">
                <button class="btn btn-outline border-2 px-6" @click="closeModal">إلغاء</button>
                <button class="btn btn-primary px-8 font-bold gap-2" :disabled="isSubmitting || !isFormValid"
                  @click="submit">
                  <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  حفظ القرار
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReviewStore } from '@/store/reviews/index';
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

const applicationId = route.params.id;

// ── Form & UI state ────────────────────────────────────────────────────────
const form = ref({ decision: '', comment: '', reviewDocument: null });
const isSubmitting = ref(false);
const submitError = ref('');
const submitSuccess = ref(false);
const showModal = ref(false);
const isDragOver = ref(false);
const fileError = ref('');
const fileInput = ref(null);

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await reviewStore.fetchReviewDetails(applicationId);
  const review = reviewStore.currentReviewDetails;
  if (review?.decision && review.decision !== 'pending') {
    form.value.decision = review.decision;
  }
});

// ── Computed ───────────────────────────────────────────────────────────────
const app = computed(() => reviewStore.currentReviewDetails?.application || {});
const comments = computed(() => reviewStore.currentReviewDetails?.comments || []);


const checklistTemplateUrl = computed(
  () => reviewStore.currentReviewDetails?.checklist_template_url ?? null
);



const isBlinded = computed(() =>
  app.value.is_blinded || app.value.principal_investigator === 'معلومات محجوبة'
);

const coInvestigators = computed(() => {
  if (!app.value.co_investigators) return [];
  try {
    const parsed = JSON.parse(app.value.co_investigators);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
});

const isReadonly = computed(() => app.value.current_stage !== 'under_review');


const requiresDocument = computed(() =>
  ['approved', 'rejected'].includes(form.value.decision)
);

const isFormValid = computed(() => {
  if (!form.value.decision) return false;
  if (['needs_modification', 'rejected'].includes(form.value.decision) && !form.value.comment.trim()) return false;
  if (requiresDocument.value && !form.value.reviewDocument) return false;
  return true;
});

// ── Decision options ───────────────────────────────────────────────────────
const decisionOptions = [
  {
    value: 'approved',
    label: 'موافقة',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
           </svg>`,
  },
  {
    value: 'needs_modification',
    label: 'طلب تعديل',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
           </svg>`,
  },
  {
    value: 'rejected',
    label: 'رفض',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
           </svg>`,
  },
];

// ── Modal ──────────────────────────────────────────────────────────────────
const openDecisionModal = () => {
  submitError.value = '';
  submitSuccess.value = false;
  showModal.value = true;
};
const closeModal = () => { if (!isSubmitting.value) showModal.value = false; };

// ── File handling ──────────────────────────────────────────────────────────
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_BYTES = 4 * 1024 * 1024;

const validateFile = (file) => {
  const extOk = /\.(pdf|doc|docx)$/i.test(file.name);
  if (!ALLOWED_MIME.includes(file.type) && !extOk) {
    fileError.value = 'نوع الملف غير مدعوم. يُسمح فقط بـ PDF أو DOC أو DOCX.';
    return false;
  }
  if (file.size > MAX_BYTES) {
    fileError.value = 'حجم الملف يتجاوز الحد الأقصى (4 MB).';
    return false;
  }
  fileError.value = '';
  return true;
};

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (file && validateFile(file)) form.value.reviewDocument = file;
};

const handleDrop = (e) => {
  isDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file && validateFile(file)) form.value.reviewDocument = file;
};

const removeFile = () => {
  form.value.reviewDocument = null;
  fileError.value = '';
  if (fileInput.value) fileInput.value.value = '';
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// ── Submit ─────────────────────────────────────────────────────────────────
const submit = async () => {
  submitError.value = '';
  isSubmitting.value = true;

  const payload = new FormData();
  payload.append('decision', form.value.decision);
  if (form.value.comment?.trim()) payload.append('comment', form.value.comment.trim());
  if (form.value.reviewDocument) payload.append('review_document', form.value.reviewDocument);

  const result = await reviewStore.submitDecision(applicationId, payload);
  isSubmitting.value = false;

  if (result.success) {
    submitSuccess.value = true;
    await reviewStore.fetchReviewDetails(applicationId);
    setTimeout(() => {
      showModal.value = false;
      router.push({ name: 'AssignedResearches' });
    }, 1600);
  } else {
    submitError.value = result.message || 'حدث خطأ أثناء الحفظ';
  }
};

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try { return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' }); }
  catch { return dateStr; }
};

const docMeta = {
  'protocol_review_app': { label: 'طلب مراجعة بروتوكول بحثى', color: '#D500F9', textColor: '#fff' },
  'oral_presentaion': { label: 'العرض التقديمى الشفهى للبروتوكول البحثى', color: '#FF6D00', textColor: '#fff' },
  'pi_consent': { label: 'اقرار الباحث الرئيسى', color: '#00BCD4', textColor: '#000' },
  'research_procedures_approval': { label: 'نموذج قرار الموافقة على الاجراءات البحثية', color: '#00E676', textColor: '#000' },
  'conflict_of_interest': { label: 'نموذج عدم تعارض المصالح', color: '#FF1744', textColor: '#fff' },
  'patient_consent': { label: 'نموذج الموافقة المستنيرة للمريض', color: '#F50057', textColor: '#fff' },
  'research_alignment_with_research_plan': { label: 'نموذج تقرير توافق الابحاث مع الخطة البحثية', color: '#2979FF', textColor: '#fff' },
  'research_protocol': { label: 'البروتوكول البحثى', color: '#FFEA00', textColor: '#000' },
};

const getDocMeta = (type) => docMeta[type] || { label: 'مستند: ' + type, color: '#111827', textColor: '#fff' };
const docIconStyle = (type) => { const m = getDocMeta(type); return `background-color: ${m.color}; color: ${m.textColor};`; };

const docUrl = (filePath) => {
  const base = import.meta.env.VITE_BACKEND_SERVER?.replace('/api', '') || '';
  return `${base}/storage/${filePath}`;
};

const downloadDoc = (url, filePath) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', (filePath ?? url).split('/').pop() || 'document');
  link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
/* ── Info cells ─────────────────────────────────────────── */
.info-cell {
  background: linear-gradient(to bottom, #f8fafc, #fff);
  padding: 1rem;
  border-radius: .5rem;
  border: 1px solid #e2e8f0;
}

.info-cell__label {
  display: block;
  font-size: .75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: .5rem;
  letter-spacing: .04em;
}

.serial-badge {
  display: inline-block;
  background-color: oklch(35% 0.02 245);
  color: var(--color-neutral-content);
  font-weight: 800;
  font-size: .85rem;
  padding: .25rem .75rem;
  border-radius: .375rem;
}

.co-tag {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  padding: .35rem .75rem;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  font-size: .85rem;
  font-weight: 700;
}

/* ── Status banners ─────────────────────────────────────── */
.status-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: .75rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .12);
  margin-bottom: 1.5rem;
}

.status-banner--approved {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: #fff;
}

.status-banner--rejected {
  background: linear-gradient(135deg, #cf0f2c, #c42817);
  color: #fff;
}

.status-banner__icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, .2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Section icon wraps ─────────────────────────────────── */
.section-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}

.section-icon-wrap--blue {
  background: #2979FF;
}

.section-icon-wrap--teal {
  background: #00897B;
}

/* ── Document grid ──────────────────────────────────────── */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  transition: box-shadow .2s, transform .2s;
}

.doc-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, .08);
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
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  font-weight: 700;
  font-size: .88rem;
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

.doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: .78rem;
  font-weight: 700;
  text-decoration: none;
  transition: opacity .2s;
}

.doc-btn--view {
  background: var(--color-primary);
  color: #fff;
}

.doc-btn--view:hover {
  opacity: .85;
}

.doc-btn--dl {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.doc-btn--dl:hover {
  background: #e2e8f0;
}

/* ── Empty state ────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.empty-state__icon {
  background: rgba(0, 0, 0, .04);
  padding: 1.5rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
}

/* ── Reviewer uploaded checklist section ────────────────── */
.review-doc-section {
  background: linear-gradient(135deg, #f0fdfa, #e6fffa);
  border: 1px solid #99f6e4;
  border-radius: 1rem;
  overflow: hidden;
}

.review-doc-section__header {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: 1.125rem 1.5rem;
  border-bottom: 1px solid #99f6e4;
  background: rgba(255, 255, 255, .5);
}

.review-doc-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

.review-doc-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #00897B, #26a69a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Decision badges ────────────────────────────────────── */
.decision-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: .85rem;
  font-weight: 700;
}

.decision-badge--pending {
  background: #e5e7eb;
  color: #6b7280;
}

.decision-badge--approved {
  background: #d4edda;
  color: #155724;
}

.decision-badge--rejected {
  background: #f8d7da;
  color: #721c24;
}

.decision-badge--modify {
  background: #fdf2e9;
  color: #b9770e;
}

/* ── Timeline ───────────────────────────────────────────── */
.timeline-list {
  padding-right: 1.5rem;
  border-right: 3px solid #e5e7eb;
  max-height: 22rem;
  overflow-y: auto;
  padding-top: .5rem;
  padding-bottom: .5rem;
}

.timeline-item {
  position: relative;
  margin-bottom: 1rem;
}

.timeline-dot {
  position: absolute;
  right: -1.875rem;
  top: 1.25rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.timeline-dot--approved {
  background: var(--color-primary);
}

.timeline-dot--rejected {
  background: #ef4444;
}

.timeline-dot--modify {
  background: #f59e0b;
}

.timeline-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: .75rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
  transition: box-shadow .2s;
}

.timeline-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, .08);
}

/* ── Modal overlay & panel ──────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, .55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-panel {
  background: #fff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, .2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 92vh;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to left, #f8faff, #fff);
  flex-shrink: 0;
}

.modal-header__icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary), oklch(55% .18 250));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-close-btn {
  margin-right: auto;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .15s, color .15s;
}

.modal-close-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

/* ── IRB checklist download banner ─────────────────────── */
.checklist-banner {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #6ee7b7;
  border-radius: .875rem;
}

.checklist-banner__icon {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checklist-banner__btn {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  padding: .5rem 1rem;
  border-radius: 8px;
  background: #059669;
  color: #fff;
  font-size: .82rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: background .15s;
  flex-shrink: 0;
}

.checklist-banner__btn:hover {
  background: #047857;
}

/* ── Form fields ────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: .82rem;
  font-weight: 800;
  margin-bottom: .5rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: .25rem;
  flex-wrap: wrap;
}

/* ── Decision cards ─────────────────────────────────────── */
.decision-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.decision-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: .875rem .5rem;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  background: #f8fafc;
  cursor: pointer;
  font-size: .82rem;
  font-weight: 700;
  color: #64748b;
  transition: all .18s;
}

.decision-option:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.decision-option--approved.decision-option--selected {
  border-color: #16a34a;
  background: #f0fdf4;
  color: #15803d;
}

.decision-option--rejected.decision-option--selected {
  border-color: #dc2626;
  background: #fef2f2;
  color: #b91c1c;
}

.decision-option--needs_modification.decision-option--selected {
  border-color: #d97706;
  background: #fffbeb;
  color: #b45309;
}

.decision-option__icon {
  display: flex;
}

/* ── Upload zone ────────────────────────────────────────── */
.upload-zone {
  display: block;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all .2s;
  background: #fafafa;
  overflow: hidden;
}

.upload-zone:hover,
.upload-zone--active {
  border-color: var(--color-primary);
  background: #f0f4ff;
}

.upload-zone--filled {
  border-style: solid;
  border-color: #16a34a;
  background: #f0fdf4;
}

.upload-zone__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
}

.upload-zone__file-preview {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: 1rem 1.25rem;
}

.upload-zone__file-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.upload-zone__remove-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .15s;
  flex-shrink: 0;
}

.upload-zone__remove-btn:hover {
  background: #fecaca;
}

/* ── Modal feedback ─────────────────────────────────────── */
.modal-feedback {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .625rem 1rem;
  border-radius: 8px;
  font-size: .85rem;
  font-weight: 700;
}

.modal-feedback--success {
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  color: #065f46;
}

.modal-feedback--error {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
}

/* ── Transitions ────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .2s, transform .2s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(.97);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity .2s, transform .2s;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>