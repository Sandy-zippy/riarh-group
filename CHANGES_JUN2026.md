# Riarh Group — Website Changes (Claudia PDF + Emmanuel email, Jun 28 2026)

Live site = React rebuild at `~/riarh-group`, deployed to `gh-pages` → riarhgroup.com.
Copy rules: NO em/en dashes, concise, no unverified claims, "Riarh" spelling, "Ethames" N/A.

---

## GLOBAL / GENERAL NOTES (Nav, Footer, Contact, site.ts)
- **G1** Verify ALL forms/inquiries route to info@riarhgroup.com. Recent testing showed some submissions did not go through — re-test the contact form end to end.
- **G2** Add the full list of regional phone numbers to BOTH the Contact section and the Footer (paired with addresses):
  - Vancouver Main Line: **604-652-0664**
  - Vancouver Island: **778-401-0664**
  - Edmonton: **587-407-2242**
  - Calgary: **587-324-2242**
- **G3** Remove the main phone number from the top-right of the Nav (the number left of "Let's Talk").
- **G4** Add the 4 office addresses to the footer, paired with the numbers:
  - British Columbia: #202 15350 Croydon Dr, Surrey, BC V3Z 1H4
  - Vancouver Island: #185 - 911 Yates St, Victoria, BC V8V 4Y9
  - Edmonton: #38 314-222 Baseline Road Sherwood Park, AB T8H 1S8
  - Calgary: #301 14 St NW #309, Calgary, AB T2N 1Z7

