import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV, PHONE, PHONE_TEL } from '../data/site'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  // Reference treatment: a DYNAMIC header. Flush/transparent over the hero at the
  // very top; once scrolled it resolves to a solid ink bar AND it hides when you
  // scroll down (so each section is unobstructed) and slides back in the moment
  // you scroll up. Matches the reference's appear/hide-on-scroll behaviour.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y < 80) setHidden(false)
      else if (y > last + 6) setHidden(true) // scrolling down
      else if (y < last - 6) setHidden(false) // scrolling up
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || open

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] ' +
        (hidden && !open ? '-translate-y-full ' : 'translate-y-0 ') +
        (solid
          ? 'border-b border-line/60 bg-ink/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent')
      }
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Riarh Group home" className="flex min-h-11 items-center">
          <img
            src={`${import.meta.env.BASE_URL}logo-mark.svg`}
            alt="Riarh Group"
            className="h-9 w-auto"
          />
        </Link>

        {/* Nav links truly centred in the header (absolute centre, so unequal
            logo/right-group widths don't bias them) — matches the reference. */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors hover:text-accent ${
                pathname === n.to ? 'text-accent' : 'text-cream/80'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden text-sm text-cream/70 transition-colors hover:text-accent md:block"
          >
            {PHONE}
          </a>
          <Link
            to="/contact-us"
            className="hidden rounded-none border border-cream/50 px-6 py-2.5 text-[0.76rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream hover:text-ink sm:block"
          >
            Let's Talk
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Menu"
          >
            <span className={`h-px w-6 bg-cream transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-cream transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-line/60 bg-ink"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="py-2 text-sm uppercase tracking-[0.14em] text-cream/80 hover:text-accent"
                >
                  {n.label}
                </Link>
              ))}
              <a href={`tel:${PHONE_TEL}`} className="py-2 text-sm text-accent">
                {PHONE}
              </a>
              <Link
                to="/contact-us"
                className="mt-3 rounded-full bg-cream px-5 py-3 text-center text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-ink"
              >
                Let's Talk
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
