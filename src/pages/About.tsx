import { Link } from 'react-router-dom'
import {
  motion,
  useTransform,
  useInView,
  useMotionValue,
  animate,
  useReducedMotion,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SPRING, EASE } from '../motion'
import { STATS } from '../data/site'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { SpotlightCard } from '../components/premium'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

const enter = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' as const },
}

// The four ethos values. Innovation copy is fixed by the brief; the other three
// are clean, on-brand statements that match the reference voice.
const VALUES = [
  {
    title: 'Integrity',
    desc: 'We build right, even when no one is watching. We hold to the strictest codes and ethical standards so your asset is sound, compliant, and honestly delivered.',
  },
  {
    title: 'Stewardship',
    desc: 'We treat your budget as our own. Through disciplined value engineering, we make every dollar work harder and protect the long-term value of what we build.',
  },
  {
    title: 'Ownership',
    desc: 'We do not pass the buck to subcontractors. One team takes radical responsibility for the outcome, from the first drawing to the final walkthrough.',
  },
  {
    title: 'Innovation',
    desc: 'We use 3D virtual design and modern building science to reduce waste, cut costs, and keep your project on schedule, before construction even starts.',
  },
]

// Leadership team. Names + roles supplied verbatim; descriptor lines are
// generic to the role (no fabricated personal history). Monogram initials only,
// since we hold no headshots for Terry or Rochelle and keep all three consistent.
const TEAM = [
  {
    name: 'Dal Riarh',
    initials: 'DR',
    role: 'Founder & CEO',
    desc: 'Sets the standard and stays close to every build from first drawing to final walkthrough.',
  },
  {
    name: 'Terry Sihota',
    initials: 'TS',
    role: 'Project Manager',
    desc: 'Keeps each project on scope, on budget, and on schedule with disciplined day-to-day oversight.',
  },
  {
    name: 'Rochelle',
    initials: 'R',
    role: 'Project Coordinator',
    desc: 'Aligns crews, clients, and timelines so every detail moves through the build without friction.',
  },
]

// Self-drawing eyebrow hairline: scaleX 0->1 from the left on scroll-in.
// Final width is identical to the static w-20 rule it replaces.
function AccentRule({ className = '' }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...SPRING, duration: 0.6 }}
      style={{ transformOrigin: 'left' }}
      className={`h-px w-20 bg-accent ${className}`}
    />
  )
}

// Stat suffix rendering matches the Decades band: base full size, "+" raised.
// On scroll-in the leading number ticks 0 -> target once (~1.2s); a trailing
// unit (e.g. "K") and the raised "+" are preserved exactly. Honors reduced motion.
function Stat({ value }: { value: string }) {
  const m = value.match(/^(.*?)(\+)?$/)
  const base = m ? m[1] : value
  const plus = m && m[2] ? m[2] : ''
  // Split the base into a leading number and a trailing unit ("100K" -> 100 + "K").
  const nm = base.match(/^([\d.]+)(.*)$/)
  const target = nm ? parseFloat(nm[1]) : NaN
  const unit = nm ? nm[2] : ''

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isNaN(target)) return
    if (!inView || reduce) {
      setDisplay(target)
      return
    }
    const controls = animate(mv, target, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, reduce, target, mv])

  const raisedPlus = plus && (
    <span className="text-[0.42em]" style={{ verticalAlign: '0.55em' }}>
      {plus}
    </span>
  )

  if (isNaN(target)) {
    return (
      <span ref={ref}>
        {base}
        {raisedPlus}
      </span>
    )
  }

  return (
    <span ref={ref}>
      {Math.round(display)}
      {unit}
      {raisedPlus}
    </span>
  )
}

/* 1 ── HERO. Reference: "The Evolution of Excellence" heading top-left on a
   dark band, then a full-bleed exterior photo. Clears the fixed 64px nav. */
