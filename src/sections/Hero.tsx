import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SPRING } from '../motion'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

// Home hero: a real completed Riarh build at dusk (Dal's "change image" note),
// replacing the generic reference exterior. Dedicated file so other heroes are
// unaffected.
const HOME_HERO = 'projects/hero-home.jpg'

// Spring entrance (matches the reference): the headline settles with a touch of
// bounce, so the lift is a bit larger than a tween would use.
const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Signature scroll-parallax: the photo drifts UP and scales subtly (scale is
  // the dominant channel, matching the decompiled reference). Travel stays
  // inside the -top-[8%]/h-[116%] overscan buffer so no edge is ever revealed.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14])

  return (
    <section ref={ref} className="relative flex min-h-[100dvh] items-end overflow-hidden">
      <motion.img
        src={asset(HOME_HERO)}
        alt="A completed Riarh Group commercial build at dusk"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover will-change-transform"
      />
      {/* Light, photo-forward scrim — the image stays bright/visible (reference is
          architectural and well-lit); just enough darkening on the left/bottom
          for type legibility. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/10" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fffdf8_1px,transparent_1px),linear-gradient(90deg,#fffdf8_1px,transparent_1px)] [background-size:64px_64px]" />
      {/* Aurora: one very low-opacity warm radial behind the headline, painted over
          the scrim (not the photo) so the type area gets a faint terracotta glow
          without washing the architectural image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(56%_48%_at_22%_74%,rgba(218,119,52,0.09),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-[14vh] pt-32 md:pb-[16vh]">
        <motion.h1
          {...fadeUp}
          transition={{ ...SPRING, delay: 0.06 }}
          className="display display-xl max-w-4xl text-balance text-cream"
        >
          Your commercial vision.
          <br />
          Built on time, <span className="italic">built r<span style={{ marginRight: '0.06em' }}>i</span>ght<span style={{ marginLeft: '0.08em' }}>.</span></span>
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ ...SPRING, delay: 0.16 }}
          className="body-ref mt-7 max-w-xl text-cream/80"
        >
          From first blueprint to final walkthrough, we manage every phase of your
          commercial build so you can stay focused on running your business.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...SPRING, delay: 0.24 }}
          className="mt-9 flex flex-col items-start gap-3"
        >
          <Link
            to="/contact-us"
            className="cta-shine rounded-full bg-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-transform duration-200 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Let's Talk
          </Link>
          <span className="text-xs tracking-[0.04em] text-cream/75">
            Book a free 30-minute project consultation. No commitment.
          </span>
        </motion.div>
      </div>
    </section>
  )
}
