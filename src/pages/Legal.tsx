import { motion } from 'framer-motion'
import { SPRING, appear } from '../motion'
import { EMAIL, PHONE, PHONE_TEL, ADDRESS } from '../data/site'

// Shared layout for the two legal pages (Privacy, Terms). Plain, readable,
// on-brand dark editorial. Content is standard boilerplate for a commercial
// construction company; review by counsel before public launch.
function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Aurora — one very low-opacity warm radial behind the eyebrow + H1. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[440px]"
        style={{
          background:
            'radial-gradient(640px 380px at 28% 14%, rgba(218,119,52,0.08), transparent 70%)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="flex items-center gap-4"
        >
          <span className="eyebrow">{eyebrow}</span>
          {/* Self-drawing accent rule — scaleX 0→1, origin-left, final width unchanged. */}
          <motion.span
            className="h-px w-20 origin-left bg-accent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING, delay: 0.12 }}
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ ...SPRING, delay: 0.08 }}
          className="display display-xl mt-8 text-balance text-cream"
        >
          {title}
        </motion.h1>
        <p className="mt-4 text-sm text-muted">Last updated {updated}</p>
        <div className="mt-12 space-y-10 [&_h2]:display [&_h2]:text-2xl [&_h2]:text-cream [&_p]:mt-3 [&_p]:text-pretty [&_p]:text-[0.9375rem] [&_p]:leading-[1.85] [&_p]:tracking-[0.012em] [&_p]:text-muted [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-2 [&_a]:transition-colors [&_a:hover]:decoration-accent">
          {children}
        </div>
      </div>
    </section>
  )
}

export function Privacy() {
  return (
    <LegalLayout eyebrow="Legal" title="Privacy Policy" updated="June 2026">
      <motion.div {...appear()}>
        <h2>Overview</h2>
        <p>
          Riarh Group respects your privacy. This policy explains what information
          we collect through our website and how we use it. We collect only what
          we need to respond to your enquiry and deliver our services.
        </p>
      </motion.div>
      <motion.div {...appear()}>
        <h2>Information we collect</h2>
        <p>
          When you contact us we collect the details you provide, such as your
          name, email, phone number, and project information. We do not sell your
          personal information to anyone.
        </p>
      </motion.div>
      <motion.div {...appear()}>
        <h2>How we use it</h2>
        <p>
          We use your information to respond to enquiries, prepare proposals,
          manage projects, and keep you informed about your build. We retain it
          only as long as needed for these purposes or as required by law.
        </p>
      </motion.div>
      <motion.div {...appear()}>
        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or{' '}
          <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>.
        </p>
        <p>
          {ADDRESS.line1}
          <br />
          {ADDRESS.line2}
        </p>
      </motion.div>
    </LegalLayout>
  )
}

export function Terms() {
  return (
    <LegalLayout eyebrow="Legal" title="Terms & Conditions" updated="June 2026">
      <motion.div {...appear()}>
        <h2>Use of this website</h2>
        <p>
          By using the Riarh Group website you agree to these terms. The content
          here is for general information about our commercial construction
          services and does not constitute a contract or a guarantee of results.
        </p>
      </motion.div>
      <motion.div {...appear()}>
        <h2>Project agreements</h2>
        <p>
          All work is governed by a separate written agreement signed before a
          project begins. Scope, schedule, pricing, and warranty are defined in
          that agreement, not on this website.
        </p>
      </motion.div>
      <motion.div {...appear()}>
        <h2>Intellectual property</h2>
        <p>
          The text, images, and design on this site are the property of Riarh
          Group and may not be reproduced without permission.
        </p>
      </motion.div>
      <motion.div {...appear()}>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or{' '}
          <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>.
        </p>
        <p>
          {ADDRESS.line1}
          <br />
          {ADDRESS.line2}
        </p>
      </motion.div>
    </LegalLayout>
  )
}
