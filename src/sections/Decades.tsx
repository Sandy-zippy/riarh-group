import { motion } from 'framer-motion'
import { STATS } from '../data/site'
import { SPRING } from '../motion'
import { SpotlightCard } from '../components/premium'

// Reference renders the stat at rest with the "+" suffix raised — e.g. "100K"
// full size, "+" close above. The value renders statically (no count-up); the
// card's entrance spring handles the reveal. The "+" is sized for legibility.
function Stat({ value }: { value: string }) {
  const m = value.match(/^(.*?)(\+)?$/)
  const base = m ? m[1] : value
  const plus = m && m[2] ? m[2] : ''

  return (
    <span>
      {base}
      {plus && (
        <span className="text-[0.8em] text-accent" style={{ verticalAlign: '0.08em' }}>
          {plus}
        </span>
      )}
    </span>
  )
}

export default function Decades() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 pt-[58px] pb-10">
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
            That experience spans every major commercial sector: commercial,
            tenant improvement, industrial, hospitality, retail, childcare, and
            healthcare, giving us the range to handle whatever your project
            demands.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {STATS.map(([value, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SPRING, delay: i * 0.1 }}
            >
              <SpotlightCard className="h-full rounded-lg border border-line/60 p-7 transition-colors duration-300 hover:border-accent/40 md:p-8">
                <div className="display display-xl leading-none text-cream">
                  <Stat value={value} />
                </div>
                <div className="mt-4 max-w-[14rem] body-ref text-cream/80">
                  {label}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
