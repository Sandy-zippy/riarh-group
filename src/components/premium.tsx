import { useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

/**
 * Premium primitives ported from the Aceternity UI / 21st.dev component patterns
 * (Scroll Progress, Infinite Moving Cards, Card Spotlight), recoloured to the
 * Riarh brand (ink #080808, cream, terracotta #da7734) and made reduced-motion
 * safe. These are reused across every page for a consistent premium layer.
 */

/* ── ScrollProgressBar ──────────────────────────────────────────────────────
   A thin terracotta bar pinned to the very top that fills as the page scrolls.
   A small, site-wide "this is a considered product" cue. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
    />
  )
}

/* ── Marquee ────────────────────────────────────────────────────────────────
   Endless horizontal row. Renders children twice; CSS slides the track -50%
   and loops. Pauses on hover, static under reduced motion. */
export function Marquee({
  children,
  durationSec = 42,
  className = '',
}: {
  children: ReactNode
  durationSec?: number
  className?: string
}) {
  return (
    <div
      className={'marquee-mask group relative overflow-hidden ' + className}
      style={
        {
          '--marquee-duration': `${durationSec}s`,
          maskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        } as React.CSSProperties
      }
    >
      <div className="marquee-track flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── SpotlightCard ──────────────────────────────────────────────────────────
   A card that lifts a faint terracotta radial glow toward the cursor. Pure CSS
   vars driven by pointer move; no glow / no listener under reduced motion or on
   touch. Wraps any card content; pass the card classes via `className`. */
export function SpotlightCard({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article'
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const Comp = Tag as 'div'
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      onPointerMove={onMove}
      onPointerEnter={(e: React.PointerEvent) => {
        if (!reduce && e.pointerType !== 'touch') setActive(true)
      }}
      onPointerLeave={() => setActive(false)}
      className={'relative isolate overflow-hidden ' + className}
    >
      {!reduce && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: active ? 1 : 0,
            background:
              'radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(218,119,52,0.16), transparent 70%)',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </Comp>
  )
}
