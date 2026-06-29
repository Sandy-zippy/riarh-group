import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { SPRING, EASE } from '../motion'
import { PROJECTS, cardImage } from '../data/site'
import { useScrollProgress } from '../hooks/useScrollProgress'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

type Project = (typeof PROJECTS)[number]

// A tight, curated showcase (not an endless reel): the strongest image-backed
// builds, each a full-bleed editorial panel. Matches the reference — eyebrow
// top-left, the project name centred large with the location beneath, and a
// gentle scroll reveal (image drifts, title rises) rather than a flat slider.
const FEATURED: Project[] = PROJECTS.filter((p) => p.slug).slice(0, 6)

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  // Hooks are called unconditionally (stable order); reduced-motion only changes
  // the transform OUTPUT ranges below, never which hooks run.
  const reduce = useReducedMotion()
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  // Vertical drift only, with the lightest possible scale — keeps a 1600px photo
  // as sharp as it can be full-bleed (heavy zoom was softening it). When the user
  // prefers reduced motion we park the image at a neutral, static frame: no
  // drift, no scale, no title rise.
  const imageY = useTransform(progress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%'], { ease: EASE })
  const imageScale = useTransform(progress, [0, 1], reduce ? [1, 1] : [1.02, 1.06], { ease: EASE })
  // The title rises through the frame as the panel passes — a reveal, not a slide.
  const titleY = useTransform(progress, [0, 1], reduce ? ['0px', '0px'] : ['44px', '-44px'], { ease: EASE })
  // Scroll-linked accent line along the panel base — a quiet, Framer-style
  // progress cue. Parked at full width (a flush divider) under reduced motion.
  const lineScaleX = useTransform(progress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <div
      ref={ref}
      className="group relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden"
    >
      <Link
        to={`/commercial/${project.slug}`}
        aria-label={`${project.name}, ${project.location}. View project gallery.`}
        className="absolute inset-0 z-20"
      />

      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-x-0 -top-[6%] h-[112%] w-full will-change-transform"
      >
        <img
          src={asset(cardImage(project)!)}
          alt={`${project.name}, ${project.scope}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full transform-gpu object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:scale-[1.055] group-hover:brightness-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:brightness-100"
        />
      </motion.div>

      {/* Legibility: top + bottom darkening and a centre vignette so the centred
          serif name reads on any photo (incl. bright glass) without crushing it. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/15 to-ink/65" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_45%_at_center,rgba(8,8,8,0.46)_0%,transparent_70%)]" />

      {/* Eyebrow, top-left */}
      <div className="absolute left-0 top-0 w-full">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 pt-10">
          <span className="eyebrow text-cream/90">Featured Commercial</span>
          <span className="h-px w-12 origin-left bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:w-16" />
          <span className="flex items-baseline gap-1.5 text-xs font-medium uppercase tracking-[0.16em] tabular-nums">
            <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-cream/45">/ {String(FEATURED.length).padStart(2, '0')}</span>
          </span>
        </div>
      </div>

      {/* Centred name + location */}
      <motion.div
        style={{ y: titleY }}
        className="relative z-10 flex flex-col items-center px-6 text-center will-change-transform"
      >
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ ...SPRING, duration: 0.6 }}
          className="display display-feat mx-auto max-w-[92vw] text-balance break-words text-cream [text-shadow:0_1px_12px_rgba(8,8,8,0.6)]"
        >
          {project.name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ ...SPRING, delay: 0.08 }}
          className="mx-auto mt-4 max-w-[90vw] text-balance text-[1.75rem] font-normal leading-tight tracking-normal text-cream/80 [text-shadow:0_1px_12px_rgba(8,8,8,0.6)]"
        >
          {project.location}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ ...SPRING, delay: 0.14 }}
          className="mx-auto mt-3 max-w-[28rem] text-sm tracking-[0.04em] text-cream/80 [text-shadow:0_1px_12px_rgba(8,8,8,0.6)]"
        >
          {project.scope}
        </motion.p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cream/55 transition-colors duration-500 group-hover:text-cream">
          <span className="relative">
            View projects
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:scale-x-100 motion-reduce:transition-none" />
          </span>
          <span
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          >
            ↗
          </span>
        </span>
      </motion.div>

      {/* Scroll-linked accent base line (Framer-style progress cue). */}
      <motion.div
        style={{ scaleX: lineScaleX }}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[2px] origin-left bg-accent/70 will-change-transform"
      />
    </div>
  )
}

export default function FeaturedProjects() {
  const reduce = useReducedMotion()
  return (
    <section className="relative bg-ink">
      {/* Intro */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-28 md:pb-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="flex items-center gap-4"
        >
          <span className="eyebrow">Featured Commercial</span>
          <motion.span
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="h-px w-20 origin-left bg-accent"
          />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ ...SPRING, delay: 0.08 }}
          className="display display-xl mt-8 max-w-4xl text-balance text-cream"
        >
          Built for Growth,
          <br />
          Across every commercial sector.
        </motion.h2>
      </div>

      {/* Full-bleed showcase panels, flush for a seamless scroll. */}
      <div className="flex flex-col">
        {FEATURED.map((project, i) => (
          <ProjectPanel key={`${project.name}-${i}`} project={project} index={i} />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          <Link
            to="/commercial"
            className="cta-shine inline-flex rounded-full bg-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-transform duration-200 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 active:scale-[0.97]"
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
