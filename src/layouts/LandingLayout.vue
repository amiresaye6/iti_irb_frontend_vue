<template>
  <div class="min-h-screen flex flex-col" dir="rtl">
    <!-- Navbar -->
    <header
      :class="[
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-base-100/95 shadow-lg border-base-200/50'
          : 'bg-base-100/80 backdrop-blur-xl border-base-200/50',
      ]"
    >
      <nav class="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div
            class="w-9 h-9 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-lg shadow-sm shadow-primary/30"
          >
            I
          </div>
          <span class="font-bold text-xl text-neutral">IRB Platform</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <ul class="flex gap-1 items-center">
            <li>
              <RouterLink
                to="/"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                الرئيسية
              </RouterLink>
            </li>
            <li>
              <a
                href="#about"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                عن اللجنة
              </a>
            </li>
            <li>
              <a
                href="#features"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                المميزات
              </a>
            </li>
            <li>
              <a
                href="#workflow"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                آلية العمل
              </a>
            </li>
          </ul>

          <!-- Divider -->
          <div class="w-px h-6 bg-base-300 mx-2"></div>

          <!-- Auth -->
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/dashboard"
            class="btn btn-primary btn-sm px-5 shadow-sm"
          >
            لوحة التحكم
          </RouterLink>
          <RouterLink v-else to="/login" class="btn btn-primary btn-sm px-5 shadow-sm">
            تسجيل الدخول
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="btn btn-ghost btn-sm btn-square md:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="القائمة"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <!-- Mobile Dropdown Menu -->
      <div
        v-if="isMobileMenuOpen"
        class="absolute top-full left-0 right-0 bg-base-100 border-b border-base-200 shadow-xl p-4 md:hidden"
      >
        <ul class="flex flex-col gap-2">
          <li>
            <RouterLink
              to="/"
              class="block px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              @click="closeMobileMenu"
            >
              الرئيسية
            </RouterLink>
          </li>
          <li>
            <a
              href="#about"
              class="block px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              @click="closeMobileMenu"
            >
              عن اللجنة
            </a>
          </li>
          <li>
            <a
              href="#features"
              class="block px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              @click="closeMobileMenu"
            >
              المميزات
            </a>
          </li>
          <li>
            <a
              href="#workflow"
              class="block px-4 py-2 rounded-xl text-sm font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              @click="closeMobileMenu"
            >
              آلية العمل
            </a>
          </li>
        </ul>

        <!-- Mobile Auth -->
        <div class="border-t border-base-200 mt-3 pt-3">
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/dashboard"
            class="btn btn-primary btn-sm w-full shadow-sm"
            @click="closeMobileMenu"
          >
            لوحة التحكم
          </RouterLink>
          <RouterLink
            v-else
            to="/login"
            class="btn btn-primary btn-sm w-full shadow-sm"
            @click="closeMobileMenu"
          >
            تسجيل الدخول
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="grow flex flex-col pt-16 md:pt-20">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-neutral text-neutral-content border-t-4 border-primary">
      <!-- Main Footer Grid -->
      <div class="max-w-7xl mx-auto py-16 px-6 md:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Column 1: About -->
          <div>
            <div class="flex items-center gap-3 mb-5">
              <div
                class="w-9 h-9 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-lg"
              >
                I
              </div>
              <span class="font-bold text-xl text-white">IRB</span>
            </div>
            <p class="text-neutral-content/70 text-sm leading-relaxed">
              منصة لجنة أخلاقيات البحث المؤسسية تهدف إلى تسهيل عملية مراجعة
              واعتماد البحوث الطبية والعلمية، وضمان الالتزام بأعلى المعايير
              الأخلاقية لحماية المشاركين في الأبحاث وتسريع الإجراءات البحثية.
            </p>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h3 class="text-white font-bold text-lg mb-4">روابط سريعة</h3>
            <ul class="flex flex-col gap-3">
              <li>
                <a
                  href="#about"
                  class="text-neutral-content/70 hover:text-primary hover:translate-x-[-4px] transition-all text-sm flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 shrink-0 rtl:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  عن اللجنة
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  class="text-neutral-content/70 hover:text-primary hover:translate-x-[-4px] transition-all text-sm flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 shrink-0 rtl:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  المميزات
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  class="text-neutral-content/70 hover:text-primary hover:translate-x-[-4px] transition-all text-sm flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 shrink-0 rtl:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  رحلة الموافقة
                </a>
              </li>
              <li>
                <RouterLink
                  to="/login"
                  class="text-neutral-content/70 hover:text-primary hover:translate-x-[-4px] transition-all text-sm flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 shrink-0 rtl:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  الدخول للوحة التحكم
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Column 3: Contact -->
          <div>
            <h3 class="text-white font-bold text-lg mb-4">الدعم الفني والتواصل</h3>
            <ul class="flex flex-col gap-4">
              <!-- Location -->
              <li class="flex items-start gap-3 text-sm text-neutral-content/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-primary shrink-0 mt-0.5 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>كلية الطب، مبنى إدارة البحوث، الدور الثالث</span>
              </li>
              <!-- Email -->
              <li class="flex items-start gap-3 text-sm text-neutral-content/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-primary shrink-0 mt-0.5 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span dir="ltr">support@irb-system.edu</span>
              </li>
              <!-- Phone -->
              <li class="flex items-start gap-3 text-sm text-neutral-content/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-primary shrink-0 mt-0.5 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span dir="ltr">+20 123 456 7890</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom Bar -->
      <div class="border-t border-white/10 py-6 px-6 md:px-8">
        <div
          class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p class="text-neutral-content/50 text-sm">
            © {{ new Date().getFullYear() }} IRB Platform — جميع الحقوق محفوظة
          </p>

          <!-- Social Icons -->
          <div class="flex items-center gap-2">
            <!-- Facebook -->
            <a
              href="#"
              aria-label="Facebook"
              class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-content/70 hover:bg-primary hover:text-white transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                />
              </svg>
            </a>
            <!-- Twitter -->
            <a
              href="#"
              aria-label="Twitter"
              class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-content/70 hover:bg-primary hover:text-white transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <!-- LinkedIn -->
            <a
              href="#"
              aria-label="LinkedIn"
              class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-content/70 hover:bg-primary hover:text-white transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                />
              </svg>
            </a>
            <!-- Globe -->
            <a
              href="#"
              aria-label="الموقع"
              class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-content/70 hover:bg-primary hover:text-white transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/auth/auth.store'

const authStore = useAuthStore()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>