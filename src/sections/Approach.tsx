import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useTransform, useReducedMotion } from 'framer-motion'
import { SPRING } from '../motion'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { APPROACH } from '../data/site'


function CheckNode() {
  return (
    <div className="flex flex-col items-center" aria-hidden>
      <span className="h-8 w-px border-l border-dashed border-line" />
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-cream/50">
          <path
            d="M5 12.5l4 4L19 7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="h-8 w-px border-l border-dashed border-line" />
    </div>
  )
}

type Step = (typeof APPROACH)[number]

function StepCard({ a }: { a: Step }) {
  const reduce = useReducedMotion()
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  // Scroll-linked zoom: each card scales up slightly as it travels into view,
  // settling at full size by the time it reaches the upper-middle of the
  // viewport. Mirrors the reference build's per-card reveal.
  const scale = useTransform(progress, [0, 0.45, 1], [0.92, 1, 1])
  const opacity = useTransform(progress, [0, 0.28, 1], [0.6, 1, 1])

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { scale, opacity }}
      whileHover={{ y: -2 }}
      transition={SPRING}
      className="flex min-h-[14rem] flex-col rounded-none border border-line bg-ink p-10 transition-[box-shadow,border-color] duration-300 hover:border-accent/40 hover:shadow-[0_10px_34px_-14px_rgba(218,119,52,0.4)] hover:ring-1 hover:ring-accent/40 md:p-12"
    >
      <h3 className="display text-[1.9375rem] leading-[1.1] text-cream">
        <span className="mr-4">{a.step}.</span>
        {a.title}
      </h3>
      <p className="mt-6 max-w-sm body-ref text-muted">{a.desc}</p>
    </motion.div>
  )
}

export default function Approach() {
  const ref = useRef<HTMLElement>(null)

  return (
    <section ref={ref} className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Sticky left column, vertically centred against the tall stepper so it
              never leaves a large empty void on the left as the cards scroll. */}
          <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2 lg:self-start">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={SPRING}
              className="display display-xl max-w-lg text-cream"
            >
              The Riarh Approach.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SPRING, delay: 0.08 }}
              className="mt-6 max-w-sm body-ref text-muted"
            >
              Managing the rigorous planning and logistics so you can focus on the
              vision.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SPRING, delay: 0.16 }}
            >
              <Link
                to="/contact-us"
                className="mt-8 inline-block rounded-none border border-cream/40 px-9 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Let's Talk
              </Link>
            </motion.div>
          </div>

          {/* Right vertical stepper of bordered cards */}
          <div className="flex flex-col">
            {APPROACH.map((a, i) => (
              <div key={a.title}>
                <StepCard a={a} />
                {i < APPROACH.length - 1 && <CheckNode />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
