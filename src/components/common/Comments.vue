<script setup>
import { ref, onMounted, watch } from 'vue'
import { applicationServices } from '@/services/applicationServices.js'

const props = defineProps({
  id: { type: [String, Number], required: true }
})

const comments = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)

const setLoading = (val) => (isLoading.value = val)
const setError = (err) => (errorMessage.value = err?.message || err)

const appServices = applicationServices()

const fetchComments = async () => {
  if (!props.id) return
  setError(null)
  setLoading(true)
  try {
    const data = await appServices.getCommentsByAppId(props.id, setLoading, setError)
    if (data && Array.isArray(data)) {
      // New API shape: array of review objects with `reviewer` and `comments` array
      // Flatten into a unified comments list that includes reviewer name.
      let items = []
      if (data.length > 0 && data[0].hasOwnProperty('comments')) {
        data.forEach((review) => {
          const reviewerName = review.reviewer?.full_name || review.reviewer?.fullName || ''
          if (Array.isArray(review.comments)) {
            review.comments.forEach((c) => {
              items.push({ id: c.id, comment: c.comment, created_at: c.created_at, reviewer_name: reviewerName })
            })
          }
        })
      } else {
        items = data.map((c) => ({ id: c.id, comment: c.comment, created_at: c.created_at, reviewer_name: c.reviewer_name || '' }))
      }

      comments.value = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else {
      comments.value = []
    }
  } catch (err) {
    setError(err)
  } finally {
    setLoading(false)
  }
}

onMounted(fetchComments)
watch(() => props.id, (n, o) => { if (n !== o) fetchComments() })

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-base-200 p-4 space-y-4">
    <h3 class="text-lg font-bold text-base-content">التعليقات</h3>

    <div v-if="isLoading" class="flex items-center gap-3">
      <span class="loading loading-spinner loading-md text-primary"></span>
      <span class="text-sm text-base-content/70">جاري تحميل التعليقات...</span>
    </div>

    <div v-else-if="errorMessage" class="text-sm text-error">{{ errorMessage }}</div>

    <div v-else>
      <div v-if="comments.length === 0" class="text-sm text-base-content/50">لا توجد تعليقات</div>

      <div v-else class="space-y-3">
        <div v-for="c in comments" :key="c.id" class="bg-white p-4 rounded-lg border">
          <p class="text-sm font-semibold text-base-content">{{ c.reviewer_name }}</p>
          <p class="text-base text-base-content mt-1">{{ c.comment }}</p>
          <p class="text-xs text-base-content/60 mt-2">{{ formatDate(c.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
