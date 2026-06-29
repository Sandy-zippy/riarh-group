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

// ── Intrinsic-orientation manifest ──────────────────────────────────────────
// Each photo's ratio (width / height) is measured from the real photo pack at
// build time and baked in here, so a plate's orientation is decided
// deterministically at render — never from a racy img.onLoad measurement (which
// flipped portraits in and out of landscape boxes depending on load timing).
// Every gallery except Woodland Veterinary is uniform 1.34 landscape (the
// DEFAULT_RATIO below); Woodland mixes 1.5 landscape facade/interior shots with
// 0.667 portrait clinic shots, which are the entries listed explicitly.
const DEFAULT_RATIO = 1.34
const PHOTO_RATIOS: Record<string, number> = {
  'projects/woodland-veterinary/01.jpg': 1.5,
  'projects/woodland-veterinary/02.jpg': 1.5,
  'projects/woodland-veterinary/03.jpg': 1.5,
  'projects/woodland-veterinary/04.jpg': 1.5,
  'projects/woodland-veterinary/05.jpg': 1.5,
  'projects/woodland-veterinary/06.jpg': 0.667,
  'projects/woodland-veterinary/07.jpg': 0.667,
  'projects/woodland-veterinary/08.jpg': 0.667,
  'projects/woodland-veterinary/09.jpg': 0.667,
  'projects/woodland-veterinary/10.jpg': 0.667,
  'projects/woodland-veterinary/11.jpg': 1.5,
  'projects/woodland-veterinary/12.jpg': 1.5,
  'projects/woodland-veterinary/13.jpg': 0.667,
  'projects/woodland-veterinary/14.jpg': 0.667,
  'projects/woodland-veterinary/15.jpg': 0.667,
  'projects/woodland-veterinary/16.jpg': 0.667,
}
const ratioOf = (src: string) => PHOTO_RATIOS[src] ?? DEFAULT_RATIO
const isPortrait = (src: string) => ratioOf(src) < 0.9

// Build the render plan for a gallery. Landscapes span both columns; portraits
// pair two-per-row; and a lone *trailing* portrait inside an odd-length run is
// promoted to a full-width centred slot, so a single tall photo can never leave
// an empty column void beside it. Photo order (front-of-house to back) is
// preserved exactly.
type PlatePlan = { src: string; index: number; promoted: boolean }
function planGallery(gallery: string[]): PlatePlan[] {
  const plan: PlatePlan[] = []
  let i = 0
  while (i < gallery.length) {
    if (!isPortrait(gallery[i])) {
      plan.push({ src: gallery[i], index: i, promoted: false })
      i++
      continue
    }
    // Maximal consecutive run of portraits starting at i.
    let j = i
    while (j < gallery.length && isPortrait(gallery[j])) j++
    const runLen = j - i
    for (let k = i; k < j; k++) {
      plan.push({ src: gallery[k], index: k, promoted: runLen % 2 === 1 && k === j - 1 })
    }
    i = j
  }
  return plan
}

// A single gallery plate with a light vertical parallax drift, so the project
// reads as a walkthrough from front-of-house to back-of-house. Orientation is
// passed in (from the baked manifest) rather than measured on load, so the
// layout is identical on every render: landscape photos keep a wide ratio and
// span both columns, portrait photos use their natural tall ratio and pair up
// one-per-column, and a promoted lone portrait fills the row centred and
// width-capped — object-cover still prevents any distortion.
function Plate({
  src,
  alt,
  eager,
  ratio,
  promoted,
}: {
  src: string
  alt: string
  eager: boolean
  ratio: number
  promoted: boolean
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const y = useTransform(progress, [0, 1], ['-5%', '5%'])

  const portrait = ratio < 0.9
  // Portrait photos keep their natural (tall) ratio, clamped so they never get
  // absurdly narrow; landscape photos stay in a wide band around 16:10 / 3:2.
  const aspect = portrait
    ? Math.max(ratio, 0.62)
    : Math.min(Math.max(ratio, 1.3), 1.9)

  const image = (
    <motion.img
      src={asset(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ y }}
      className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover"
    />
  )

  // Lone trailing portrait (odd run): fill the whole row but keep the photo at
  // its portrait ratio, centred and width-capped on a dark field. No side void,
  // no crop into a wide box, and it can't dominate the viewport.
  if (portrait && promoted) {
    return (
      <motion.div
        {...fadeUp}
        transition={SPRING}
        className="relative w-full overflow-hidden rounded-xl bg-ink-2 md:col-span-2"
      >
        <div className="mx-auto w-full max-w-[22rem] py-6 md:py-8">
          <div
            ref={ref}
            style={{ aspectRatio: String(aspect) }}
            className="relative w-full overflow-hidden rounded-lg"
          >
            {image}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      {...fadeUp}
      transition={SPRING}
      style={{ aspectRatio: String(aspect) }}
      className={`relative w-full overflow-hidden rounded-xl bg-ink-2 ${
        portrait ? '' : 'md:col-span-2'
      }`}
    >
      <div ref={ref} className="absolute inset-0 overflow-hidden">
        {image}
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
          {/* Landscapes span the full width; portraits take one column so two
              tall photos pair up side by side instead of floating narrow with
              voids. A lone trailing portrait is promoted to a full-width centred
              slot so it never leaves an empty column. Orientation is resolved
              deterministically from the baked manifest (no onLoad race), and
              photo order (front-of-house to back) is preserved. */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {planGallery(gallery).map(({ src, index, promoted }) => (
              <Plate
                key={src}
                src={src}
                alt={`${project.name}, photo ${index + 1} of ${gallery.length}`}
                eager={false}
                ratio={ratioOf(src)}
                promoted={promoted}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