## PAGE 1 — HOME
- **H1** Hero "built right": the I and G in "right" overlap. Kerning/letter-spacing fix.
- **H2** First-page photos: two identical photos back to back. Swap the second one (CommercialTeaser "Built for Growth") for a different shot of the SAME project.
- **H3** Sector banner/marquee: reorder so it OPENS with healthcare items (Riarh's main focus) up front, not at the end of the rotation.
- **H4** Banner wording: "DayCares" (not "Childcare centres"), "Veterinary Clinics" (not "Veterinary Build-outs"), "Dental Clinics" (not "Dental Suites").
- **H5** Breadth of Experience: make the "+" plus signs larger (currently small + orange, hard to see).
- **H6** Stat label "Sq. Ft." → lowercase "sq. ft."
- **H7** "Built for Growth, across every commercial vertical": start a NEW LINE at "Across" and Capitalize "Across".
- **H8** Change "commercial vertical" → "commercial sector" (or "commercial industry") everywhere it appears (WhyChooseUs ring + CommercialTeaser).
- **H9** (optional but do it) Breadth-of-experience paragraph dups "Our Mission". Change to: "That experience spans every major commercial sector: commercial, tenant improvement, industrial, hospitality, retail, childcare, and healthcare, giving us the range to handle whatever your project demands."

## PAGE 2 — WHO WE ARE (About.tsx)
- **W1** Orange gradient top-left of first section is misaligned. Remove it OR extend to the edges.
- **W2** First hallway photo of this section is overused — change it.
- **W3** Breadth of Experience: make "+" plus signs larger.
- **W4** "Sq. Ft." → "sq. ft."
- **W5/W11** Our Promise "The structures follow.": final "w" + period too tight. Kerning fix.
- **W6** Our Promise photo (coworking space) is reused too much. Use a different shot of the same project.
- **W7** The Team / "From the Founder" Dal Riarh card: remove the Dal photo.
- **W8** Team cards — names (last name as initial) + titles + copy:
  - Terry S — Operations Manager — "Keeps each project on scope, on budget, and on schedule with disciplined day-to-day oversight."
  - Rochelle L — Business Manager — "Aligns crews, clients, and timelines so every detail moves through the build without friction."
  - (Dal Riarh, Founder & CEO stays.)
- **W9** Our Ethos / Ownership copy → "We accept full accountability for our subcontractors. One team takes radical responsibility for the outcome, from the first drawing to the final walkthrough."
- **W10** Our Ethos photo repeats — change to another from the same project.
- **W12** "A Collective of Experts": "We recruit problem solvers." — "solvers" kerning fix; also check the "P also" / period spacing.

## PAGE 3 — COMMERCIAL → PORTFOLIO (Commercial.tsx, Portfolio.tsx, ProjectDetail.tsx, galleries.json)
- **C1** Rename nav tab "COMMERCIAL" → "PORTFOLIO".
- **C2/C3** Same banner reorder + wording as H3/H4.
- **C4** "Built across every commercial vertical" → "sector" or "industry".
- **C5** Each portfolio header reuses image #1 as a darkened background, so it's not shown clearly. Re-include that image in the gallery run below; keep front-of-house → back-of-house order.
- **C6** Under each project page there are two CTAs back to back. Remove the WHITE one ("Planning a build like this?"); keep the dark matching one.
- **C7** Broadway Towers: remove the "elevator photo".
- **C8** Woodland Veterinary: change preview image + first photo to an INTERIOR image.
- **C9** Woodland: scope "sq. ft" lowercase; main text → "A 2,200 sq. ft veterinary clinic construction from first blueprint to final walkthrough, managed by one accountable team."
- **C10** Ignis Gale Engineering Office: change preview + first photo (the shelving) to a photo of the HEAD OFFICE.
- **C11** Ignis Gale: remove the photo of the bar.
- **C12** Ignis Gale presentation room: looks like a church. AI-remove the centre black podium. If clean, keep; else swap photo.
- **C13** "What we do": heading → "We build commercial spaces that keep businesses running." Body → "From tenant improvements and offices, to restaurants and retail fit-outs, to specialized facilities and industrial spaces, if it's commercial and it needs to be done right, that's our lane. Every build is managed in-house, start to finish, with one team accountable for the entire project."
- **C14** Below "What we do": make the sub-sections EVENLY sized (all photos or none). If photos, fix the Tenant Improvements frame (photo only fills half). Copy:
  - Tenant improvements: "Whether you are taking over a new space or reshaping the one you have, we turn empty shells and tired interiors into fully operational commercial environments, sequenced to keep disruption low and built to pass inspection the first time."
  - 1. Complex & Specialized Facilities: "Specialty environments like healthcare clinics, daycares, and restaurants engineered around real workflows, elevated guest experiences, and the inspections that come with them."
  - 2. Retail & Office Environments: "Retail storefronts, corporate offices, and co-working floors built to open on schedule, with the finish that earns a second visit."
- **C15/C20** "In business, time is capital. We respect both.": new line after "time is capital."; fix "We respect both." kerning (We overlaps).
- **C16** Built to Last / The Riarh Standard → "15+ years building across every major commercial sector in BC, from commercial and industrial to hospitality, retail, and healthcare."
- **C17** Two back-to-back CTA bands. Keep only the first ("Transform your commercial vision into reality."). Remove the second ("Let's build something that lasts.").
- **C18** In the kept CTA, remove the "Call 604-652-0664" button; keep only "Start your project".
- **C19** Kerning: space out "into reality".

## PAGE 4 — SERVICES (Services.tsx)
- **S1** Remove the first section "The Science of Building" entirely.
- **S2** "From first plans to final walkthrough." → "First initial plans to final walkthrough." (fixes the "plans" spacing). Body: "Every phase of your build, managed in-house by one accountable team."
- **S3** Remove the numbers (01. 02. 03.) from the small orange subheadings.
- **S4** Swap emphasis: Black primary text = "Planning" / "Design" / "Construction"; move the longer headline (e.g. "Mitigating risk before ground is broken") into the orange subheading area.

---

## EMMANUEL GATICA (Manuel) — BACKEND / TRACKING (separate workstream)
- **E1** Create a GitHub Action: push to `main` → build (Vite) → auto-deploy to `gh-pages` (keep CNAME riarhgroup.com). He added GTM to index.html on main but live serves from gh-pages.
- **E2** Confirm his GitHub user (Mltrxx / Mltrxx) has write access (Sandy already invited). Action solves "publish without manual deploy".
- **E3** Add dataLayer pageview events on React Router route changes (SPA pageviews for GA4/GTM) — supports his tracking. (Optional, helps him.)
- **E4** Share the leads Google Sheet with Emmanuel + confirm Apps Script settings live in form-backend/Code.gs (Sheet ID + email notify). [Access grant = Sandy decision.]
</content>
</invoke>
