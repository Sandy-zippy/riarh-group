import { motion, useReducedMotion, useTransform, type MotionValue, type TransformTemplate } from 'framer-motion'
import { WHY } from '../data/site'
import { EASE, SPRING } from '../motion'
import { useScrollProgress } from '../hooks/useScrollProgress'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

// Why mechanic: three LARGE equal circles (~40vw) — Precision / Partnership /
// Expertise — open as a wide venn spread across the section. As the pinned
// section scrolls, the outer two slide ALL THE WAY INTO the centre so the three
// become ONE single circle, their words crossfading out as the RIARH GROUP
// wordmark resolves inside. The two outer strokes fade as they merge so a single
// clean ring remains (the centre ring). Pure transform = GPU-accelerated; the
// -50%/-50% centring is composed via transformTemplate so it's never clobbered.
const RINGS = [
  // Precision — left, opens wide then slides fully to dead centre.
  { dx0: '-26vw', dy0: '0vh', keep: false },
  // Partnership — centre; the single ring that remains after the merge.
  { dx0: '0vw', dy0: '0vh', keep: true },
  // Expertise — right, mirror of Precision.
  { dx0: '26vw', dy0: '0vh', keep: false },
]

const tpl: TransformTemplate = (_latest, generated) =>
  `translate(-50%, -50%) ${generated}`

function Ring({
  cfg,
  why,
  progress,
}: {
  cfg: (typeof RINGS)[number]
  why: (typeof WHY)[number]
  progress: MotionValue<number>
}) {
  // Wide venn → all three converge to EXACT dead centre (become one circle).
  const x = useTransform(progress, [0.28, 0.56], [cfg.dx0, '0vw'], { ease: EASE })
  const y = useTransform(progress, [0.28, 0.56], [cfg.dy0, '0vh'], { ease: EASE })
  // Words fade out as the circles gather (early, so they never pile up at centre).
  const textOpacity = useTransform(progress, [0.3, 0.42], [1, 0], { ease: EASE })
  // The two outer strokes dissolve at the merge so a single clean ring is left;
  // the centre ring's stroke stays. This is what makes "three become one".
  const borderOpacity = useTransform(
    progress,
    cfg.keep ? [0, 1] : [0.46, 0.56],
    cfg.keep ? [0.3, 0.3] : [0.3, 0],
    { ease: EASE },
  )

  return (
    <motion.div
      style={{ left: '50%', top: '50%', x, y }}
      transformTemplate={tpl}
      className="absolute h-[clamp(28rem,40vw,40rem)] w-[clamp(28rem,40vw,40rem)]"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute inset-0 rounded-full border border-cream"
      />
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Client copy is full outcome phrases, not single words — size + width
            are tuned so all three titles wrap to ~2 lines and sit cleanly inside
            the circle's inscribed area (never past the curved edge). */}
        <div className="mx-auto max-w-[240px] md:max-w-[300px]">
          <h3 className="display text-[clamp(1.15rem,2.1vw,1.75rem)] leading-[1.3] text-cream">
            {why.title}
          </h3>
          <p className="mx-auto mt-3 max-w-[200px] text-[0.875rem] font-thin leading-[1.92] tracking-[0.04em] text-muted md:max-w-[260px]">
            {why.desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function WhyChooseUs() {
  const { ref, progress } = useScrollProgress<HTMLElement>()
  const reduce = useReducedMotion()
  // The lockup resolves to full strength once the circles have merged.
  const logoOpacity = useTransform(progress, [0.52, 0.66], [0, 1], { ease: EASE })
  const logoScale = useTransform(progress, [0.52, 0.66], [0.92, 1], { ease: EASE })

  return (
    <section ref={ref} className="relative bg-ink lg:h-[260vh]">
      {/* Desktop only (lg+): pinned converging-ring mechanic. The rings overlap
          heavily, so it needs the horizontal room a wide viewport gives. At
          tablet (md, 768–1023) the three circles collapse onto each other and the
          three text blocks collide illegibly, so tablet uses the stacked list. */}
      <div className="sticky top-0 hidden h-screen overflow-hidden lg:block">
        {/* Eyebrow pinned top-left within the viewport */}
        <div className="absolute inset-x-0 top-28">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-6">
            <span className="eyebrow">Why Choose Us</span>
            <motion.span
              initial={{ scaleX: reduce ? 1 : 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="h-px w-20 origin-left bg-accent"
            />
          </div>
        </div>

        {/* Converging ring stage */}
        <div className="absolute inset-0">
          {RINGS.map((cfg, i) => (
            <Ring key={i} cfg={cfg} why={WHY[i]} progress={progress} />
          ))}

          {/* RIARH GROUP lockup, revealed inside the single merged circle */}
          <motion.img
            src={asset('logo-wordmark.png')}
            alt="Riarh Group"
            aria-hidden
            style={{ opacity: logoOpacity, scale: logoScale, x: '-50%', y: '-50%' }}
            className="pointer-events-none absolute left-1/2 top-1/2 w-[clamp(220px,23vw,340px)]"
          />
        </div>
      </div>

      {/* Mobile + tablet (below lg): the overlapping rings collapse onto one
          another (19vw is tiny in a narrow frame) and the three text blocks pile
          up illegibly, so render a clean stacked editorial list instead. */}
      <div className="px-6 pt-28 pb-20 lg:hidden">
        <div className="flex items-center gap-4">
          <span className="eyebrow">Why Choose Us</span>
          <motion.span
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="h-px flex-1 origin-left bg-accent"
          />
        </div>
        <div className="mt-12 flex flex-col gap-10">
          {WHY.map((why, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: i * 0.08 }}
              className="border-t border-line pt-8"
            >
              <h3 className="display text-[1.65rem] leading-[1.3] text-cream">
                {why.title}
              </h3>
              <p className="mt-4 max-w-md text-[0.875rem] font-thin leading-[1.92] tracking-[0.04em] text-muted md:max-w-2xl">
                {why.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
