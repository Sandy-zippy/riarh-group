export const PHONE = '(604) 652-0664'
export const PHONE_TEL = '6046520664'
export const EMAIL = 'info@riarhgroup.com'
// Contact form backend: our own Google Apps Script web app (form-backend/).
// It appends each lead to a Google Sheet and emails info@riarhgroup.com.
// No third party, no submission cap.
export const FORM_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbyHedeZ_MjcWLvVNwpo_QX2e7dXJaKu00pTRhETAGVj3aBXOTloDHc9VVTEB2l6xLi89Q/exec'
// Matches the reference footer (full address kept).
export const ADDRESS = { line1: '#202 15350 Croydon Dr,', line2: 'Surrey, BC, V3Z 1H4' }

// Regional offices (number paired with address). Surfaced in the Footer and on
// the Contact page. PHONE/PHONE_TEL above stay the BC main line for components
// that expect a single number.
export type Office = { name: string; phone: string; tel: string; line1: string; line2: string }
export const OFFICES: Office[] = [
  {
    name: 'British Columbia',
    phone: '604-652-0664',
    tel: '6046520664',
    line1: '#202 15350 Croydon Dr,',
    line2: 'Surrey, BC V3Z 1H4',
  },
  {
    name: 'Vancouver Island',
    phone: '778-401-0664',
    tel: '7784010664',
    line1: '#185 - 911 Yates St,',
    line2: 'Victoria, BC V8V 4Y9',
  },
  {
    name: 'Edmonton',
    phone: '587-407-2242',
    tel: '5874072242',
    line1: '#38 314-222 Baseline Road',
    line2: 'Sherwood Park, AB T8H 1S8',
  },
  {
    name: 'Calgary',
    phone: '587-324-2242',
    tel: '5873242242',
    line1: '#301 14 St NW #309,',
    line2: 'Calgary, AB T2N 1Z7',
  },
]
export const SOCIAL = {
  instagram: 'https://www.instagram.com/riarhgroup/',
  facebook: 'https://www.facebook.com/people/Riarh-Group/61590524757047/',
  linkedin: 'https://www.linkedin.com/company/riarh-group/',
}

// Order mirrors the reference inline nav: Home, Who We Are, Commercial, Services.
export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Who We Are', to: '/about' },
  { label: 'Portfolio', to: '/commercial' },
  { label: 'Services', to: '/services' },
]

export const STATS: [string, string][] = [
  ['100K+', 'sq. ft. constructed'],
  ['50+', 'Units Built'],
  ['15+', 'Years of experience'],
]

// Outcome-framed pillars per Dal's brief (reference design, client copy).
export const WHY = [
  {
    title: 'Your build, done right',
    desc: "We hold a zero-tolerance standard at every phase. What's designed is what gets built.",
  },
  {
    title: 'One team, start to finish',
    desc: 'One point of contact manages your entire project. No handoffs, no dropped balls, no surprises.',
  },
  {
    title: 'Built on 15+ years of commercial experience',
    desc: "From medical clinics to restaurants to childcare, we've built across every major commercial sector in BC.",
  },
]

// Approach steps per Dal's brief (de-jargoned, client-outcome framing).
export const APPROACH = [
  {
    step: '01',
    title: 'Consult',
    desc: "We sit down, learn your vision, validate your budget, and tell you honestly what's achievable.",
  },
  {
    step: '02',
    title: 'Plan',
    desc: 'We coordinate design, handle permitting, and build your critical path schedule before a single nail goes in.',
  },
  {
    step: '03',
    title: 'Build',
    desc: 'We execute with precision, hold to strict safety standards, and keep you updated every step of the way.',
  },
  {
    step: '04',
    title: 'Care',
    desc: "After handover, we stand behind our work. Comprehensive warranty, ongoing support, and we're always a call away.",
  },
]

import galleriesData from './galleries.json'

export type Project = {
  name: string
  slug?: string // present for projects with a photo gallery + detail page
  location: string
  sector: 'Commercial' | 'Industrial' | 'Tenant Improvements'
  scope: string
  intro?: string // optional per-project intro sentence, overrides the shared detail-page template
  image?: string // legacy single filename in /public/projects (kept for hero/CTA bands)
}

export const HERO_IMAGE = 'projects/_hero.jpg'

