import { motion, useReducedMotion } from 'framer-motion'
import { SPRING, EASE } from '../motion'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

// Reference Mission layout: a centred headline + body, then a clean 3-column
// photo composition beneath it — two stacked landscape plates on the left, one
// tall portrait plate in the centre, two stacked landscape plates on the right.
// Built as a real CSS grid (no absolute percentages / fixed-height box), so it
// can't develop dead space or collide. The centre plate row-spans to match the
// height of the two side plates plus the gap. Images chosen so none repeats a
// Featured Projects panel (Featured uses broadway/mucho-abbotsford/heal/
// fresh-haul/medico/sunshine).
const PLATES = [
  { img: 'co-working-space.jpg', cls: 'col-start-1 row-start-1 aspect-[4/3]' },
  { img: 'mortgage-offices.jpg', cls: 'col-start-1 row-start-2 aspect-[4/3]' },
  { img: 'ignis-gale.jpg', cls: 'col-start-2 row-start-1 row-span-2 h-full' },
  { img: 'riarh-hq.jpg', cls: 'col-start-3 row-start-1 aspect-[4/3]' },
  { img: 'mucho-burrito-burnaby.jpg', cls: 'col-start-3 row-start-2 aspect-[4/3]' },
]

function Plate({ img, cls, index }: { img: string; cls: string; index: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...SPRING, ease: EASE, delay: index * 0.09 }}
      className={'relative overflow-hidden ' + cls}
    >
      <img
        src={asset('projects/' + img)}
        alt="Riarh Group completed interior"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
      />
    </motion.div>
  )
}

function Header() {
  const reduce = useReducedMotion()
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={SPRING}
        className="flex items-center justify-center gap-4"
      >
        <span className="eyebrow">Our Mission</span>
        <motion.span
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="h-px w-16 origin-left bg-accent/60"
        />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ ...SPRING, delay: 0.08 }}
        className="display display-xl mx-auto mt-8 max-w-2xl text-center text-ink"
      >
        Building spaces that elevate
        <span className="italic block">lives and businesses</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ ...SPRING, delay: 0.16 }}
        className="body-ref mx-auto mt-6 max-w-md text-center text-ink/65"
      >
        With a foundation of over 15 years in construction and design, we offer
        clients not just buildings but tailored solutions that meet their unique
        needs.
      </motion.p>
    </>
  )
}

export default function Mission() {
  return (
    <section className="overflow-hidden bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
        <Header />

        {/* Desktop (lg+): the 3-column reference composition */}
        <div className="mt-16 hidden grid-cols-3 gap-5 lg:grid">
          {PLATES.map((p, i) => (
            <Plate key={p.img} img={p.img} cls={p.cls} index={i} />
          ))}
        </div>

        {/* Mobile + tablet (below lg): a clean stacked grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:hidden">
          {PLATES.map((p, i) => {
            // 5 plates in a 2-col grid leaves a lone orphan in the last row.
            // Let the final plate span full width as a banner so it resolves
            // cleanly with no empty cell.
            const isLast = i === PLATES.length - 1
            return (
              <div
                key={p.img}
                className={
                  'relative overflow-hidden ' +
                  (isLast ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]')
                }
              >
                <img
                  src={asset('projects/' + p.img)}
                  alt="Riarh Group completed interior"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
