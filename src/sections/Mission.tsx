import { motion, useReducedMotion } from 'framer-motion'
import { SPRING, EASE } from '../motion'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

// Light cream panel. The centred headline + body sit in the top-centre; the 5
// portrait plates (all 3:4) frame that copy in a balanced spread WITHOUT touching
// it: two plates flank the headline at the outer edges (clear of the centred text
// columns), one larger anchor plate sits centred just below the body, and two
// lower plates flank it. No plate overlaps another or the copy; all stay inside
// the 880px box with even top/bottom margins. Each plate slides + scales into
// place on scroll (fly-in assemble while the section is centred in view).
// Positions (left%, top%, width%) tuned so right edges clear the headline
// (~24–76%) and body (~33–67%) and so the lowest plate ends ~80px above the box
// bottom — mirroring the top margin for vertical balance.
// Images chosen so none repeats a Featured Projects panel further down the page
// (Featured uses broadway/mucho-abbotsford/heal/fresh-haul/medico/sunshine).
// Five 3:4 plates arranged as a balanced, symmetric valley arc UNDER the centred
// headline: they fill the full width evenly (no hollow middle), step down toward
// a centre anchor, and clear the headline/body above. Each plate settles calmly
// into its resting arc position once, as the section scrolls into view.
const MOSAIC = [
  { img: 'co-working-space.jpg', left: '4%', top: '34%', w: '18%', ar: 'aspect-[3/4]' },
  { img: 'mortgage-offices.jpg', left: '24%', top: '42%', w: '19%', ar: 'aspect-[3/4]' },
  { img: 'ignis-gale.jpg', left: '41%', top: '50%', w: '20%', ar: 'aspect-[3/4]' },
  { img: 'riarh-hq.jpg', left: '63%', top: '42%', w: '19%', ar: 'aspect-[3/4]' },
  { img: 'mucho-burrito-burnaby.jpg', left: '81%', top: '34%', w: '17%', ar: 'aspect-[3/4]' },
]

function ScatterTile({
  tile,
  index,
}: {
  tile: (typeof MOSAIC)[number]
  index: number
}) {
  const reduce = useReducedMotion()
  // Clean whileInView reveal: each plate fades + rises + scales gently into its
  // (already balanced) arc position once, with a small per-plate stagger. No
  // scroll-linked fly-in, so the arc assembles calmly without janky horizontal
  // motion or collisions.
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...SPRING, ease: EASE, delay: index * 0.08 }}
      style={{ left: tile.left, top: tile.top, width: tile.w }}
      className={'absolute overflow-hidden ' + tile.ar}
    >
      <img
        src={asset('projects/' + tile.img)}
        alt="Riarh Group completed interior"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
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
        className="flex items-center gap-4"
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
        {/* Desktop only (lg+): headline woven into the floating photo scatter.
            At tablet (md) the % positions shrink the plates and fling the outer
            two off the edges, leaving the lower half empty — so tablet uses the
            stacked grid below. */}
        <div className="relative hidden h-[880px] lg:block">
          <div className="absolute inset-x-0 top-0 z-10">
            <Header />
          </div>
          {MOSAIC.map((tile, i) => (
            <ScatterTile key={tile.img} tile={tile} index={i} />
          ))}
        </div>

        {/* Mobile + tablet (below lg): header then a clean stacked grid */}
        <div className="lg:hidden">
          <Header />
          <div className="mt-12 grid grid-cols-2 gap-4">
            {MOSAIC.map((tile, i) => {
              // 5 plates in a 2-col grid leaves a lone orphan in the last row.
              // Let the final (odd) plate span the full width as a banner so the
              // grid resolves cleanly with no empty cell.
              const isLast = i === MOSAIC.length - 1
              const odd = MOSAIC.length % 2 === 1
              return (
                <div
                  key={tile.img}
                  className={
                    'relative overflow-hidden ' +
                    (isLast && odd ? 'col-span-2 aspect-[16/9]' : tile.ar)
                  }
                >
                  <img
                    src={asset('projects/' + tile.img)}
                    alt="Riarh Group completed interior"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
