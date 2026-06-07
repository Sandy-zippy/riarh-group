import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Commercial from './pages/Commercial'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import { Privacy, Terms } from './pages/Legal'

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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main className="pt-16">
        <Routes>
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
      </main>
      <Footer />
    </>
  )
}
