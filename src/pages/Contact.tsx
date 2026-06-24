import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { SPRING } from '../motion'
import { PHONE, PHONE_TEL, EMAIL, ADDRESS, SOCIAL, FORM_ENDPOINT } from '../data/site'

const PROJECT_TYPES = [
  'Commercial new build',
  'Industrial warehouse',
  'Tenant improvement',
  'Restaurant fit-out',
  'Medical or clinic build-out',
  'Other',
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent" aria-hidden>
      <path
        d="M5 4h3l1.5 4.5L7.5 10a12 12 0 006.5 6.5l1.5-2 4.5 1.5V19a2 2 0 01-2 2A16 16 0 014 6a2 2 0 011-2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent" aria-hidden>
      <path
        d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M14 8.5V7c0-.8.2-1 1-1h1.5V3.2A18 18 0 0014.7 3C12.3 3 11 4.4 11 6.6v1.9H8.6v3H11V21h3v-9.5h2.3l.5-3H14z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 10v6.5M7 7.2v.01M11 16.5V10m0 2.2c.4-1.2 1.4-2.2 2.8-2.2 1.7 0 2.7 1.1 2.7 3.2v3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const fieldBase =
  'peer w-full rounded-xl border border-line bg-cream/[0.04] px-5 py-4 text-cream placeholder:text-muted outline-none transition-colors focus:border-accent focus:bg-cream/[0.06]'
const labelBase = 'block text-xl font-medium text-cream md:text-2xl'

// animated bottom-border sweep — scaleX 0->1 on input focus (terracotta)
function FieldSweep() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] peer-focus:scale-x-100"
    />
  )
}

export default function Contact() {
  const formRef = useRef<HTMLDivElement>(null)
  const formInView = useInView(formRef, { once: true, margin: '-80px' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSending(true)

    const form = e.currentTarget
    // URLSearchParams keeps this a "simple" request (no CORS preflight) so the
    // Apps Script web app accepts it directly from the browser.
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>)

    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body })
      // Apps Script returns JSON; if parsing is blocked by CORS the POST still
      // reached the server (sheet + email are the source of truth), so a
      // resolved request is treated as success.
      let ok = res.ok
      try {
        const json = await res.json()
        ok = json.success !== false
      } catch {
        /* opaque/non-JSON response — request still delivered */
      }
      if (ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong sending your message. Please call us or email ' + EMAIL + '.')
      }
    } catch {
      setError('We could not reach the server. Please check your connection, or email ' + EMAIL + '.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="overflow-x-clip bg-ink text-cream">
      {/* HERO: centered, mirrors reference (eyebrow, huge accent title, sub, contact details) */}
      <section className="relative overflow-hidden bg-ink">
        {/* aurora: single very-low-opacity warm radial behind the title */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[36rem]"
          style={{
            background:
              'radial-gradient(40rem 24rem at 50% 22%, rgba(218,119,52,0.09), rgba(218,119,52,0) 70%)',
          }}
        />
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pt-24 pb-12 text-center md:pt-28 md:pb-16">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={SPRING}
            className="eyebrow"
          >
            Let's get in touch
          </motion.span>

          {/* self-drawing accent hairline under the eyebrow */}
          <motion.span
            aria-hidden
            className="mt-3 h-px w-10 origin-center bg-accent"
            initial={{ scaleX: reduceMotion ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.12 }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.08 }}
            className="display display-hero mt-6 text-cream"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.16 }}
            className="body-ref mt-6 max-w-md text-cream/80"
          >
            Fill out the form and a member of our team will get back to you within
            one business day.
          </motion.p>

          {/* Contact detail rows (Dal copy): phone, email, address */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.24 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <a
              href={`tel:${PHONE_TEL}`}
              className="group inline-flex items-center gap-2.5 text-cream transition-colors hover:text-accent"
            >
              <PhoneIcon />
              <span>{PHONE}</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex max-w-full items-center gap-2.5 break-words text-cream transition-colors hover:text-accent"
            >
              <MailIcon />
              <span>{EMAIL}</span>
            </a>
            <span className="inline-flex items-start gap-2.5 text-cream [&>svg]:mt-0.5 [&>svg]:shrink-0">
              <PinIcon />
              <span>
                {ADDRESS.line1}
                <br />
                {ADDRESS.line2}
              </span>
            </span>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.32 }}
            className="mt-8 flex items-center gap-4"
          >
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Riarh Group on Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-cream transition-colors hover:border-accent hover:text-accent"
            >
              <InstagramIcon />
            </a>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Riarh Group on Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-cream transition-colors hover:border-accent hover:text-accent"
            >
              <FacebookIcon />
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Riarh Group on LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-cream transition-colors hover:border-accent hover:text-accent"
            >
              <LinkedInIcon />
            </a>
          </motion.div>
        </div>
      </section>

      {/* FORM: single centered card, mirrors reference */}
      <section className="bg-ink">
        <motion.div
          ref={formRef}
          variants={container}
          initial="hidden"
          animate={formInView ? 'show' : 'hidden'}
          className="mx-auto max-w-2xl px-6 pb-24 lg:pb-32"
        >
          <motion.div
            variants={item}
            className="rounded-3xl border border-line bg-cream/[0.015] p-7 transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.44,0,0.56,1)] focus-within:border-accent/40 focus-within:shadow-[0_0_48px_-14px_rgba(218,119,52,0.35)] md:p-12"
          >
            {submitted ? (
              <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-accent" aria-hidden>
                    <path
                      d="M5 12.5l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h2 className="display display-xl mt-8 text-cream">Thank you.</h2>
                <p className="body-ref mt-4 max-w-sm text-muted">
                  Your message is on its way. Our team will reach out within one
                  business day to schedule your consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Web3Forms honeypot — hidden from humans, traps bots */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div>
                  <label htmlFor="name" className={labelBase}>
                    What's Your Name?
                  </label>
                  <div className="relative mt-5">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Ex. Jordan Smith"
                      className={fieldBase}
                    />
                    <FieldSweep />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelBase}>
                    Phone Number
                  </label>
                  <div className="relative mt-5">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Your phone number"
                      className={fieldBase}
                    />
                    <FieldSweep />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelBase}>
                    Email
                  </label>
                  <div className="relative mt-5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className={fieldBase}
                    />
                    <FieldSweep />
                  </div>
                </div>

                <div>
                  <label htmlFor="project" className={labelBase}>
                    Project Type
                  </label>
                  <div className="relative mt-5">
                    <select
                      id="project"
                      name="project"
                      defaultValue=""
                      required
                      className={`appearance-none bg-[length:1.1rem] bg-[right_1.25rem_center] bg-no-repeat ${fieldBase}`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1a1' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                      }}
                    >
                      <option value="" disabled className="bg-ink text-muted">
                        Select a project type
                      </option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-ink text-cream">
                          {t}
                        </option>
                      ))}
                    </select>
                    <FieldSweep />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelBase}>
                    Additional Comments or Questions
                  </label>
                  <div className="relative mt-5">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Please add your message here..."
                      className={`resize-y ${fieldBase}`}
                    />
                    <FieldSweep />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="body-ref text-sm text-accent">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="cta-shine mt-2 w-full rounded-full bg-accent px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-[transform,box-shadow,filter] duration-200 ease-[cubic-bezier(0.44,0,0.56,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(218,119,52,0.65)] hover:brightness-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {sending ? 'Sending…' : 'Book a Consultation Call Now'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
