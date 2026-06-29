import { motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { EMAIL, OFFICES, SOCIAL } from '../data/site'
import { SPRING } from '../motion'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

const QUICKLINKS = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/commercial' },
  { label: 'Services', to: '/services' },
  { label: 'Who We Are', to: '/about' },
  { label: 'Contact Us', to: '/contact-us' },
]

export default function Footer() {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  // The Commercial/Portfolio page has its own "Transform your commercial vision"
  // CTA band, so suppress this global closing CTA there to avoid two stacked
  // action bands. It stays on every other route (incl. project detail pages).
  const showCta = pathname !== '/commercial'

  return (
    <footer className="bg-ink">
      {/* Photo-backed CTA band (reference treatment): a project interior behind
          a dark scrim, with the closing call-to-action over it. */}
      {showCta && (
      <div className="relative overflow-hidden border-t border-line/60">
        <img
          src={asset('projects/co-working-space.jpg')}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/82" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(218,119,52,0.10),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-28">
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={reduce ? { duration: 0 } : SPRING}
            className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
          >
            <div>
              <p className="eyebrow mb-5">Start your project</p>
              <h2 className="display display-xl max-w-3xl text-cream">
                Let's build something that lasts.
              </h2>
            </div>
            <Link
              to="/contact-us"
              className="cta-shine shrink-0 rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-transform hover:-translate-y-0.5"
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </div>
      )}

      {/* Columns on solid ink */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-16">
        {/* Top band: brand + descriptor on the left, link groups on the right */}
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={reduce ? { duration: 0 } : { ...SPRING, delay: 0 }}
            className="max-w-sm"
          >
            <div className="display text-2xl text-cream">
              Riarh<span className="text-accent">.</span>Group
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">
              Commercial construction across British Columbia and Alberta, managed
              start to finish under one roof.
            </p>
            <a href={`mailto:${EMAIL}`} className="mt-5 inline-flex min-h-[44px] items-center text-sm text-cream/80 hover:text-accent">
              {EMAIL}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={reduce ? { duration: 0 } : { ...SPRING, delay: 0.08 }}
            className="flex gap-16 sm:gap-24"
          >
            <div>
              <p className="eyebrow mb-3">Quicklinks</p>
              <ul>
                {QUICKLINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline-flex min-h-[44px] items-center py-2 text-sm text-cream/70 hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Follow</p>
              <ul>
                <li>
                  <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center py-2 text-sm text-cream/70 hover:text-accent">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center py-2 text-sm text-cream/70 hover:text-accent">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center py-2 text-sm text-cream/70 hover:text-accent">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Offices: full-width row so addresses breathe and nothing wraps oddly */}
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={reduce ? { duration: 0 } : { ...SPRING, delay: 0.12 }}
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-line/60 pt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {OFFICES.map((o) => (
            <div key={o.name}>
              <p className="eyebrow mb-2">{o.name}</p>
              <a
                href={`tel:${o.tel}`}
                className="inline-flex min-h-[40px] items-center whitespace-nowrap text-sm font-medium text-accent transition-colors hover:text-cream"
              >
                {o.phone}
              </a>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/55">
                {o.line1}
                <br />
                {o.line2}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-col gap-1 border-t border-line/60 pt-5 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="py-2">Copyright © {new Date().getFullYear()} | Riarh Group</span>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="inline-flex min-h-[44px] items-center py-3 hover:text-accent">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="inline-flex min-h-[44px] items-center py-3 hover:text-accent">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