function Hero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const imageY = useTransform(progress, [0, 1], ['-6%', '8%'], { ease: EASE })
  const imageScale = useTransform(progress, [0, 1], [1.04, 1.1], { ease: EASE })

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 md:pt-28 md:pb-16">
        {/* Aurora: one very low-opacity warm radial behind the heading only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 left-0 h-[460px] w-[680px] max-w-full"
          style={{
            background:
              'radial-gradient(ellipse at top left, rgba(218,119,52,0.10), rgba(218,119,52,0) 70%)',
          }}
        />
        <motion.div
          {...enter}
          transition={SPRING}
          className="relative z-10 flex items-center gap-4"
        >
          <span className="eyebrow">The Evolution of Excellence</span>
          <AccentRule className="hidden sm:block" />
        </motion.div>

        <div className="relative z-10 mt-10 grid gap-10 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:items-end">
          <motion.h1
            {...enter}
            transition={{ ...SPRING, delay: 0.08 }}
            className="display display-xl max-w-3xl text-cream"
          >
            Built from the most demanding environment in construction,{' '}
            <span className="italic">healthcare,</span> and applied to every
            commercial build we take on.
          </motion.h1>
          <motion.p
            {...enter}
            transition={{ ...SPRING, delay: 0.16 }}
            className="body-ref max-w-sm text-muted md:pb-3"
          >
            15+ years of delivering complex, client-driven commercial work that
            defines quality across Western Canada.
          </motion.p>
        </div>
      </div>

      {/* Full-bleed exterior band */}
      <div
        ref={ref}
        className="relative h-[60vh] min-h-[360px] w-full overflow-hidden md:h-[82vh]"
      >
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-x-0 -top-[8%] h-[116%] w-full will-change-transform"
        >
          <img
            src={asset('projects/hero-about.jpg')}
            alt="Inside Riarh Group's own headquarters in Vancouver"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-ink/30" />
      </div>
    </section>
  )
}

/* 2 ── ORIGIN OF PRECISION. Reference: large 82px heading on a light band with
   the origin story set as a body column to the right. */
