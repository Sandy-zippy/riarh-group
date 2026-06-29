import { Link } from 'react-router-dom'
import { motion, useTransform } from 'framer-motion'
import { SPRING } from '../motion'
import { useScrollProgress } from '../hooks/useScrollProgress'
import Portfolio from '../sections/Portfolio'
import SectorMarquee from '../sections/SectorMarquee'
import { SpotlightCard } from '../components/premium'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

// "Building for Business Success" capabilities — Tenant Improvements promoted
// first, per Dal's brief. Outcome framed, no unverified claims.
const CAPABILITIES = [
  {
    title: 'Tenant Improvements',
    desc: 'Whether you are taking over a new space or reshaping the one you have, we turn empty shells and tired interiors into fully operational commercial environments, sequenced to keep disruption low and built to pass inspection the first time.',
  },
  {
    title: 'Complex & Specialized Facilities',
    desc: 'Specialty environments like healthcare clinics, daycares, and restaurants engineered around real workflows, elevated guest experiences, and the inspections that come with them.',
  },
  {
    title: 'Retail & Office Environments',
    desc: 'Retail storefronts, corporate offices, and co-working floors built to open on schedule, with the finish that earns a second visit.',
  },
]

// "The Riarh Standard" — three reasons experience shows, paired with real builds.
const STANDARD = [
  {
    title: 'Unmatched Expertise',
    desc: '15+ years building across every major commercial sector in BC, from commercial and industrial to hospitality, retail, and healthcare.',
    image: 'medico-head-office.jpg',
  },
  {
    title: 'Client-Centered Approach',
    desc: 'One accountable team and one point of contact, start to finish. No handoffs, no dropped balls, no surprises on your timeline.',
    image: 'co-working-space.jpg',
  },
  {
    title: 'Enduring Quality',
    desc: 'We hold a zero-tolerance standard at every phase. What is designed is what gets built, and it holds up for the long run.',
    image: 'law-firm.jpg',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
}

export default function Commercial() {
  const hero = useScrollProgress<HTMLDivElement>()
  const heroY = useTransform(hero.progress, [0, 1], ['-6%', '6%'])

  const cta = useScrollProgress<HTMLDivElement>()
  const ctaY = useTransform(cta.progress, [0, 1], ['-8%', '8%'])

  return (
    <>
      {/* ── HERO — photo-backed, italic statement (matches ref hero) ── */}
      <section className="relative overflow-hidden bg-ink">
        <div ref={hero.ref} className="absolute inset-0">
          <motion.img
            src={asset('projects/_hero.jpg')}
            alt="Commercial build by Riarh Group"
            style={{ y: heroY }}
            className="h-[112%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </div>
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 md:min-h-[84vh] md:pb-28">
          <motion.div
            {...fadeUp}
            transition={SPRING}
            className="flex items-center gap-4"
          >
            <span className="eyebrow">Commercial</span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SPRING, delay: 0.2 }}
              className="h-px w-20 origin-left bg-accent"
            />
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.08 }}
            className="display display-xl mt-7 max-w-4xl text-balance text-cream"
          >
            Commercial builds that open on time, look the part, and{' '}
            <span className="italic">hold up for the long run.</span>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.16 }}
            className="body-ref mt-7 max-w-xl text-cream/80"
          >
            From medical clinics and restaurants to retail and industrial space,
            we deliver complex commercial builds managed in-house from first
            blueprint to final walkthrough.
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...SPRING, delay: 0.24 }} className="mt-9">
            <Link
              to="/contact-us"
              className="cta-shine inline-flex rounded-full bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-transform duration-200 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Start Your Build
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTOR BREADTH — endless marquee of the verticals we build ── */}
      <SectorMarquee />

      {/* ── PORTFOLIO — category-filtered (Commercial / Industrial / Tenant Improvements) ── */}
      <Portfolio />

      {/* ── BUILDING FOR BUSINESS SUCCESS — what we do, light section ── */}
      <section className="bg-cream text-ink">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <motion.div {...fadeUp} transition={SPRING} className="flex items-center gap-4">
                <span className="eyebrow">What We Do</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ ...SPRING, delay: 0.2 }}
                  className="h-px w-20 origin-left bg-accent"
                />
              </motion.div>
              <motion.h2
                {...fadeUp}
                transition={{ ...SPRING, delay: 0.08 }}
                className="display display-2xl mt-8 max-w-2xl text-ink"
              >
                We build commercial spaces that keep businesses{' '}
                <span className="italic">running.</span>
              </motion.h2>
            </div>
            <motion.div
              {...fadeUp}
              transition={{ ...SPRING, delay: 0.16 }}
              className="lg:pt-10"
            >
              <p className="body-ref max-w-md text-ink/70">
                From tenant improvements and offices, to restaurants and retail
                fit-outs, to specialized facilities and industrial spaces, if
                it's commercial and it needs to be done right, that's our lane.
                Every build is managed in-house, start to finish, with one team
                accountable for the entire project.
              </p>
            </motion.div>
          </div>

          {/* Three evenly sized capability cards (uniform text cards, each with
              a cursor spotlight). Equal-height by stretch so the row reads as a
              clean, balanced set rather than one promoted tile. */}
          <div className="mt-16 grid items-stretch gap-4 md:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ ...SPRING, delay: i * 0.08 }}
              >
                <SpotlightCard className="flex h-full flex-col rounded-xl border border-ink/10 bg-cream p-8 transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_12px_34px_-16px_rgba(218,119,52,0.4)] lg:p-9">
                  <span className="text-sm tracking-[0.04em] text-accent">0{i + 1}</span>
                  <h3 className="display mt-4 text-[1.4rem] leading-[1.3] text-ink">
                    {c.title}
                  </h3>
                  <p className="body-ref mt-3 text-ink/65">{c.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY EXPERIENCE MATTERS — statement band ── */}
      <section className="relative overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[78%] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(ellipse_at_center,rgba(218,119,52,0.09),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              {...fadeUp}
              transition={SPRING}
              className="flex items-center justify-center gap-4"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...SPRING, delay: 0.2 }}
                className="h-px w-12 origin-left bg-accent"
              />
              <span className="eyebrow">Why Experience Matters</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...SPRING, delay: 0.2 }}
                className="h-px w-12 origin-left bg-accent"
              />
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ ...SPRING, delay: 0.08 }}
              className="display display-2xl mt-8 text-cream"
            >
              In business, time is capital.
              <br />
              <span className="italic tracking-[0.08em]">We respect both.</span>
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ ...SPRING, delay: 0.16 }}
              className="body-ref mx-auto mt-7 max-w-xl text-cream/70"
            >
              Over 15 years of commercial construction across Western Canada,
              we have learned that a build is only as good as the
              schedule, the budget, and the team behind it. We protect all three.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── THE RIARH STANDARD — three pillars with imagery ── */}
      <section className="bg-cream text-ink">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <motion.div {...fadeUp} transition={SPRING} className="flex items-center gap-4">
            <span className="eyebrow">Built to Last</span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SPRING, delay: 0.2 }}
              className="h-px w-20 origin-left bg-accent"
            />
          </motion.div>
          <motion.h2
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.08 }}
            className="display display-xl mt-8 max-w-2xl text-ink"
          >
            The Riarh Standard
          </motion.h2>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {STANDARD.map((s, i) => (
              <motion.article
                key={s.title}
                {...fadeUp}
                transition={{ ...SPRING, delay: i * 0.08 }}
                className="group transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink/10 ring-1 ring-transparent transition-shadow duration-300 group-hover:shadow-[0_14px_38px_-18px_rgba(218,119,52,0.45)] group-hover:ring-accent/40">
                  <img
                    src={asset('projects/' + s.image)}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="display mt-6 text-[1.5rem] leading-[1.3] text-ink min-h-[3.9rem]">
                  {s.title}
                </h3>
                <p className="body-ref mt-3 text-ink/65">{s.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — photo-backed conversion band ── */}
      <section className="relative overflow-hidden bg-ink">
        <div ref={cta.ref} className="absolute inset-0">
          <motion.img
            src={asset('projects/riarh-hq.jpg')}
            alt=""
            aria-hidden
            style={{ y: ctaY }}
            className="h-[116%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/82" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          <motion.h2
            {...fadeUp}
            transition={SPRING}
            className="display display-xl mx-auto max-w-3xl text-cream"
          >
            Transform your commercial vision{' '}
            <span className="italic tracking-[0.08em]">into reality.</span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.08 }}
            className="body-ref mx-auto mt-6 max-w-lg text-cream/75"
          >
            Tell us about your project and we will walk you through scope, budget,
            and timeline. No obligation, just a straight answer.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.16 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/contact-us"
              className="cta-shine inline-flex w-full justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-transform duration-200 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 active:scale-[0.97] sm:w-auto"
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
