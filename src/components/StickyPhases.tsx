import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { SPRING } from '../motion'

const BASE = import.meta.env.BASE_URL

export type Phase = {
  num: string
  title: string
  lead: string
  desc: string
  image: string
}

/**
 * Sticky Scroll Reveal (Aceternity pattern, brand-recoloured).
 * Desktop: an image panel pins while the three phase blocks scroll past it; the
 * active phase's image crossfades into the panel and a numbered progress rail
 * advances. Mobile/reduced-motion: a clean stacked image+text layout.
 */
export default function StickyPhases({ phases }: { phases: Phase[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(0)
  const fillScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Map 0..1 progress to a phase index. Bias slightly so each phase is active
    // while it's roughly centred against the sticky panel.
    const i = Math.min(phases.length - 1, Math.floor(p * phases.length + 0.0001))
    setActive(i < 0 ? 0 : i)
  })

  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Desktop: pinned panel + scrolling steps ── */}
        <div ref={ref} className="relative hidden lg:block">
          <div className="grid grid-cols-2 gap-16">
            {/* LEFT — sticky image panel */}
            <div className="relative">
              <div className="sticky top-24 h-[72vh] max-h-[640px]">
                <div className="relative h-full w-full overflow-hidden">
                  {phases.map((p, i) => (
                    <motion.img
                      key={p.image}
                      src={`${BASE}projects/${p.image}`}
                      alt={p.title}
                      loading="lazy"
                      initial={false}
                      animate={{
                        opacity: active === i ? 1 : 0,
                        scale: active === i ? 1 : 1.06,
                      }}
                      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.44, 0, 0.56, 1] }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* RIGHT — scrolling steps with a progress rail */}
            <div className="relative">
              {/* progress rail */}
              <div className="absolute left-0 top-0 h-full w-px bg-ink/10">
                <motion.div
                  style={{ scaleY: reduce ? 1 : fillScaleY }}
                  className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
                />
              </div>
              {phases.map((p) => (
                <div
                  key={p.lead}
                  className="flex min-h-[78vh] flex-col justify-center pl-10"
                >
                  <span className="block text-sm uppercase tracking-[0.16em] text-accent">
                    {p.title}
                  </span>
                  <h3 className="display mt-7 max-w-md text-[clamp(1.6rem,2.6vw,2rem)] leading-snug text-ink">
                    {p.lead}
                  </h3>
                  <p className="body-ref mt-6 max-w-md text-ink/60">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile / tablet: stacked rows ── */}
        <div className="flex flex-col gap-20 py-24 lg:hidden">
          {phases.map((p, i) => (
            <motion.div
              key={p.lead}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: i * 0.05 }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={`${BASE}projects/${p.image}`}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="mt-6 block text-sm uppercase tracking-[0.16em] text-accent">
                {p.title}
              </span>
              <h3 className="display mt-3 text-[clamp(1.5rem,6vw,1.9rem)] leading-snug text-ink">
                {p.lead}
              </h3>
              <p className="body-ref mt-4 text-ink/60">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
