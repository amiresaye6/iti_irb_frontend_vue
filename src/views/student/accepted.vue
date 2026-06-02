<script setup>
import { ref, onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router'
import { applicationServices } from '@/services/applicationServices.js'

const Base_url = import.meta.env.VITE_BACKEND_SERVER;
const appServices = applicationServices();
const route = useRoute();
const router = useRouter();
const serialNumber = route.params.serial_number;

const goToDashboard = () => {
    router.push('/student/dashboard');
};
</script>
<template>
  <div class="accepted-page">
    <div class="success-card">
      
      <div class="success-icon">
        ✓
      </div>

      <h1 class="title">
        تم ارسال طلبك بنجاح!
      </h1>

      <p class="subtitle">
        تم استلام طلبك وإرساله للمراجعة الاولية بنجاح
      </p>

      <div class="serial-box">
        <span class="serial-label">
          رقم الطلب
        </span>

        <span class="serial-number">
          {{ serialNumber }}
        </span>
      </div>

      <div class="info-box">
        يمكنك متابعة حالة طلبك وجميع التحديثات
        من خلال لوحة التحكم الخاصة بك.
      </div>

      <button
        class="dashboard-btn"
        @click="goToDashboard"
      >
        العودة إلى لوحة التحكم
      </button>
    </div>
  </div>
</template>

<style scoped>
.accepted-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
    radial-gradient(circle at top left, #dbeafe, transparent 30%),
    radial-gradient(circle at bottom right, #dcfce7, transparent 30%),
    linear-gradient(135deg, #f8fafc, #eef2ff);
  padding: 2rem;
}

.success-card {
  width: 100%;
  max-width: 650px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 32px;
  padding: 3rem;
  text-align: center;
  box-shadow:
    0 20px 50px rgba(0,0,0,0.08),
    0 8px 20px rgba(0,0,0,0.05);
  animation: fadeUp 0.8s ease;
}

.success-icon {
  width: 110px;
  height: 110px;
  margin: auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-size: 3rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 15px 35px rgba(34, 197, 94, 0.35);
  animation: pop 0.7s ease;
}

.title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 1.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-top: .8rem;
}

.serial-box {
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 22px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.serial-label {
  display: block;
  color: #64748b;
  margin-bottom: .6rem;
  font-size: .95rem;
}

.serial-number {
  font-size: 2rem;
  font-weight: 900;
  color: black;
  letter-spacing: 2px;
}

.info-box {
  margin-top: 2rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  padding: 1rem;
  border-radius: 18px;
  line-height: 1.8;
}

.dashboard-btn {
  margin-top: 2rem;
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  color: white;
  background: linear-gradient(
    135deg,
    #18cc66,
    #1dd881
  );
  transition: all 0.3s ease;
  box-shadow: 0 12px 25px rgba(37,99,235,.25);
}

.dashboard-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 35px rgba(37,99,235,.35);
}

.dashboard-btn:active {
  transform: scale(.98);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pop {
  0% {
    transform: scale(.5);
    opacity: 0;
  }

  70% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .success-card {
    padding: 2rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .serial-number {
    font-size: 1.5rem;
  }
}
</style>