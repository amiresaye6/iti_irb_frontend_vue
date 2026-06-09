<template>
  <div dir="rtl" class="home-page font-['Cairo']">
    <!-- ========== 1. HERO SECTION ========== -->
    <section id="hero" class="relative min-h-[90vh] flex items-center justify-center bg-neutral overflow-hidden">
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-linear-to-b from-neutral/80 via-neutral to-neutral/95 z-1"></div>

      <!-- Animated floating glow circle -->
      <div
        class="absolute w-100 h-100 rounded-full bg-accent/20 blur-[120px] z-2"
        style="animation: float 6s ease-in-out infinite; top: 15%; left: 20%;"
      ></div>
      <div
        class="absolute w-62.5 h-62.5 rounded-full bg-primary/15 blur-[100px] z-2"
        style="animation: float 8s ease-in-out infinite 2s; bottom: 20%; right: 15%;"
      ></div>

      <!-- SVG dots pattern overlay -->
      <svg class="absolute inset-0 w-full h-full z-2 opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      <!-- Hero Content -->
      <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          النظام الرقمي الذكي لإدارة
          <br />
          <span class="text-primary">الموافقات البحثية</span>
        </h1>
        <p class="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          منصة متكاملة لإدارة البحوث الطبية تشمل المراجعة العمياء، والدفع الإلكتروني،
          وحساب حجم العينات، وإصدار الشهادات الرقمية — كل ذلك في نظام واحد آمن وشفاف.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <RouterLink
            to="/register"
            class="btn btn-primary btn-lg shadow-lg shadow-primary/30 text-base font-bold"
          >
            إنشاء حساب كباحث
          </RouterLink>
          <a
            href="#about"
            class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-neutral text-base font-bold"
          >
            تعرف علينا
          </a>
        </div>
      </div>
    </section>

    <!-- ========== 2. ABOUT SECTION ========== -->
    <section id="about" class="bg-base-100 py-24 px-6">
      <div
        class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16"
        data-reveal="fade-up"
      >
        <!-- Text Content -->
        <div class="flex-1 order-2 lg:order-1">
          <h2 class="text-3xl font-extrabold text-neutral mb-6 leading-snug">
            عن لجنة أخلاقيات البحث العلمي (IRB)
          </h2>
          <p class="text-base-content/70 text-lg leading-relaxed mb-4">
            لجنة أخلاقيات البحث العلمي المؤسسية (IRB) هي الجهة المسؤولة عن حماية حقوق
            المشاركين في البحوث الطبية والعلمية، والتأكد من أن جميع الدراسات تُجرى وفقًا
            لأعلى المعايير الأخلاقية والعلمية المعتمدة دوليًا.
          </p>
          <p class="text-base-content/70 text-lg leading-relaxed">
            يهدف هذا النظام الرقمي إلى تسهيل عملية تقديم ومراجعة واعتماد البروتوكولات
            البحثية بشكل إلكتروني كامل، مع ضمان الشفافية والجودة في كل مرحلة من مراحل
            المراجعة — من التقديم وحتى إصدار شهادة الموافقة.
          </p>
        </div>

        <!-- Decorative Icon -->
        <div class="shrink-0 order-1 lg:order-2">
          <div class="relative w-56 h-56 flex items-center justify-center">
            <div class="absolute inset-0 bg-accent/10 rounded-full"></div>
            <svg class="w-28 h-28 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.72 17.72l1.06 1.06M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.72 6.28l1.06-1.06" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9l-3 6h6l-3-6z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15l-1.5 3h9L15 15" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 12a6.75 6.75 0 1113.5 0 6.75 6.75 0 01-13.5 0z" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 3. STATS SECTION ========== -->
    <section id="stats" class="relative bg-neutral py-24 px-6 overflow-hidden">
      <!-- Dot pattern overlay -->
      <svg class="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="stats-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stats-dots)" />
      </svg>

      <div class="relative z-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        <!-- Stat 1: بحث معتمد -->
        <div class="text-center" data-reveal="fade-up">
          <div class="flex justify-center mb-4">
            <svg class="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <div class="text-4xl md:text-5xl font-extrabold text-white mb-2">
            <span class="stat-prefix">+</span>
            <span data-counter-target="150">150</span>
          </div>
          <p class="text-white/60 text-sm md:text-base font-medium">بحث معتمد</p>
        </div>

        <!-- Stat 2: باحث مسجل -->
        <div class="text-center" data-reveal="fade-up" data-reveal-delay="100">
          <div class="flex justify-center mb-4">
            <svg class="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div class="text-4xl md:text-5xl font-extrabold text-white mb-2">
            <span class="stat-prefix">+</span>
            <span data-counter-target="500">500</span>
          </div>
          <p class="text-white/60 text-sm md:text-base font-medium">باحث مسجل</p>
        </div>

        <!-- Stat 3: مراجع علمي -->
        <div class="text-center" data-reveal="fade-up" data-reveal-delay="200">
          <div class="flex justify-center mb-4">
            <svg class="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l2.25 2.25L15 11.25" />
            </svg>
          </div>
          <div class="text-4xl md:text-5xl font-extrabold text-white mb-2">
            <span class="stat-prefix">+</span>
            <span data-counter-target="25">25</span>
          </div>
          <p class="text-white/60 text-sm md:text-base font-medium">مراجع علمي</p>
        </div>

        <!-- Stat 4: إدارة رقمية % -->
        <div class="text-center" data-reveal="fade-up" data-reveal-delay="300">
          <div class="flex justify-center mb-4">
            <svg class="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="text-4xl md:text-5xl font-extrabold text-white mb-2">
            <span data-counter-target="100">100</span><span class="text-primary">%</span>
          </div>
          <p class="text-white/60 text-sm md:text-base font-medium">إدارة رقمية</p>
        </div>
      </div>
    </section>

    <!-- ========== 4. FEATURES SECTION ========== -->
    <section id="features" class="bg-base-200 py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16" data-reveal="fade-up">
          <h2 class="text-3xl md:text-4xl font-extrabold text-neutral mb-4">مميزات النظام</h2>
          <p class="text-base-content/60 text-lg max-w-2xl mx-auto">
            نظام متكامل يوفر أدوات متقدمة لتسهيل وتسريع عملية الموافقة على البحوث الطبية
          </p>
        </div>

        <!-- Features Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-reveal
          data-reveal-stagger="100"
        >
          <!-- Feature 1: دفع إلكتروني -->
          <div
            class="feature-card relative bg-base-100 rounded-2xl shadow-md border border-base-300 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary overflow-hidden"
            data-reveal-child
          >
            <div class="flex justify-center mb-5">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-neutral mb-3">دفع إلكتروني متكامل</h3>
            <p class="text-base-content/60 text-sm leading-relaxed">
              نظام دفع إلكتروني آمن عبر بوابة Paymob لسداد رسوم المراجعة واستلام الإيصالات الرقمية فوريًا.
            </p>
          </div>

          <!-- Feature 2: المراجعة العمياء -->
          <div
            class="feature-card relative bg-base-100 rounded-2xl shadow-md border border-base-300 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary overflow-hidden"
            data-reveal-child
          >
            <div class="flex justify-center mb-5">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-neutral mb-3">المراجعة العمياء</h3>
            <p class="text-base-content/60 text-sm leading-relaxed">
              نظام مراجعة علمية مجهولة الهوية يُخفي بيانات الباحث لضمان الحياد والنزاهة في التقييم.
            </p>
          </div>

          <!-- Feature 3: معالجة العينات -->
          <div
            class="feature-card relative bg-base-100 rounded-2xl shadow-md border border-base-300 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary overflow-hidden"
            data-reveal-child
          >
            <div class="flex justify-center mb-5">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-neutral mb-3">معالجة دقيقة للعينات</h3>
            <p class="text-base-content/60 text-sm leading-relaxed">
              أداة ذكية لحساب حجم العينة المطلوب بدقة علمية تتناسب مع طبيعة البحث ومنهجيته.
            </p>
          </div>

          <!-- Feature 4: شهادات رقمية -->
          <div
            class="feature-card relative bg-base-100 rounded-2xl shadow-md border border-base-300 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary overflow-hidden"
            data-reveal-child
          >
            <div class="flex justify-center mb-5">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 10.5h-1.5A3.375 3.375 0 007.5 14.25v4.5m6-12a3 3 0 11-6 0 3 3 0 016 0zm8.25 6a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-18 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-neutral mb-3">شهادات رقمية فورية</h3>
            <p class="text-base-content/60 text-sm leading-relaxed">
              إصدار شهادات موافقة بصيغة PDF فورية ومؤمّنة رقميًا فور اعتماد البحث من اللجنة.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 5. WORKFLOW SECTION ========== -->
    <section id="workflow" class="py-24 px-6 overflow-hidden relative border-t border-b border-white/5 bg-[#0a0f1d] text-white">
      <!-- Dynamic Ambient Glow -->
      <div 
        :class="['absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--tw-gradient-stops))] transition-all duration-1000 z-0 pointer-events-none', glowClass]"
      ></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-20" data-reveal="fade-up">
          <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-white">رحلة الموافقة البحثية</h2>
          <p class="text-lg max-w-2xl mx-auto text-white/60">
            تعرّف على المراحل التي يمر بها طلبك من إنشاء حساب الباحث وحتى الاعتماد النهائي وإصدار الشهادة
          </p>
        </div>

        <!-- Desktop & Mobile Alternating Timeline Layout -->
        <div class="relative flex flex-col gap-12 lg:gap-16">
          
          <!-- Dynamic vertical progress tracking line (Desktop only) -->
          <div class="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-white/10 rounded-full z-0 hidden lg:block">
            <div 
              class="bg-linear-to-b from-primary to-accent w-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-primary"
              :style="{ height: `${(activeStep / steps.length) * 100}%` }"
            ></div>
          </div>

          <!-- Steps looping -->
          <div 
            v-for="(step, i) in steps" 
            :key="step.index"
            :data-journey-step="step.index"
            class="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[50vh] lg:min-h-[55vh] z-10 group"
            data-reveal="fade-up"
            :data-reveal-delay="i * 50"
          >
            <!-- Timeline node dot (Desktop only, highlights when active) -->
            <div 
              class="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center font-bold text-sm z-20 transition-all duration-500 shadow-lg border"
              :class="activeStep === step.index 
                ? 'bg-primary border-primary text-primary-content scale-110 shadow-primary/30' 
                : activeStep > step.index 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-neutral border-white/10 text-white/50'"
            >
              <svg v-if="activeStep > step.index" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ step.index }}</span>
            </div>

            <!-- Column 1: Text Content / Card (Alternates sides on desktop) -->
            <div 
              class="w-full order-1 transition-all duration-500"
              :class="[
                i % 2 === 0 
                  ? 'lg:pl-16 lg:pr-0 lg:order-1' 
                  : 'lg:pr-16 lg:pl-0 lg:order-2',
                activeStep === step.index ? 'opacity-100' : 'opacity-55'
              ]"
            >
              <!-- Card Wrapper -->
              <div 
                class="border rounded-3xl p-6 lg:p-8 shadow-xl transition-all duration-500 backdrop-blur-md relative overflow-hidden text-right"
                :class="activeStep === step.index 
                  ? 'bg-white/10 border-white/20 text-white scale-[1.02] shadow-2xl shadow-primary/5' 
                  : 'bg-white/2 border-white/5 text-white/40'"
              >
                <!-- Step Badge -->
                <span :class="['inline-block px-3 py-1 rounded-full text-xs font-bold mb-4', step.badgeClass]">
                  {{ step.badge }}
                </span>

                <!-- Title -->
                <h3 class="text-xl md:text-2xl font-extrabold mb-3 flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-primary" v-if="activeStep === step.index"></span>
                  {{ step.title }}
                </h3>

                <!-- Description -->
                <p class="text-sm md:text-base leading-relaxed" :class="activeStep === step.index ? 'text-white/80' : 'text-white/40'">
                  {{ step.desc }}
                </p>
              </div>
            </div>

            <!-- Column 2: Mockup / Visual Card (Alternates sides on desktop) -->
            <div 
              class="w-full order-2 flex items-center justify-center transition-all duration-500"
              :class="i % 2 === 0 ? 'lg:pr-16 lg:pl-0 lg:order-2' : 'lg:pl-16 lg:pr-0 lg:order-1'"
            >
              <!-- Frame container for Mockups -->
              <div 
                class="relative w-full max-w-md h-72 lg:h-80 bg-white/5 backdrop-blur-md rounded-3xl border shadow-2xl p-6 overflow-hidden flex items-center justify-center transition-all duration-500"
                :class="activeStep === step.index 
                  ? 'border-white/20 scale-[1.03] opacity-100 bg-white/10' 
                  : 'border-white/5 scale-[0.97] opacity-60 bg-white/2'"
              >
                <!-- Glow Effect behind mockups -->
                <div class="absolute inset-0 bg-linear-to-tr from-primary/10 to-accent/10 opacity-10 z-0"></div>

                <!-- Mockup Contents based on step index -->
                <!-- Step 1: Account creation -->
                <div v-if="step.index === 1" class="w-full flex flex-col gap-4 text-white z-10">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span class="font-bold text-sm lg:text-base">إنشاء حساب الباحث</span>
                  </div>
                  <div class="w-full h-9 bg-white/5 rounded-xl border border-white/10 flex items-center px-4 text-xs text-white/40">الاسم الكامل: أحمد محمد...</div>
                  <div class="w-full h-9 bg-white/5 rounded-xl border border-white/10 flex items-center px-4 text-xs text-white/40">البريد الإلكتروني: researcher@iti.edu</div>
                  <div class="btn btn-primary btn-sm w-fit self-end shadow-md">تسجيل الحساب</div>
                </div>

                <!-- Step 2: Admin approval checklist -->
                <div v-else-if="step.index === 2" class="w-full flex flex-col gap-3 text-white z-10">
                  <div class="flex items-center gap-3 mb-1">
                    <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span class="font-bold text-sm lg:text-base">مراجعة وتفعيل الحساب</span>
                  </div>
                  <div class="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs lg:text-sm">
                    <span>التحقق من بطاقة الهوية</span>
                    <span class="text-xs text-emerald-400 font-bold flex items-center gap-1">✔ مكتمل</span>
                  </div>
                  <div class="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs lg:text-sm">
                    <span>مطابقة السيرة الذاتية</span>
                    <span class="text-xs text-emerald-400 font-bold flex items-center gap-1">✔ مكتمل</span>
                  </div>
                  <div class="btn btn-warning btn-sm w-full font-bold shadow-md">تفعيل الحساب الأكاديمي</div>
                </div>

                <!-- Step 3: Application submission document upload -->
                <div v-else-if="step.index === 3" class="w-full flex flex-col gap-4 text-white z-10">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <span class="font-bold text-sm lg:text-base">تقديم المقترح البحثي</span>
                  </div>
                  <div class="border border-dashed border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 bg-emerald-500/5 w-full">
                    <svg class="w-8 h-8 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-[10px] lg:text-xs text-emerald-300">research_protocol.pdf</span>
                    <div class="w-full bg-white/10 rounded-full h-1 mt-1">
                      <div class="bg-emerald-400 h-1 rounded-full animate-pulse" style="width: 100%;"></div>
                    </div>
                  </div>
                </div>

                <!-- Step 4: Admin assignment of reviewer -->
                <div v-else-if="step.index === 4" class="w-full flex flex-col gap-2.5 text-white z-10">
                  <div class="flex items-center gap-3 mb-1">
                    <div class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                      </svg>
                    </div>
                    <span class="font-bold text-sm lg:text-base">تعيين مراجع متخصص</span>
                  </div>
                  <div class="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">د. ع</div>
                    <div class="flex-1">
                      <div class="text-xs font-bold">أ.د. عادل إبراهيم</div>
                      <div class="text-[9px] text-white/50">تخصص: علم الأورام السريري</div>
                    </div>
                    <span class="px-2 py-0.5 rounded bg-indigo-500 text-[9px] font-bold">معيّن</span>
                  </div>
                  <div class="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/10 opacity-60">
                    <div class="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">د. م</div>
                    <div class="flex-1">
                      <div class="text-xs font-bold">أ.د. محمود خالد</div>
                      <div class="text-[9px] text-white/50">تخصص: أمراض باطنة</div>
                    </div>
                  </div>
                </div>

                <!-- Step 5: Blinded reviewer panel comments -->
                <div v-else-if="step.index === 5" class="w-full flex flex-col gap-2.5 text-white z-10">
                  <div class="flex items-center gap-3 mb-1">
                    <div class="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <span class="font-bold text-sm lg:text-base">تقييم المراجع العلمي</span>
                  </div>
                  <div class="p-2.5 bg-white/5 rounded-xl border border-white/10 relative w-full">
                    <div class="absolute top-2 left-2 rotate-12 border border-purple-500/40 text-[8px] px-1 py-0.5 rounded text-purple-400 uppercase font-bold tracking-wider">Conf. Review</div>
                    <div class="text-[10px] text-white/40 mb-1">اسم الباحث: <span class="blur-xs bg-white/15 px-3 rounded">مخفي</span></div>
                    <p class="text-xs italic text-purple-200">"الدراسة تتبع معايير السلامة وأهدافها العلمية واضحة وقابلة للقياس..."</p>
                  </div>
                  <div class="flex gap-2 justify-end mt-1 w-full">
                    <span class="btn btn-error btn-xs">رفض</span>
                    <span class="btn btn-success btn-xs text-white">قبول التقييم</span>
                  </div>
                </div>

                <!-- Step 6: Manager final approvals signature stamp -->
                <div v-else-if="step.index === 6" class="w-full flex flex-col gap-3 text-white z-10">
                  <div class="flex items-center gap-3 mb-1">
                    <div class="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z" />
                      </svg>
                    </div>
                    <span class="font-bold text-sm lg:text-base">قرار مدير اللجنة</span>
                  </div>
                  <div class="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center relative w-full">
                    <!-- Stamp Effect -->
                    <div class="absolute w-20 h-20 border-4 border-emerald-500/50 rounded-full flex items-center justify-center font-bold text-emerald-400 text-[10px] uppercase tracking-wider rotate-12 bg-neutral/90 shadow-xl select-none animate-pulse">
                      Approved
                    </div>
                    <div class="text-xs lg:text-sm font-bold mb-1">اعتماد مدير النظام</div>
                    <div class="text-[10px] text-white/50">بناءً على مراجعات وتقييم اللجنة العلمي</div>
                  </div>
                </div>

                <!-- Step 7: Fee payment screen (Paymob) -->
                <div v-else-if="step.index === 7" class="w-full flex flex-col gap-2.5 text-white z-10">
                  <div class="flex items-center gap-3 mb-1">
                    <div class="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <span class="font-bold text-sm lg:text-base">سداد رسوم المقترح</span>
                  </div>
                  <div class="bg-linear-to-br from-teal-900/40 to-neutral-900 border border-white/10 rounded-2xl p-3 flex flex-col gap-2.5 w-full">
                    <div class="flex justify-between items-center text-[10px] lg:text-xs">
                      <span class="text-white/60">رسوم المراجعة والاعتماد</span>
                      <span class="font-bold">500.00 EGP</span>
                    </div>
                    <div class="h-px bg-white/10"></div>
                    <div class="flex justify-between items-center text-xs lg:text-sm font-bold text-teal-300">
                      <span>الإجمالي المطلوب</span>
                      <span>500.00 EGP</span>
                    </div>
                    <div class="btn btn-teal btn-xs w-full font-bold shadow-md gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      سداد إلكتروني آمن
                    </div>
                  </div>
                </div>

                <!-- Step 8: Glowing verified certificate floating -->
                <div v-else-if="step.index === 8" class="w-full flex flex-col items-center justify-center text-white z-10 py-1.5">
                  <div class="relative w-36 h-48 bg-linear-to-b from-amber-500/10 to-neutral border-2 border-amber-500/40 rounded-xl shadow-2xl p-3.5 flex flex-col items-center justify-between text-center select-none rotate-6 hover:rotate-0 transition-transform duration-500 cursor-pointer animate-pulse-glow">
                    <div class="w-8 h-8 bg-white/10 rounded border border-white/10 flex items-center justify-center">
                      <svg class="w-6 h-6 text-white/40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2V15H5zm10-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-6-2h2v2h-2v-2z" />
                      </svg>
                    </div>
                    <div class="flex flex-col gap-0.5">
                      <div class="text-[8px] font-bold text-amber-400 uppercase tracking-widest">IRB Committee</div>
                      <div class="text-[6px] text-white/50">Official Study Approval</div>
                    </div>
                    <div class="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-amber-400 mt-2.5 animate-bounce">مبارك! تم إصدار الشهادة</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- ========== 6. DOWNLOAD REQUIREMENTS SECTION ========== -->
    <section id="download" class="py-20 px-6">
      <div
        class="max-w-6xl mx-auto bg-neutral text-white rounded-3xl p-10 md:p-16 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden"
        data-reveal="fade-up"
      >
        <!-- Text Content -->
        <div class="flex-1 relative z-10">
          <h2 class="text-3xl font-extrabold mb-4 leading-snug">
            حمّل دليل
            <span class="text-primary">متطلبات التقديم</span>
          </h2>
          <p class="text-white/60 text-lg leading-relaxed mb-8">
            يحتوي الدليل على جميع التعليمات والملفات والنماذج المطلوبة لتقديم
            البروتوكول البحثي بشكل صحيح ومكتمل. قم بتحميله والاطلاع عليه قبل البدء.
          </p>
          <a
            href="/requirements.doc"
            download
            class="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/30 font-bold"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            تحميل الدليل PDF
          </a>
        </div>

        <!-- Decorative Icon -->
        <div class="shrink-0 relative z-0">
          <svg class="w-48 h-48 md:w-64 md:h-64 text-white opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="0.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