// Per-project ordered galleries (front-of-house -> back-of-house), generated from
// Dal's photo pack into /public/projects/<slug>/NN.jpg. See galleries.json.
export const GALLERIES: Record<string, string[]> = galleriesData

// Card thumbnail = first (front-of-house) gallery image, falling back to the
// legacy single file for entries without a processed gallery.
export const cardImage = (p: Project): string | undefined => {
  if (p.slug && GALLERIES[p.slug]?.length) return GALLERIES[p.slug][0]
  return p.image ? `projects/${p.image}` : undefined
}

// Renamed + relocated per Dal's notes; real photos from Dal's pack.
// Image-backed projects (with slug + gallery) lead so the grid shows real work.
export const PROJECTS: Project[] = [
  { name: 'Broadway Towers', slug: 'broadway-towers', location: 'Vancouver, BC', sector: 'Commercial', scope: 'Commercial office tower', image: 'broadway-towers.jpg' },
  { name: 'Mucho Burrito', slug: 'mucho-burrito-abbotsford', location: 'Abbotsford, BC', sector: 'Commercial', scope: 'Restaurant fit-out', image: 'mucho-burrito-abbotsford.jpg' },
  { name: 'Heal Wellness', slug: 'heal-wellness', location: 'Abbotsford, BC', sector: 'Tenant Improvements', scope: 'Wellness clinic fit-out', image: 'heal-wellness.jpg' },
  { name: 'Fresh Haul Logistics', slug: 'fresh-haul-logistics', location: 'Surrey / Langley, BC', sector: 'Industrial', scope: 'Industrial warehouse build', image: 'fresh-haul-logistics.jpg' },
  { name: 'Medico Head Office', slug: 'medico-head-office', location: 'South Surrey, BC', sector: 'Commercial', scope: 'Corporate head office', image: 'medico-head-office.jpg' },
  { name: 'Sunshine Rain Daycare', slug: 'sunshine-rain-daycare', location: 'Surrey, BC', sector: 'Tenant Improvements', scope: 'Childcare centre build-out', image: 'sunshine-rain-daycare.jpg' },
  { name: 'Mucho Burrito', slug: 'mucho-burrito-burnaby', location: 'Burnaby, BC', sector: 'Commercial', scope: 'Restaurant fit-out', image: 'mucho-burrito-burnaby.jpg' },
  { name: 'Ignis Gale Engineering Office', slug: 'ignis-gale', location: 'Calgary, AB', sector: 'Commercial', scope: 'Engineering office', image: 'ignis-gale.jpg' },
  { name: 'Happy Prairie Pharmacy', slug: 'happy-prairie-pharmacy', location: 'Edmonton, AB', sector: 'Tenant Improvements', scope: 'Pharmacy fit-out', image: 'happy-prairie-pharmacy.jpg' },
  { name: 'Mortgage Offices', slug: 'mortgage-offices', location: 'White Rock, BC', sector: 'Commercial', scope: 'Commercial office fit-out', image: 'mortgage-offices.jpg' },
  { name: 'Law Firm', slug: 'law-firm', location: 'Vancouver, BC', sector: 'Commercial', scope: 'Commercial office fit-out', image: 'law-firm.jpg' },
  { name: 'Riarh Group HQ', slug: 'riarh-hq', location: 'Vancouver, BC', sector: 'Commercial', scope: 'Corporate head office', image: 'riarh-hq.jpg' },
  { name: 'Co-Working Space', slug: 'co-working-space', location: 'Vancouver, BC', sector: 'Commercial', scope: 'Shared workspace build-out', image: 'co-working-space.jpg' },
  // Existing Medico builds (kept on site; no gallery pack supplied, so no detail page)
  { name: 'Coquitlam Animal Hospital', location: 'Coquitlam, BC', sector: 'Tenant Improvements', scope: 'Veterinary medical build-out' },
  { name: 'Smile Plus Dentistry', location: 'Surrey, BC', sector: 'Tenant Improvements', scope: '2,840 sq ft dental fit-out' },
  { name: 'Woodland Veterinary Clinic', slug: 'woodland-veterinary', location: 'Vancouver, BC', sector: 'Tenant Improvements', scope: '2,200 sq. ft veterinary clinic', intro: 'A 2,200 sq. ft veterinary clinic construction from first blueprint to final walkthrough, managed by one accountable team.' },
]

// Lookup helper for the project detail route.
export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)
