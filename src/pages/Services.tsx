import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { SPRING } from '../motion'
import { PROJECTS, cardImage } from '../data/site'
import StickyPhases from '../components/StickyPhases'

const BASE = import.meta.env.BASE_URL

// ── The three delivery phases (Planning / Design / Construction). The short
// word carries the visual weight as the black primary headline (`lead`); the
// descriptive sentence sits above it as the small orange subheading (`title`).
// Numbers are intentionally dropped (`num` empty). Copy is on brand and
// reflects real commercial practice, no unverified claims. Images reuse real
// project photography from Dal's pack. ──
type Phase = {
  num: string
  title: string
  lead: string
  desc: string
  image: string
}

const PHASES: Phase[] = [
  {
    num: '',
    title: 'Mitigating risk before ground is broken',
    lead: 'Planning',
    desc: 'We anchor every project in data. From feasibility studies to pro-forma budgeting and constructability reviews, we identify constraints early so we can protect your capital and accelerate your timeline.',
    image: 'law-firm.jpg',
  },
  {
    num: '',
    title: 'Bridging architectural intent with physical reality',
    lead: 'Design',
    desc: 'Collaborative coordination with architects and engineers. We apply value engineering to optimize cost without compromising the integrity of the design vision, so the drawings and the budget stay in lockstep.',
    image: 'co-working-space.jpg',
  },
  {
    num: '',
    title: 'Precision execution and rigorous site logistics',
    lead: 'Construction',
    desc: 'Active management of the critical path. Our site superintendents enforce strict quality controls and safety protocols, ensuring a build that meets the highest standards of durability and finish.',
    image: 'broadway-towers.jpg',
  },
]

// Featured commercial builds for the closing gallery — a pharmacy, a wellness
// clinic, and an industrial warehouse, echoing the reference grid of three.
const FEATURED = PROJECTS.filter(
  (p) =>
    p.slug &&
    ['Happy Prairie Pharmacy', 'Heal Wellness', 'Fresh Haul Logistics'].includes(
      p.name,
    ),
)

export default function Services() {
  const reduce = useReducedMotion()
  // Self-drawing hairline: scaleX 0->1 from the left on scroll-in. Final width
  // (w-20) is unchanged; reduced-motion users get the line at rest.
  const hairline = {
    initial: reduce ? { scaleX: 1 } : { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, margin: '-80px' } as const,
    transition: { ...SPRING, delay: 0.12 },
    style: { transformOrigin: 'left' as const },
  }

  return (
    <>
      {/* ── OUR SERVICES — opening statement band (clears the fixed nav) ── */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 md:pb-32 md:pt-40">
          {/* Aurora — one very low-opacity warm radial behind the heading. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 50% 48%, rgba(218,119,52,0.10), rgba(218,119,52,0.04) 45%, transparent 72%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={SPRING}
            className="relative flex items-center justify-center gap-4"
          >
            <motion.span {...hairline} className="h-px w-20 bg-accent" />
            <span className="eyebrow">Our Services</span>
            <motion.span {...hairline} className="h-px w-20 bg-accent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.08 }}
            className="display display-hero relative mx-auto mt-10 max-w-5xl text-center text-cream"
          >
            First initial plans to final walkthrough.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.16 }}
            className="relative mx-auto mt-8 max-w-md text-center body-ref text-muted"
          >
            Every phase of your build, managed in-house by one accountable team.
          </motion.p>
        </div>
      </section>

      {/* ── PHASES — sticky scroll reveal (pinned image, scrolling steps) ── */}
      <StickyPhases phases={PHASES} />

      {/* ── FEATURED PROJECTS (dark) ── */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={SPRING}
            className="flex items-center gap-4"
          >
            <span className="eyebrow">Our Featured Projects</span>
            <motion.span {...hairline} className="h-px w-20 bg-accent" />
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {FEATURED.map((project, i) => (
              <motion.div
                key={`${project.name}-${i}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...SPRING, delay: i * 0.08 }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="group relative aspect-[3/4] w-full overflow-hidden ring-1 ring-transparent transition-shadow duration-500 ease-[cubic-bezier(0.44,0,0.56,1)] hover:ring-accent/40 hover:shadow-[0_24px_60px_-18px_rgba(218,119,52,0.45)]"
              >
                <Link
                  to={`/commercial/${project.slug}`}
                  aria-label={`${project.name}, ${project.location}. View project gallery.`}
                  className="absolute inset-0 z-20"
                />
                <img
                  src={`${BASE}${cardImage(project)}`}
                  alt={`${project.name}, ${project.scope}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6 lg:p-7">
                  <h3 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-cream">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-base text-cream/70">{project.location}</p>
                  <p className="mt-1 text-sm text-cream/75">{project.scope}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND (split) ── */}
      <section className="bg-ink text-cream">
        <div className="grid items-stretch lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-20 md:px-12 md:py-28 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={SPRING}
              className="display display-2xl max-w-md text-cream"
            >
              Transform your commercial vision{' '}
              into reality.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SPRING, delay: 0.08 }}
            >
              <Link
                to="/contact-us"
                className="mt-8 inline-block rounded-none border border-cream/40 px-9 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Let's Talk
              </Link>
            </motion.div>
          </div>

          <div className="relative min-h-[18rem] overflow-hidden lg:min-h-[26rem]">
            <img
              src={`${BASE}projects/cta-services.jpg`}
              alt="A completed Riarh Group commercial build at dusk"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}
