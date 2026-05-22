<!-- this is a temp page, not a functional one, if you have to delete it , tell me first and do it  -->




<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h1 class="text-3xl font-bold text-base-content">مرحباً يا أمير 👋</h1>
                <p class="text-base-content/70 mt-1">إليك ملخص الأبحاث والموافقات الخاصة بك اليوم.</p>
            </div>
            <button class="btn btn-primary">
                تقديم طلب جديد +
            </button>
        </div>

        <!-- Stats -->
        <div class="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-300 bg-base-100">
            <div class="stat">
                <div class="stat-title">إجمالي الأبحاث</div>
                <div class="stat-value text-primary">24</div>
                <div class="stat-desc">بزيادة 3 عن الشهر الماضي</div>
            </div>

            <div class="stat">
                <div class="stat-title">قيد المراجعة</div>
                <div class="stat-value text-warning">8</div>
                <div class="stat-desc text-warning">لجنة الأخلاقيات</div>
            </div>

            <div class="stat">
                <div class="stat-title">الموافقات المعتمدة</div>
                <div class="stat-value text-success">15</div>
                <div class="stat-desc">مكتملة وجاهزة للطباعة</div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="card bg-base-100 shadow border border-base-300">
            <div class="card-body p-0 overflow-x-auto">
                <table class="table table-zebra w-full text-start">
                    <thead class="bg-base-200 text-base-content text-sm">
                        <tr>
                            <th>رقم الطلب</th>
                            <th>عنوان البحث</th>
                            <th>تاريخ التقديم</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="font-mono">IRB-26-001</td>
                            <td class="font-medium">تأثير الذكاء الاصطناعي على التعليم الطبي</td>
                            <td>15 مايو 2026</td>
                            <td><span class="badge badge-warning badge-sm">قيد المراجعة</span></td>
                            <td><button class="btn btn-ghost btn-xs">التفاصيل</button></td>
                        </tr>
                        <tr>
                            <td class="font-mono">IRB-26-002</td>
                            <td class="font-medium">دراسة سريرية لفعالية العقار X</td>
                            <td>10 مايو 2026</td>
                            <td><span class="badge badge-success badge-sm">مقبول</span></td>
                            <td><button class="btn btn-ghost btn-xs">التفاصيل</button></td>
                        </tr>
                        <tr>
                            <td class="font-mono">IRB-26-003</td>
                            <td class="font-medium">تحليل بيانات المرضى في الرعاية المركزة</td>
                            <td>02 مايو 2026</td>
                            <td><span class="badge badge-error badge-sm">مرفوض</span></td>
                            <td><button class="btn btn-ghost btn-xs">التفاصيل</button></td>
                        </tr>
                        <tr>
                            <td class="font-mono">IRB-26-004</td>
                            <td class="font-medium">استبيان الصحة النفسية لطلاب الجامعات</td>
                            <td>28 أبريل 2026</td>
                            <td><span class="badge badge-info badge-sm">مطلوب تعديل</span></td>
                            <td><button class="btn btn-ghost btn-xs">التفاصيل</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>