useScrollReveal()

const activeStep = ref(0)
let journeyObserver = null

const steps = [
  {
    index: 1,
    title: 'إنشاء الحساب والتسجيل',
    badge: 'الخطوة الأولى',
    badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    desc: 'قم بإنشاء حسابك الأكاديمي كباحث على المنصة، وقم برفع هويتك الشخصية وسيرتك الذاتية لبدء التقديم.',
  },
  {
    index: 2,
    title: 'تفعيل الحساب من الإدارة',
    badge: 'الخطوة الثانية',
    badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    desc: 'تقوم إدارة اللجنة بمراجعة ملفك الشخصي ومستنداتك للتأكد من مطابقتها للمعايير الأكاديمية وتفعيل حسابك.',
  },
  {
    index: 3,
    title: 'تقديم البروتوكول البحثي',
    badge: 'الخطوة الثالثة',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    desc: 'قم بملء النماذج البحثية الذكية ورفع البروتوكول المقترح واستمارات الموافقة المستنيرة والملفات المرفقة.',
  },
  {
    index: 4,
    title: 'مراجعة وتعيين المراجعين',
    badge: 'الخطوة الرابعة',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    desc: 'تقوم الإدارة بفحص المستندات المرفوعة وتعيين الطلب لمراجعين علميين متخصصين في موضوع البحث.',
  },
  {
    index: 5,
    title: 'المراجعة العلمية العمياء',
    badge: 'الخطوة الخامسة',
    badgeClass: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    desc: 'يقوم المراجعون بتقييم البحث بدقة علمية كاملة وموضوعية دون الكشف عن هوية الباحث أو المراجع.',
  },
  {
    index: 6,
    title: 'الاعتماد النهائي للطلب',
    badge: 'الخطوة السادسة',
    badgeClass: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    desc: 'يراجع مدير اللجنة تقارير التقييم ويصدر قرار الاعتماد النهائي أو طلب تعديلات بالبروتوكول الدراسة.',
  },
  {
    index: 7,
    title: 'سداد الرسوم المقررة',
    badge: 'الخطوة السابعة',
    badgeClass: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    desc: 'بعد اعتماد البحث، يقوم الباحث بسداد رسوم المراجعة بأمان عبر قنوات الدفع الإلكتروني المعتمدة (Paymob).',
  },
  {
    index: 8,
    title: 'إصدار شهادة الموافقة',
    badge: 'الخطوة الثامنة',
    badgeClass: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
    desc: 'مبارك! يصدر النظام شهادة موافقة رقمية فورية مؤمّنة برمز QR للتنزيل الفوري والتقديم للجهات الرسمية.',
  }
]

