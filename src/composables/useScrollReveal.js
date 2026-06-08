import { onMounted, onUnmounted } from 'vue'

/**
 * Composable for scroll-triggered reveal animations using Intersection Observer.
 * 
 * Usage: Add `data-reveal` attribute to elements you want to animate.
 * Options via data attributes:
 *   data-reveal="fade-up" | "fade-left" | "fade-right" | "zoom"
 *   data-reveal-delay="200"  (ms delay)
 *   data-reveal-stagger="100" (ms between children)
 *   data-counter-target="500" (animate number from 0 to target)
 */
export function useScrollReveal() {
  let observer = null

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counterTarget, 10)
    if (isNaN(target)) return
    const duration = 2000
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4)
      el.textContent = Math.floor(eased * target).toLocaleString('en-US')
      if (progress < 1) requestAnimationFrame(tick)
      else el.textContent = target.toLocaleString('en-US')
    }
    requestAnimationFrame(tick)
  }

  onMounted(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    if (!elements.length) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const delay = parseInt(el.dataset.revealDelay || '0', 10)

            // Handle staggered children
            const stagger = parseInt(el.dataset.revealStagger || '0', 10)
            if (stagger > 0) {
              const children = el.querySelectorAll('[data-reveal-child]')
              children.forEach((child, i) => {
                setTimeout(() => {
                  child.classList.add('revealed')
                }, delay + i * stagger)
              })
            }

            setTimeout(() => {
              el.classList.add('revealed')
            }, delay)

            // Counter animation
            const counters = el.querySelectorAll('[data-counter-target]')
            counters.forEach((counter) => {
              const counterDelay = parseInt(counter.dataset.revealDelay || '0', 10)
              setTimeout(() => animateCounter(counter), delay + counterDelay)
            })
            if (el.dataset.counterTarget) {
              setTimeout(() => animateCounter(el), delay)
            }

            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
