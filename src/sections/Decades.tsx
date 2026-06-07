import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { STATS } from '../data/site'
import { SPRING } from '../motion'

// Reference renders the stat at rest with the "+" suffix small and raised —
// e.g. "100K" full size, "+" superscript. A single count-up ticks the number
// from 0 to its target once when scrolled into view (~1.2s ease); the "+" and
// superscript rendering, and the display-* classes, are unchanged. Respects
// prefers-reduced-motion by rendering the final value immediately.
function Stat({ value }: { value: string }) {
  const m = value.match(/^(.*?)(\+)?$/)
  const base = m ? m[1] : value
  const plus = m && m[2] ? m[2] : ''

  // Split the numeric lead from any trailing unit suffix (e.g. "100K" → 100,"K").
  const nm = base.match(/^(\d+)(.*)$/)
  const target = nm ? parseInt(nm[1], 10) : NaN
  const suffix = nm ? nm[2] : ''

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(() =>
    Number.isNaN(target) ? base : reduce ? String(target) : '0',
  )

  useEffect(() => {
    if (Number.isNaN(target) || reduce) return
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    })
    return () => controls.stop()
  }, [inView, target, reduce])

  return (
    <span ref={ref}>
      {Number.isNaN(target) ? base : `${display}${suffix}`}
      {plus && (
        <span className="text-[0.45em] text-accent" style={{ verticalAlign: '0.55em' }}>
          {plus}
        </span>
      )}
    </span>
  )
}

export default function Decades() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[80rem] px-6 pt-[58px] pb-10 md:px-12">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={SPRING}
            className="display display-xl max-w-xl text-cream"
          >
            Breadth of experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.12 }}
            className="body-ref max-w-[33rem] text-cream md:mt-4"
          >
            Our brand is founded on over 15 years of trusted expertise, built
            through a solid foundation in construction, design, and development.
          </motion.p>
        </div>

        <div className="mt-16 flex flex-col gap-12 sm:flex-row sm:justify-between">
          {STATS.map(([value, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SPRING, delay: i * 0.1 }}
            >
              <div className="display display-xl leading-none text-cream">
                <Stat value={value} />
              </div>
              <div className="mt-4 max-w-[14rem] body-ref text-cream">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