const glowClass = computed(() => {
  switch (activeStep.value) {
    case 1: return 'from-blue-500/[0.04] via-transparent to-transparent'
    case 2: return 'from-amber-500/[0.04] via-transparent to-transparent'
    case 3: return 'from-emerald-500/[0.04] via-transparent to-transparent'
    case 4: return 'from-indigo-500/[0.04] via-transparent to-transparent'
    case 5: return 'from-purple-500/[0.04] via-transparent to-transparent'
    case 6: return 'from-sky-500/[0.04] via-transparent to-transparent'
    case 7: return 'from-teal-500/[0.04] via-transparent to-transparent'
    case 8: return 'from-yellow-500/[0.06] via-transparent to-transparent'
    default: return 'from-primary/[0.02] via-transparent to-transparent'
  }
})

onMounted(() => {
  const steps = document.querySelectorAll('[data-journey-step]')
  journeyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const step = parseInt(entry.target.dataset.journeyStep, 10)
        activeStep.value = step
      }
    })
  }, {
    threshold: 0.5,
    rootMargin: '-15% 0px -35% 0px'
  })

  steps.forEach((el) => journeyObserver.observe(el))
})

onUnmounted(() => {
  if (journeyObserver) journeyObserver.disconnect()
})
</script>

<style scoped>
/* ===== Scroll Reveal Base States ===== */
[data-reveal] {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}

[data-reveal-child] {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal-child].revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Hero Glow Animation ===== */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(30px);
  }
}

/* ===== Feature Card Top Bar ===== */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: oklch(62% 0.12 165);
  transform: scaleX(0);
  transition: transform 0.4s ease;
  transform-origin: right;
  border-radius: 2px;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

/* ===== Counter Plus Prefix ===== */
.stat-prefix {
  font-size: 0.6em;
  opacity: 0.8;
}

/* ===== Workflow Scroll-Linked Journey styling ===== */
#workflow {
  transition: background-color 1s ease-in-out, color 1s ease-in-out;
}

/* Glowing animation for certificate final step */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
    border-color: rgba(245, 158, 11, 0.4);
    transform: rotate(6deg) scale(1);
  }
  50% {
    box-shadow: 0 0 35px rgba(245, 158, 11, 0.6);
    border-color: rgba(245, 158, 11, 0.8);
    transform: rotate(6deg) scale(1.03);
  }
}
.animate-pulse-glow {
  animation: pulse-glow 3s infinite ease-in-out;
}
</style>