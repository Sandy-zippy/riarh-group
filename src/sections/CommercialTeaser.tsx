import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { SPRING } from '../motion'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
}

export default function CommercialTeaser() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Signature scroll-parallax: the full-bleed photo drifts slowly through frame.
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.14])

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-screen items-center overflow-hidden"
    >
      {/* Full-bleed background photo */}
      <motion.img
        src={asset('projects/broadway-towers/02.jpg')}
        alt="Commercial build in progress"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-x-0 -top-[8%] -z-10 h-[116%] w-full object-cover will-change-transform"
      />
      {/* Scrim: the photo stays bright at the edges, but a stronger centre radial
          plus a base wash anchor the cream copy so it reads cleanly on the bright
          reception interior (was too low-contrast, especially on mobile). */}
      <div className="absolute inset-0 -z-10 bg-ink/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/35 via-ink/10 to-ink/15" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(8,8,8,0.62),rgba(8,8,8,0.32)_45%,transparent_72%)]" />

      {/* Centered overlay content */}
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <motion.div
          {...fadeUp}
          transition={SPRING}
          className="flex items-center justify-center gap-4"
        >
          <motion.span
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="h-px w-16 origin-left bg-accent/60"
          />
          <span className="eyebrow">Commercial</span>
          <motion.span
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="h-px w-16 origin-left bg-accent/60"
          />
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ ...SPRING, delay: 0.08 }}
          className="display display-2xl mt-8 text-cream"
        >
          Built for Growth.
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...SPRING, delay: 0.16 }}
          className="body-ref mx-auto mt-7 max-w-2xl text-[clamp(1.125rem,1.6vw,1.4375rem)] text-cream"
        >
          We build the commercial spaces that keep businesses running, from medical
          clinics and restaurants to retail and industrial fit-outs.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...SPRING, delay: 0.24 }}
          className="mt-12"
        >
          <Link
            to="/commercial"
            className="inline-block border border-cream/40 px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            Explore Commercial
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
