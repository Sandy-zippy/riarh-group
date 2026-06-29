import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projectBySlug } from './data/site'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { ScrollProgressBar } from './components/premium'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Commercial from './pages/Commercial'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import { Privacy, Terms } from './pages/Legal'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

function Stub({ title }: { title: string }) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="eyebrow mb-4">Coming together</p>
        <h1 className="display display-xl text-cream">{title}</h1>
        <p className="mt-4 text-cream/60">This page is being built next.</p>
      </div>
    </section>
  )
}

// Per-route browser/tab title (Ameya flagged the original's generic/incorrect
// titles, e.g. the Contact page reading "Your Real Estate Partner"). Each route
// now gets a unique, accurate title; project pages use the project name.
const TITLES: Record<string, string> = {
  '/': 'Riarh Group | Commercial Construction in BC',
  '/commercial': 'Commercial Construction | Riarh Group',
  '/services': 'Our Services | Riarh Group',
  '/about': 'Who We Are | Riarh Group',
  '/contact-us': 'Contact Riarh Group | Commercial Construction BC',
  '/privacy-policy': 'Privacy Policy | Riarh Group',
  '/terms-and-conditions': 'Terms & Conditions | Riarh Group',
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    let title = TITLES[pathname]
    if (!title) {
      const m = pathname.match(/^\/commercial\/(.+)$/)
      const proj = m ? projectBySlug(m[1]) : undefined
      title = proj ? `${proj.name} | Riarh Group` : 'Riarh Group | Commercial Construction in BC'
    }
    document.title = title
  }, [pathname])
  return null
}

// SPA navigations don't trigger a fresh page load, so push a pageview to the
// GTM dataLayer on every route change (HashRouter → location.pathname is the
// in-app path, e.g. "/about"). GA4 reads this via the GTM container in index.html.
function Pageviews() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'pageview', page_path: pathname + search })
  }, [pathname, search])
  return null
}

// A subtle cross-route fade/rise so navigation feels like one continuous product
// rather than hard page loads. Keyed by pathname; instant under reduced motion.
function AnimatedRoutes() {
  const location = useLocation()
  const reduce = useReducedMotion()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.44, 0, 0.56, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/commercial/:slug" element={<ProjectDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="*" element={<Stub title="Page not found" />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <ScrollProgressBar />
      <ScrollToTop />
      <Pageviews />
      <Nav />
      <main className="pt-16">
        <AnimatedRoutes />
      </main>
      <Footer />
    </>
  )
}
