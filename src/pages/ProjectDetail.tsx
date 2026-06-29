import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useTransform } from 'framer-motion'
import { SPRING } from '../motion'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { GALLERIES, projectBySlug } from '../data/site'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' as const },
}

// A single gallery plate with a light vertical parallax drift, so the project
// reads as a walkthrough from front-of-house to back-of-house (Dal's requested
// image order is preserved exactly from the manifest).
//
// Each plate adapts to its photo's *natural* orientation, read on load. Mixed
// galleries (e.g. Woodland Veterinary's tall clinic shots at 1280×1920) used to
// be jammed into a fixed 16:10 landscape box and hard-cropped top-and-bottom.
// Now landscape photos keep a wide ratio while portrait photos use a portrait
// ratio, sit centred, and are width-capped so a tall image can't dominate the
// viewport — object-cover still prevents any distortion.
function Plate({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const y = useTransform(progress, [0, 1], ['-5%', '5%'])
  const [ratio, setRatio] = useState<number | null>(null)

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    if (w > 0 && h > 0) setRatio(w / h)
  }

  // Treat anything appreciably taller than wide as portrait.
  const portrait = ratio !== null && ratio < 0.9
  // Container aspect: portrait photos keep their natural (tall) ratio, clamped
  // so they never get absurdly narrow; landscape photos stay in a wide band
  // around 16:10 / 3:2. Before load we assume landscape to avoid layout jump.
  const aspect =
    ratio === null
      ? 16 / 10
      : portrait
        ? Math.max(ratio, 0.62)
        : Math.min(Math.max(ratio, 1.3), 1.9)

  return (
    <motion.div
      {...fadeUp}
      transition={SPRING}
      style={{ aspectRatio: String(aspect) }}
      className={`relative w-full overflow-hidden rounded-xl bg-ink-2 ${
        portrait ? 'mx-auto max-w-[22rem] sm:max-w-[24rem] md:max-w-[28rem]' : ''
      }`}
    >
      <div ref={ref} className="absolute inset-0 overflow-hidden">
        <motion.img
          src={asset(src)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={onLoad}
          style={{ y }}
          className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover"
        />
      </div>
    </motion.div>
  )
}

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = projectBySlug(slug)
  const gallery = GALLERIES[slug] ?? []

  // Hooks must run unconditionally (before any early return) to satisfy the
  // rules of hooks; the ref is simply unused on the not-found path.
  const heroP = useScrollProgress<HTMLDivElement>()
  const heroY = useTransform(heroP.progress, [0, 1], ['-6%', '8%'])

  // Unknown slug or no photos: send the visitor back to the gallery.
  if (!project || gallery.length === 0) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <p className="eyebrow mb-4">Project not found</p>
          <h1 className="display display-xl text-cream">This project has moved</h1>
          <Link
            to="/commercial"
            className="mt-8 inline-flex rounded-full border border-cream/40 px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            View all projects
          </Link>
        </div>
      </section>
    )
  }

  const hero = gallery[0]

  // Shared detail-page intro. Articles agree with the scope's first letter, and
  // a project can supply its own `intro` to override the template verbatim.
  const article = /^[aeiou]/.test(project.scope.toLowerCase().trim()) ? 'An' : 'A'
  const intro =
    project.intro ??
    `${article} ${project.scope.toLowerCase()} from first blueprint to final walkthrough, managed by one accountable team.`

  return (
    <>
      {/* ── HERO ── front-of-house photo, name anchored lower-left ── */}
      <section className="relative overflow-hidden bg-ink">
        <div ref={heroP.ref} className="absolute inset-0">
          <motion.img
            src={asset(hero)}
            alt={`${project.name}, ${project.scope}`}
            style={{ y: heroY }}
            className="h-[112%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        </div>
        <div className="relative mx-auto flex min-h-[68vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:min-h-[74vh] md:pb-20">
          <motion.div {...fadeUp} transition={SPRING}>
            <Link
              to="/commercial"
              className="-my-2 inline-flex min-h-[44px] items-center gap-2 py-2 text-xs font-medium uppercase tracking-[0.16em] text-cream/70 transition-colors hover:text-cream"
            >
              <span aria-hidden>←</span> All projects
            </Link>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.06 }}
            className="mt-8 flex items-center gap-4"
          >
            <span className="eyebrow text-cream/90">{project.sector}</span>
            <span className="h-px w-12 bg-accent" />
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.12 }}
            className="display display-hero mt-5 max-w-4xl text-cream"
          >
            {project.name}
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.18 }}
            className="mt-4 text-[1.25rem] text-cream/80"
          >
            {project.location}
          </motion.p>
        </div>
      </section>

      {/* ── META + SCOPE ── */}
      <section className="bg-ink">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-8 border-t border-line pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-20">
            <motion.dl {...fadeUp} transition={SPRING} className="space-y-6">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-accent">Location</dt>
                <dd className="mt-2 body-ref text-cream/80">{project.location}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-accent">Sector</dt>
                <dd className="mt-2 body-ref text-cream/80">{project.sector}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-accent">Scope</dt>
                <dd className="mt-2 body-ref text-cream/80">{project.scope}</dd>
              </div>
            </motion.dl>
            <motion.p
              {...fadeUp}
              transition={{ ...SPRING, delay: 0.1 }}
              className="display max-w-xl text-[clamp(1.5rem,2.6vw,2rem)] leading-snug text-cream"
            >
              {intro}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── ordered front-of-house to back-of-house ── */}
      <section className="bg-ink">
        <div className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
          <div className="flex flex-col gap-6 md:gap-8">
            {gallery.map((src, i) => (
              <Plate
                key={src}
                src={src}
                alt={`${project.name}, photo ${i + 1} of ${gallery.length}`}
                eager={false}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
