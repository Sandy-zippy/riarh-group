import { cubicBezier, type Transition } from 'framer-motion'

// ── Motion language extracted verbatim from the reference Framer build ──
// (decompiled from script chunk jpF3JI….BUPL0pLj.mjs)

// Entrance ("appear") transition — a quick spring with a touch of overshoot.
// Reference used this 18× as the default: {bounce:.2, delay:0, duration:.4, type:'spring'}.
export const SPRING: Transition = { type: 'spring', bounce: 0.2, duration: 0.4 }

// Tween easing for any non-spring interpolation — symmetric ease-in-out.
// Reference: cubic-bezier(.44, 0, .56, 1) (11×).
export const EASE = cubicBezier(0.44, 0, 0.56, 1)

// Default appear: fade + small rise, springy. delay is applied per element.
export const appear = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 as const },
  transition: { ...SPRING, delay },
})
