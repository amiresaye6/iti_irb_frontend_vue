<!-- this is a temp page, not a functional one, if you have to delete it , tell me first and do it  -->



<template>
    <div>
        <!-- Hero Section -->
        <div class="hero bg-base-200 py-20">
            <div class="hero-content text-center">
                <div class="max-w-2xl">
                    <h1 class="text-5xl font-bold text-primary">نظام إدارة الموافقات البحثية</h1>
                    <p class="py-6 text-lg">
                        المنصة الرقمية المتكاملة لتقديم وتقييم الأبحاث العلمية (IRB).
                        قدم بحثك، تابع حالته لحظة بلحظة، وتواصل مع لجان المراجعة في بيئة آمنة وسريعة.
                    </p>
                    <div class="flex gap-4 justify-center">
                        <RouterLink to="/login" class="btn btn-primary">ابدأ الآن</RouterLink>
                        <RouterLink to="/about" class="btn btn-outline">تعرف على النظام</RouterLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="container mx-auto px-4 py-16">
            <h2 class="text-3xl font-bold text-center mb-10">لماذا تستخدم نظامنا؟</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div class="card bg-base-100 shadow-xl border border-base-300">
                    <div class="card-body items-center text-center">
                        <h2 class="card-title text-secondary">تقديم إلكتروني بالكامل</h2>
                        <p>لا حاجة للورق بعد اليوم، ارفع ملفاتك ونماذجك بضغطة زر.</p>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl border border-base-300">
                    <div class="card-body items-center text-center">
                        <h2 class="card-title text-success">متابعة فورية</h2>
                        <p>نظام إشعارات يخبرك بكل تحديث على حالة طلبك من لجنة المراجعة.</p>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-xl border border-base-300">
                    <div class="card-body items-center text-center">
                        <h2 class="card-title text-info">أمان وسرية</h2>
                        <p>تشفير كامل لبيانات الباحثين ومعلومات المشاريع البحثية.</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
</script>