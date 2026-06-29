import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { SPRING } from '../motion'
import { PROJECTS, cardImage } from '../data/site'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

// Portfolio with category filtering (per Dal's brief). Tenant Improvements is
// promoted as its own prominent category alongside Commercial and Industrial.
const CATEGORIES = ['All', 'Commercial', 'Industrial', 'Tenant Improvements'] as const
type Category = (typeof CATEGORIES)[number]

// Subtle per-card stagger for the scroll reveal. Capped so a long grid never
// drags out the entrance — premium editorial feel, not a domino chain.
const REVEAL_STAGGER = 0.05
const REVEAL_MAX_DELAY = 0.4

export default function Portfolio() {
  const [active, setActive] = useState<Category>('All')
  const reduce = useReducedMotion()
  // Only surface projects with real photography — image-less entries rendered
  // as empty placeholder cards, which read as broken/missing on a premium grid.
  const shown = PROJECTS.filter(
    (p) => p.slug && (active === 'All' || p.sector === active),
  )

  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="flex items-center gap-4"
        >
          <span className="eyebrow">Portfolio</span>
          <span className="h-px w-20 bg-accent" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ ...SPRING, delay: 0.08 }}
          className="display display-xl mt-8 max-w-3xl text-cream"
        >
          Built across every commercial sector.
        </motion.h2>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ ...SPRING, delay: 0.16 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {CATEGORIES.map((c) => {
            const isActive = active === c
            const isTI = c === 'Tenant Improvements'
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={
                  'inline-flex min-h-[44px] items-center justify-center rounded-full border px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] transition-colors ' +
                  (isActive
                    ? 'border-accent bg-accent text-ink'
                    : isTI
                      ? 'border-accent/60 text-accent hover:bg-accent hover:text-ink'
                      : 'border-line text-cream/70 hover:border-cream hover:text-cream')
                }
              >
                {c}
              </button>
            )
          })}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="mt-12 flex flex-wrap justify-start gap-6">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.div
                key={`${p.name}-${p.location}`}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  ...SPRING,
                  duration: 0.5,
                  delay: reduce ? 0 : Math.min(i * REVEAL_STAGGER, REVEAL_MAX_DELAY),
                }}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <Link
                  to={`/commercial/${p.slug}`}
                  aria-label={`${p.name}, ${p.location}. View project gallery.`}
                  className="group block overflow-hidden rounded-xl border border-line transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_10px_34px_-14px_rgba(218,119,52,0.38)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
                    <img
                      src={asset(cardImage(p)!)}
                      alt={`${p.name}, ${p.scope}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-cream/85 backdrop-blur-sm">
                      {p.sector}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="display text-xl leading-[1.6] pb-0.5 text-cream">{p.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-accent">
                      {p.location}
                    </p>
                    <p className="body-ref mt-3 text-muted">{p.scope}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-cream/55 transition-colors group-hover:text-cream">
                      View project <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
