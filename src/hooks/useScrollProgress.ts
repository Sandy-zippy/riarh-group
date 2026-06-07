import { useEffect, useRef } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'

/**
 * Robust per-element scroll progress.
 *
 * Returns 0 when the element's top first reaches the viewport bottom (entering)
 * and 1 when its bottom reaches the viewport top (leaving) — a clamped 0..1
 * value to drive `useTransform` parallax.
 *
 * Why not framer-motion's `useScroll({ target })`? It measures the target's
 * document offset at mount and only re-measures on window resize. This page
 * lazy-loads section imagery, which grows the document AFTER mount with NO
 * resize event, leaving every section below with stale offsets — their scroll
 * progress froze at 0 and the parallax died. Reading `getBoundingClientRect`
 * live on each scroll frame is always correct, lazy loads and all.
 *
 * Respects `prefers-reduced-motion`: progress is parked at a fixed midpoint so
 * transforms resolve to a static, neutral value.
 */
export function useScrollProgress<T extends HTMLElement = HTMLElement>(): {
  ref: React.RefObject<T | null>
  progress: MotionValue<number>
} {
  const ref = useRef<T>(null)
  const progress = useMotionValue(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      progress.set(0.5)
      return
    }

    let raf = 0
    const update = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = vh + r.height
      const p = (vh - r.top) / total
      progress.set(Math.min(1, Math.max(0, p)))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [progress])

  return { ref, progress }
}
