import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { SPRING } from '../motion'


// Clean editorial fade-up stagger on scroll-in. No parallax (per motion spec).
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
}

export default function Intro() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()

  return (
    <section className="bg-ink text-cream">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        className="mx-auto max-w-7xl px-6 pt-28 pb-20 md:pt-32 md:pb-[100px]"
      >
        {/* Centered eyebrow (short rule each side) to match the centered stack below */}
        <motion.div variants={item} className="flex items-center justify-center gap-4">
          <motion.span
            initial={{ scaleX: reduce ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="h-px w-12 origin-right bg-accent/70"
          />
          <span className="eyebrow whitespace-nowrap">Welcome to Riarh Group</span>
          <motion.span
            initial={{ scaleX: reduce ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="h-px w-12 origin-left bg-accent/70"
          />
        </motion.div>

        {/* Centered hero stack */}
        <div className="mt-12 flex flex-col items-center text-center md:mt-14">
          <motion.h2
            variants={item}
            className="display display-hero mx-auto max-w-6xl text-cream"
          >
            <span className="block text-balance">100,000+ sq. ft. built across BC.</span>
            <span className="block text-balance italic">Managed start to finish under one roof.</span>
          </motion.h2>
          <motion.p
            variants={item}
            className="body-ref mx-auto mt-8 max-w-lg text-balance text-muted"
          >
            From clinics and restaurants to childcare and retail, we build custom
            commercial spaces and manage every phase in-house, so you can stay
            focused on running your business.
          </motion.p>
          <motion.div variants={item} className="mt-10">
            <Link
              to="/about"
              className="inline-block border border-cream/40 px-8 py-4 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              Learn More About Us
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
