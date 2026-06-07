import { Link } from 'react-router-dom'
import { ADDRESS, EMAIL, PHONE, PHONE_TEL, SOCIAL } from '../data/site'

const QUICKLINKS = [
  { label: 'Home', to: '/' },
  { label: 'Commercial', to: '/commercial' },
  { label: 'Services', to: '/services' },
  { label: 'Who We Are', to: '/about' },
  { label: 'Contact Us', to: '/contact-us' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-ink">
      {/* CTA band */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-line/60 pb-16 md:flex-row md:items-end">
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
        </div>

        <div className="grid grid-cols-1 gap-12 pt-14 md:grid-cols-3">
          <div>
            <div className="display text-2xl text-cream">
              Riarh<span className="text-accent">.</span>Group
            </div>
            <p className="mt-5 text-sm leading-relaxed text-cream/55">
              {ADDRESS.line1}
              <br />
              {ADDRESS.line2}
            </p>
            <a href={`mailto:${EMAIL}`} className="mt-2 inline-flex items-center py-2.5 text-sm text-cream/70 hover:text-accent">
              {EMAIL}
            </a>
            <br />
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center py-2 text-lg font-medium text-accent transition-colors hover:text-cream">
              {PHONE}
            </a>
          </div>

          <div>
            <p className="eyebrow mb-3">Quicklinks</p>
            <ul>
              {QUICKLINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-flex items-center py-2.5 text-sm text-cream/70 hover:text-accent">
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
                <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center py-2.5 text-sm text-cream/70 hover:text-accent">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center py-2.5 text-sm text-cream/70 hover:text-accent">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-line/60 pt-5 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="py-2">Copyright © {new Date().getFullYear()} | Riarh Group</span>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="inline-flex items-center py-3 hover:text-accent">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="inline-flex items-center py-3 hover:text-accent">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
