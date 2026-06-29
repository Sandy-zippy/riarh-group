import { Marquee } from '../components/premium'

// The commercial verticals Riarh actually builds (drawn from the existing
// capabilities copy — no fabricated claims). A slow, endless serif ribbon that
// communicates breadth with motion. Used on Home and Commercial.
const SECTORS = [
  'Medical Clinics',
  'Dental Clinics',
  'Veterinary Clinics',
  'Pharmacies',
  'DayCares',
  'Restaurants',
  'Retail Storefronts',
  'Corporate Offices',
  'Co-working Floors',
  'Industrial Space',
  'Tenant Improvements',
]

export default function SectorMarquee() {
  return (
    <section className="border-y border-line/60 bg-ink py-7 md:py-9">
      <Marquee durationSec={48}>
        {SECTORS.map((s) => (
          <span key={s} className="flex items-center">
            <span className="display whitespace-nowrap px-6 text-[clamp(1.25rem,2vw,1.75rem)] text-cream/85 md:px-9">
              {s}
            </span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>
    </section>
  )
}
