import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { SPRING, EASE } from '../motion'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

// Reference Mission: a centred headline + body, then a STAGGERED photo scatter
// that is DYNAMIC — as the section travels through the viewport each plate drifts
// vertically at its own speed (scroll-linked parallax), so the composition feels
// alive rather than a frozen grid. Built on a 3-column flow (two plates left, one
// tall plate centre, two plates right) with per-plate top offsets for the organic
// scatter, plus a fade/rise on first reveal. Images chosen so none repeats a
// Featured Projects panel (Featured uses broadway/mucho-abbotsford/heal/
// fresh-haul/medico/sunshine).
type Plate = { img: string; offset: string; ar: string; range: [number, number] }

// Plates within a column share a drift range so the stacked pair never collides;
// the three columns drift at clearly different rates so they parallax against
// each other as the section passes through (the reference's "alive" feel).
const LEFT_RANGE: [number, number] = [110, -110]
const CENTER_RANGE: [number, number] = [200, -50]
const RIGHT_RANGE: [number, number] = [40, -170]

const LEFT: Plate[] = [
  { img: 'co-working-space.jpg', offset: 'mt-10', ar: 'aspect-[4/3]', range: LEFT_RANGE },
  { img: 'mortgage-offices.jpg', offset: 'mt-6', ar: 'aspect-[4/3]', range: LEFT_RANGE },
]
const CENTER: Plate = {
  img: 'ignis-gale.jpg',
  offset: 'mt-28',
  ar: 'aspect-[3/4]',
  range: CENTER_RANGE,
}
const RIGHT: Plate[] = [
  { img: 'riarh-hq.jpg', offset: 'mt-0', ar: 'aspect-[4/3]', range: RIGHT_RANGE },
  { img: 'mucho-burrito-burnaby.jpg', offset: 'mt-8', ar: 'aspect-[4/3]', range: RIGHT_RANGE },
]

function ScatterPlate({
  plate,
  progress,
  index,
}: {
  plate: Plate
  progress: MotionValue<number>
  index: number
}) {
  const reduce = useReducedMotion()
  // Scroll-linked parallax: each plate maps the section's scroll progress to its
  // own y range, so they drift apart at different speeds (depth/parallax).
  const y = useTransform(progress, [0, 1], plate.range)
  return (
    <motion.div
      style={{ y: reduce ? 0 : y }}
      initial={reduce ? false : { opacity: 0, y: 36, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...SPRING, ease: EASE, delay: index * 0.08 }}
      className={'relative overflow-hidden ' + plate.offset + ' ' + plate.ar}
    >
      <img
        src={asset('projects/' + plate.img)}
        alt="Riarh Group completed interior"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
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
        <span className="italic block">lives and businesses.</span>
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
  const ref = useRef<HTMLDivElement>(null)
  // Progress 0 → 1 as the section travels from entering to leaving the viewport;
  // drives the per-plate parallax.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const ALL = [...LEFT, CENTER, ...RIGHT]

  return (
    <section ref={ref} className="overflow-hidden bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
        <Header />

        {/* Desktop (lg+): the staggered, parallaxing reference composition */}
        <div className="mt-14 hidden grid-cols-3 items-start gap-5 lg:grid">
          <div className="flex flex-col gap-5">
            <ScatterPlate plate={LEFT[0]} progress={scrollYProgress} index={0} />
            <ScatterPlate plate={LEFT[1]} progress={scrollYProgress} index={1} />
          </div>
          <ScatterPlate plate={CENTER} progress={scrollYProgress} index={2} />
          <div className="flex flex-col gap-5">
            <ScatterPlate plate={RIGHT[0]} progress={scrollYProgress} index={3} />
            <ScatterPlate plate={RIGHT[1]} progress={scrollYProgress} index={4} />
          </div>
        </div>

        {/* Mobile + tablet (below lg): a clean stacked grid (no parallax) */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:hidden">
          {ALL.map((p, i) => {
            const isLast = i === ALL.length - 1
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