function Origin() {
  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end md:gap-20">
          <motion.h2
            {...enter}
            transition={SPRING}
            className="display display-hero text-ink"
          >
            Origin of Precision.
          </motion.h2>

          <div className="max-w-xl space-y-6">
            <motion.p
              {...enter}
              transition={{ ...SPRING, delay: 0.1 }}
              className="body-ref text-ink/70"
            >
              Riarh Group was forged in healthcare construction, where the margin
              for error is zero. Operating theatres, clinics, and pharmacies
              leave no room for shortcuts, so we learned to obsess over the
              details others overlook.
            </motion.p>
            <motion.p
              {...enter}
              transition={{ ...SPRING, delay: 0.16 }}
              className="body-ref text-ink/70"
            >
              We took that discipline and applied it to every commercial build
              we take on. Today we bring that same clinical precision to head
              offices, restaurants, retail, and industrial space across the
              region.
            </motion.p>
            <motion.p
              {...enter}
              transition={{ ...SPRING, delay: 0.22 }}
              className="body-ref text-ink/70"
            >
              The buildings change. The standard never does.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 3 ── DECADES OF EXPERIENCE + STATS. Reference: heading left, intro right,
   then a three-up stat row on dark. */
function Decades() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-end md:gap-20">
          <motion.h2
            {...enter}
            transition={SPRING}
            className="display display-xl max-w-md text-cream"
          >
            Breadth of experience.
          </motion.h2>
          <motion.p
            {...enter}
            transition={{ ...SPRING, delay: 0.1 }}
            className="body-ref max-w-xl text-muted"
          >
            Our reputation is built on 15+ years of commercial construction
            across Western Canada. The numbers tell
            part of the story. The relationships tell the rest.
          </motion.p>
        </div>

        <div className="mt-16 border-t border-line pt-16 md:mt-20 md:pt-20">
          <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
            {STATS.map(([value, label], i) => (
              <motion.div
                key={label}
                {...enter}
                transition={{ ...SPRING, delay: i * 0.1 }}
              >
                <div className="display text-[2.875rem] text-cream">
                  <Stat value={value} />
                </div>
                <div className="mt-4 max-w-[8.75rem] text-sm leading-[1.92] text-cream/70">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* 4 ── RELATIONSHIPS QUOTE. Reference: italic two-line statement on the left,
   a tall photo to the right, on dark. */
function Relationships() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const imageY = useTransform(progress, [0, 1], ['-7%', '7%'], { ease: EASE })

  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="border-t border-line pt-24 md:pt-32">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-20">
            <div>
              <motion.div
                {...enter}
                transition={SPRING}
                className="flex items-center gap-4"
              >
                <span className="eyebrow">Our Promise</span>
                <AccentRule />
              </motion.div>
              <motion.h2
                {...enter}
                transition={{ ...SPRING, delay: 0.08 }}
                className="display display-xl mt-8 max-w-lg text-cream"
              >
                We build relationships first.
                <span className="italic block">The structures follow.</span>
              </motion.h2>
              <motion.p
                {...enter}
                transition={{ ...SPRING, delay: 0.16 }}
                className="body-ref mt-8 max-w-md text-muted"
              >
                Every project begins with a relationship built on transparency.
                We listen first, set honest expectations, and earn the trust
                that turns a single build into a long-standing partnership.
              </motion.p>
            </div>

            <motion.div
              {...enter}
              transition={{ ...SPRING, delay: 0.12 }}
              className="relative aspect-[4/3] overflow-hidden md:aspect-[5/6]"
            >
              <div
                ref={ref}
                className="absolute inset-0 overflow-hidden"
              >
                <motion.div
                  style={{ y: imageY }}
                  className="absolute inset-x-0 -top-[7%] h-[114%] w-full will-change-transform"
                >
                  <img
                    src={asset('projects/co-working-space.jpg')}
                    alt="Riarh Group team reviewing a commercial project"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 5 ── DAL RIARH BIO. Reference: founder name + expanded message. Per brief no
   headshot and no team cards. */
function Founder() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="border-t border-line pt-24 md:pt-32">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-20">
            <div>
              <motion.div
                {...enter}
                transition={SPRING}
                className="flex items-center gap-4"
              >
                <span className="eyebrow">From The Founder</span>
                <AccentRule />
              </motion.div>
              <motion.p
                {...enter}
                transition={{ ...SPRING, delay: 0.1 }}
                className="display mt-8 text-[2.4rem] leading-none italic text-cream"
              >
                Dal Riarh
              </motion.p>
              <motion.p
                {...enter}
                transition={{ ...SPRING, delay: 0.16 }}
                className="mt-4 text-sm uppercase tracking-[0.16em] text-cream/55"
              >
                Founder &amp; CEO
              </motion.p>
              {/* Founder headshot — closes the trust gap Ameya flagged. Real
                  photo of Dal (from the reference), cropped to a portrait. */}
              <motion.div
                {...enter}
                transition={{ ...SPRING, delay: 0.22 }}
                className="relative mt-8 aspect-[4/5] max-w-[18rem] overflow-hidden rounded-xl ring-1 ring-line"
              >
                <img
                  src={asset('projects/dal-ceo-portrait.jpg')}
                  alt="Dal Riarh, Founder and CEO of Riarh Group"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[center_38%]"
                />
              </motion.div>
            </div>

            <div className="max-w-2xl space-y-6 md:pt-2">
              <motion.p
                {...enter}
                transition={{ ...SPRING, delay: 0.12 }}
                className="body-ref text-muted"
              >
                Dal Riarh founded Riarh Group with one conviction. A building is
                only as good as the relationship behind it. In more than 15
                years he has grown the firm from a boutique healthcare
                specialist into a full-service commercial contractor, without
                ever loosening the standard that started it all.
              </motion.p>
              <motion.p
                {...enter}
                transition={{ ...SPRING, delay: 0.18 }}
                className="body-ref text-muted"
              >
                He stays close to every project, treating each client's budget
                as his own and holding every crew to the same uncompromising codes.
                His approach is direct and honest. Tell the client what is
                achievable, then deliver it without surprises.
              </motion.p>
              <motion.p
                {...enter}
                transition={{ ...SPRING, delay: 0.24 }}
                className="body-ref text-muted"
              >
                That philosophy, that transparency builds trust and trust builds
                legacies, now sits at the centre of how the entire team operates.
                Thank you for considering Riarh Group for your project. We look
                forward to building something lasting together.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 6 ── TEAM. The leadership behind the work: a three-up row of monogram cards
   on dark, matching the site's editorial fade-up + stagger. No headshots, so
   all three read as consistent terracotta-ringed monograms. */
function Team() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="border-t border-line pt-24 md:pt-32">
          <motion.div
            {...enter}
            transition={SPRING}
            className="flex items-center gap-4"
          >
            <span className="eyebrow">The Team</span>
            <AccentRule />
          </motion.div>
          <motion.h2
            {...enter}
            transition={{ ...SPRING, delay: 0.08 }}
            className="display display-xl mt-8 max-w-2xl text-cream"
          >
            The people behind{' '}
            <span className="italic">every build.</span>
          </motion.h2>

          <div className="mt-14 grid gap-x-12 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                {...enter}
                transition={{ ...SPRING, delay: i * 0.1 }}
                className="group transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-1"
              >
                <SpotlightCard className="h-full rounded-xl border border-line/60 p-8 transition-colors duration-300 group-hover:border-accent/40">
                  <span
                    aria-hidden
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-ink text-lg uppercase tracking-[0.08em] text-cream/80 ring-1 ring-accent/60 transition-colors duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:bg-accent group-hover:text-ink group-hover:ring-accent"
                  >
                    {m.initials}
                  </span>
                  <h3 className="display mt-7 text-[1.9375rem] leading-none text-cream">
                    {m.name}
                  </h3>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-accent">
                    {m.role}
                  </p>
                  <p className="body-ref mt-5 text-muted">{m.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* 7 ── ETHOS. Reference: a tall photo on the left and a 2x2 values grid on the
   right (Integrity / Stewardship / Ownership / Innovation), on dark. */
function Ethos() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const imageY = useTransform(progress, [0, 1], ['-6%', '6%'], { ease: EASE })

  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="border-t border-line pt-24 md:pt-32">
          <motion.div
            {...enter}
            transition={SPRING}
            className="flex items-center gap-4"
          >
            <span className="eyebrow">Our Ethos</span>
            <AccentRule />
          </motion.div>
          <motion.h2
            {...enter}
            transition={{ ...SPRING, delay: 0.08 }}
            className="display display-xl mt-8 max-w-2xl text-cream"
          >
            The values that hold up{' '}
            <span className="italic whitespace-nowrap">every build.</span>
          </motion.h2>

          <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-20">
            <motion.div
              {...enter}
              transition={{ ...SPRING, delay: 0.12 }}
              className="relative hidden aspect-[4/5] overflow-hidden md:block md:aspect-auto md:h-full md:min-h-[34rem]"
            >
              <div ref={ref} className="absolute inset-0 overflow-hidden">
                <motion.div
                  style={{ y: imageY }}
                  className="absolute inset-x-0 -top-[6%] h-[112%] w-full will-change-transform"
                >
                  <img
                    src={asset('projects/law-firm.jpg')}
                    alt="Interior of a Riarh Group commercial build"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>

            <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  {...enter}
                  transition={{ ...SPRING, delay: (i % 2) * 0.08 }}
                  className="group max-w-sm transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-sm text-cream/70 transition-colors duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                    {i + 1}
                  </span>
                  <h3 className="display mt-7 text-[1.9375rem] leading-none text-cream">
                    {v.title}
                  </h3>
                  <p className="body-ref mt-5 text-muted">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 7 ── A COLLECTIVE OF EXPERTS. Reference: closing statement + CTA on a light
   band before the global footer. */
function CTA() {
  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center md:py-32">
        <motion.div
          {...enter}
          transition={SPRING}
          className="flex items-center gap-4"
        >
          <span className="eyebrow">A Collective of Experts</span>
          <AccentRule />
        </motion.div>
        <motion.h2
          {...enter}
          transition={{ ...SPRING, delay: 0.08 }}
          className="display display-xl mt-8 max-w-2xl text-balance text-ink"
        >
          We do not just hire workers. We recruit{' '}
          <span className="italic">problem solvers.</span>
        </motion.h2>
        <motion.p
          {...enter}
          transition={{ ...SPRING, delay: 0.14 }}
          className="body-ref mt-6 max-w-xl text-balance text-ink/70"
        >
          We bring deep commercial construction and project management experience
          to every build, equipped to handle the complexities of modern commercial
          development. Let us build something that lasts.
        </motion.p>
        <motion.div {...enter} transition={{ ...SPRING, delay: 0.2 }}>
          <Link
            to="/contact-us"
            className="cta-shine mt-10 inline-flex rounded-full bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-transform duration-200 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Let's Talk
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Hero />
      <Origin />
      <Decades />
      <Relationships />
      <Founder />
      <Team />
      <Ethos />
      <CTA />
    </>
  )
}
