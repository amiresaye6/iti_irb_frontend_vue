<template>
  <div class="p-6 min-h-screen" dir="rtl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
          </svg>
          لوحة إدارة المدفوعات
        </h1>
        <p class="text-gray-500 mt-2 text-sm">
          نظرة شاملة على جميع المدفوعات والإحصائيات المالية للنظام
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-semibold">إجمالي الإيرادات</p>
          <p class="text-2xl font-black text-gray-800" dir="ltr">{{ formatAmount(stats.total_revenue) }} <span
              class="text-xs font-normal text-gray-400">EGP</span></p>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-semibold">مدفوعات مكتملة</p>
          <p class="text-2xl font-black text-gray-800">{{ stats.completed_count || 0 }}</p>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-semibold">مدفوعات معلقة</p>
          <p class="text-2xl font-black text-gray-800">{{ stats.pending_count || 0 }}</p>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-semibold">مدفوعات فاشلة</p>
          <p class="text-2xl font-black text-gray-800">{{ stats.failed_count || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-gray-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          البحث والتصفية
        </h3>
        <button @click="resetFilters" class="btn btn-sm btn-ghost text-error gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          إعادة ضبط
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="form-control w-full">
          <label class="label"><span class="label-text font-semibold">بحث سريع</span></label>
          <div class="relative">
            <input type="text" v-model="filters.search" @input="debouncedFetch"
              placeholder="اسم الطالب، الرقم التسلسلي..."
              class="input input-bordered w-full pr-10 focus:border-primary focus:ring-1 focus:ring-primary" />
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 absolute right-3 top-3.5 text-gray-400" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        <!-- Status -->
        <div class="form-control w-full">
          <label class="label"><span class="label-text font-semibold">حالة الدفع</span></label>
          <select v-model="filters.status" @change="fetchPayments" class="select select-bordered w-full">
            <option value="">الكل</option>
            <option value="completed">مكتمل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="failed">فشل</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="form-control w-full">
          <label class="label"><span class="label-text font-semibold">ترتيب حسب</span></label>
          <select v-model="filters.sort_by" @change="fetchPayments" class="select select-bordered w-full">
            <option value="created_at">تاريخ الإضافة</option>
            <option value="paid_at">تاريخ الدفع</option>
            <option value="amount">المبلغ</option>
            <option value="student_name">اسم الطالب</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div class="form-control w-full">
          <label class="label"><span class="label-text font-semibold">اتجاه الترتيب</span></label>
          <select v-model="filters.sort_order" @change="fetchPayments" class="select select-bordered w-full">
            <option value="desc">تنازلي</option>
            <option value="asc">تصاعدي</option>
          </select>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="collapse collapse-arrow bg-gray-50 border border-gray-100 rounded-xl mt-4">
        <input type="checkbox" />
        <div class="collapse-title text-sm font-semibold text-gray-600 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
          فلاتر متقدمة (المبلغ والتاريخ)
        </div>
        <div class="collapse-content">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <div class="form-control w-full">
              <label class="label"><span class="label-text text-xs">من مبلغ</span></label>
              <input type="number" v-model="filters.min_amount" @change="fetchPayments"
                class="input input-sm input-bordered w-full" placeholder="0" />
            </div>
            <div class="form-control w-full">
              <label class="label"><span class="label-text text-xs">إلى مبلغ</span></label>
              <input type="number" v-model="filters.max_amount" @change="fetchPayments"
                class="input input-sm input-bordered w-full" placeholder="10000" />
            </div>
            <div class="form-control w-full">
              <label class="label"><span class="label-text text-xs">من تاريخ</span></label>
              <input type="date" v-model="filters.start_date" @change="fetchPayments"
                class="input input-sm input-bordered w-full" />
            </div>
            <div class="form-control w-full">
              <label class="label"><span class="label-text text-xs">إلى تاريخ</span></label>
              <input type="date" v-model="filters.end_date" @change="fetchPayments"
                class="input input-sm input-bordered w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Count -->
    <div
      class="flex items-center gap-2 mb-4 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm w-max font-semibold border border-blue-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      <span>إجمالي العمليات المطابقة:</span>
      <span class="font-black">{{ pagination.total }}</span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading"
      class="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-error shadow-lg mb-8 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <div>
        <h3 class="font-bold">حدث خطأ</h3>
        <div class="text-xs">{{ error.message || 'فشل في جلب البيانات' }}</div>
      </div>
      <button class="btn btn-sm" @click="fetchPayments">إعادة المحاولة</button>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead class="bg-gray-50 text-gray-700">
            <tr>
              <th>الباحث</th>
              <th>الملف</th>
              <th>المرحلة</th>
              <th>المبلغ</th>
              <th>المزود</th>
              <th>المرجع</th>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th class="text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!payments.length">
              <td colspan="9">
                <div class="flex flex-col items-center justify-center py-10 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mb-3 text-gray-300" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                  </svg>
                  <p class="font-semibold text-lg">لا توجد مدفوعات مطابقة</p>
                </div>
              </td>
            </tr>
            <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50/50 transition-colors">
              <!-- Student -->
              <td>
                <div class="flex flex-col gap-0.5">
                  <span class="font-semibold text-sm">{{ payment.application?.student?.full_name || '---' }}</span>
                  <span class="text-xs text-gray-400" dir="ltr">{{ payment.application?.student?.email || '' }}</span>
                </div>
              </td>
              <!-- Application -->
              <td>
                <div class="flex flex-col gap-1">
                  <span class="badge badge-primary badge-outline badge-sm font-mono">{{
                    payment.application?.serial_number || '---' }}</span>
                  <span class="font-semibold text-sm line-clamp-1 max-w-45" :title="payment.application?.title">
                    {{ payment.application?.title || 'غير معروف' }}
                  </span>
                </div>
              </td>
              <!-- Phase -->
              <td>
                <span class="badge badge-sm"
                  :class="payment.phase === 'initial' ? 'badge-info badge-outline' : 'badge-secondary badge-outline'">
                  {{ payment.phase === 'initial' ? 'رسوم مبدئية' : 'رسوم عينة' }}
                </span>
              </td>
              <!-- Amount -->
              <td>
                <div class="font-black text-gray-800" dir="ltr">
                  {{ formatAmount(payment.amount) }} <span class="text-xs font-normal text-gray-400">EGP</span>
                </div>
              </td>
              <!-- Provider -->
              <td>
                <span class="text-sm text-gray-600">{{ payment.provider || '---' }}</span>
              </td>
              <!-- Reference -->
              <td dir="ltr" class="text-right">
                <span v-if="payment.gateway_transaction_id || payment.transaction_reference"
                  class="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  {{ payment.gateway_transaction_id || payment.transaction_reference }}
                </span>
                <span v-else class="text-gray-400">---</span>
              </td>
              <!-- Date -->
              <td>
                <div class="flex flex-col text-sm text-gray-600">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 inline-block ml-1 text-gray-400"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    {{ formatDate(payment.paid_at || payment.created_at) }}
                  </span>
                  <span class="text-xs mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline-block ml-1 text-gray-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {{ formatTime(payment.paid_at || payment.created_at) }}
                  </span>
                </div>
              </td>
              <!-- Status -->
              <td>
                <span class="badge gap-1 border-0" :class="getStatusClass(payment.status)">
                  <svg v-if="payment.status === 'completed' || payment.status === 'paid'"
                    xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <svg v-else-if="payment.status === 'pending'" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
              <!-- Actions -->
              <td>
                <div class="flex justify-center gap-2">
                  <router-link v-if="payment.status === 'completed' || payment.status === 'paid'"
                    :to="`/student/payments/receipt/${payment.id}`"
                    class="btn btn-sm btn-circle btn-ghost text-primary tooltip" data-tip="عرض الإيصال">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </router-link>
                  <span v-else class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    غير متاح
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50"
        v-if="pagination.total > 0">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">عرض</span>
          <select v-model="filters.per_page" @change="fetchPayments" class="select select-bordered select-sm w-20">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="join">
          <button class="join-item btn btn-sm" :disabled="pagination.page === 1"
            @click="changePage(pagination.page - 1)">
            السابق
          </button>
          <button class="join-item btn btn-sm btn-active pointer-events-none">
            صفحة {{ pagination.page }}
          </button>
          <button class="join-item btn btn-sm" :disabled="pagination.page * pagination.per_page >= pagination.total"
            @click="changePage(pagination.page + 1)">
            التالي
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { paymentServices } from '@/services/paymentServices';

const { getAdminDashboard } = paymentServices();

const payments = ref([]);
const isLoading = ref(true);
const error = ref(null);
const stats = ref({
  total_revenue: 0,
  completed_count: 0,
  pending_count: 0,
  failed_count: 0
});

const filters = ref({
  search: '',
  status: '',
  min_amount: '',
  max_amount: '',
  start_date: '',
  end_date: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  page: 1,
  per_page: 10
});

const pagination = ref({ total: 0, page: 1, per_page: 10 });

let debounceTimeout = null;

const fetchPayments = async () => {
  error.value = null;
  const res = await getAdminDashboard(filters.value, (loading) => isLoading.value = loading, (err) => {
    if (err) error.value = err;
  });
  if (res && res.status) {
    payments.value = res.data?.payments || [];
    if (res.data?.stats) {
      stats.value = res.data.stats;
    }
    if (res.pagination) {
      pagination.value = res.pagination;
    }
  }
};

const debouncedFetch = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filters.value.page = 1;
    fetchPayments();
  }, 500);
};

const resetFilters = () => {
  filters.value = {
    search: '', status: '', min_amount: '', max_amount: '',
    start_date: '', end_date: '', sort_by: 'created_at',
    sort_order: 'desc', page: 1, per_page: 10
  };
  fetchPayments();
};

const changePage = (newPage) => {
  filters.value.page = newPage;
  fetchPayments();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
};

const getStatusClass = (s) => {
  if (s === 'completed' || s === 'paid') return 'bg-green-100 text-green-700';
  if (s === 'pending') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

const getStatusLabel = (s) => {
  if (s === 'completed' || s === 'paid') return 'مكتمل';
  if (s === 'pending') return 'قيد الانتظار';
  return 'فشل';
};

onMounted(() => {
  fetchPayments();
});
</script>
