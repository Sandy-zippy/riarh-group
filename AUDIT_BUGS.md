# Riarh Group Website — Final Audit Bug List

Compiled from per-page QA audits of the live gh-pages deployment. Items are grouped by severity, then ordered by page (Home → Who We Are → Commercial → Services → Project detail → Global). Each item carries a stable ID, exact location, type, evidence, and the originating PDF change-ID where applicable. Duplicate reports across agents have been merged.

Severity counts: **1 Critical · 3 Major · 7 Minor · 8 Nit**

---

## CRITICAL

### [C-01] Global — "British Columbia (Main)" label never deployed
- **Page:** All routes (Footer) + Contact page
- **Location:** Footer office row, first office; Contact "Regional offices" grid, first office
- **Type:** missing-change · **Change-ID:** G2
- **Description:** The first office still reads **"BRITISH COLUMBIA (MAIN)"** on the live site in both the footer and the Contact office grid. The required change was to drop "(Main)" so it reads **"British Columbia"**. Live DOM eyebrows = `['British Columbia (Main)', 'Vancouver Island', 'Edmonton', 'Calgary', …]` in both places, and the served bundle `assets/index-BIaA0z-H.js` still contains the literal string `British Columbia (Main)`. Root cause: the fix exists only in the uncommitted working tree (`src/data/site.ts` line 18 = `British Columbia`) and was never built or deployed. This is the single undeployed copy change.
- **Recommended fix:** Commit the `site.ts` edit, run the production build, and deploy to gh-pages so the live bundle picks up "British Columbia".

---

## MAJOR

### [M-01] Project detail (Woodland Veterinary) — orphaned portrait + side void in gallery
- **Page:** /#/commercial/woodland-veterinary
- **Location:** Project detail 2-column gallery grid (`ProjectDetail.tsx` Plate)
- **Type:** alignment · **Change-ID:** —
- **Description:** Portrait photo `10.jpg` (600x900) renders alone in the left column, immediately followed by full-width landscape `11.jpg`, leaving the right column (C2) an empty dark void beside a tall photo. Portrait `13.jpg` orphans the same way. Plate-rect map: `10.jpg 600x900 L104` then `11.jpg 1232x821 L104` with no C2 sibling; confirmed in full-page screenshot. This is exactly the "narrow floating image with side void" the gallery code comment claims to prevent. The consecutive portrait group has an odd count (`06,07,08,09,10` = 5), guaranteeing an orphan.
- **Recommended fix:** Pair portraits deterministically (precompute orientation from the manifest and group portraits two-per-row); for odd counts, promote the trailing portrait to a full-width landscape slot or insert a matched filler so no column is left empty.

### [M-02] Project detail (Woodland Veterinary) — non-deterministic / cropped portraits
- **Page:** /#/commercial/woodland-veterinary
- **Location:** Project detail gallery, Plate orientation logic
- **Type:** image-quality · **Change-ID:** —
- **Description:** Plate decides portrait vs landscape from an `img.onLoad` ratio read, which is racy. On settled scale-1 loads, portrait sources `14/15/16.jpg` (verified 1280x1920) render inside a 1232x770 **landscape** box with `object-cover`, showing only the middle ~40% horizontal slice and cropping top + bottom. On scale-2 / earlier loads the same photos render correctly as paired 600x900 portraits. Same image, different layout per load = unreliable. Shares root cause with [M-01].
- **Recommended fix:** Derive each photo's orientation from known intrinsic dimensions in the galleries manifest at build/render time instead of from a runtime `onLoad` measurement, eliminating the race and the cover-crop.

### [M-03] Contact — form shows success even when delivery fails
- **Page:** /#/contact-us
- **Location:** Contact form submit handler (`handleSubmit`)
- **Type:** other · **Change-ID:** G1
- **Description:** Matches the client's complaint that "some submissions did not go through." The form POSTs to the Apps Script endpoint with `mode:'no-cors'`, then shows the "Thank you." success state whenever `fetch` **resolves** — which it always does for an opaque no-cors response, even if Apps Script errors (quota exceeded, runtime/auth failure). A user can see success while the lead is silently lost; there is no real delivery confirmation. The endpoint is currently live (GET → HTTP 200) and the backend (`form-backend/Code.gs`) correctly appends to the Leads sheet and emails `NOTIFY_TO='info@riarhgroup.com'`, so routing is configured — but the success state cannot be trusted as proof of delivery.
- **Recommended fix:** Switch to a server-acknowledged response (CORS JSON or JSONP) and only show "Thank you." after the backend returns an explicit success payload; show an error/retry state otherwise.

---

## MINOR

### [m-01] Home — featured project card hover zoom non-functional
- **Page:** Home (/#/)
- **Location:** FeaturedProjects, project card hover
- **Type:** hover · **Change-ID:** —
- **Description:** On hover only `filter:brightness(1.06)` applies; the intended image zoom (`group-hover:scale-[1.055]`) never fires because the `img` base class `[transform:translateZ(0)]` hard-sets the `transform` property and overrides Tailwind's scale var chain. Computed style: before `transform=matrix(1,0,0,1,0,0) filter=none`; after `transform=matrix(1,0,0,1,0,0) filter=brightness(1.06)` — scale stays identity. Other hover cues (accent line widen, underline, arrow nudge) still work, so the effect is only partly present.
- **Fix direction:** Drive the zoom via `scale`/CSS var (or move `translateZ(0)` to a wrapper) so the hover transform isn't clobbered.

### [m-02] Home — stat "+" still reads smaller than digits
- **Page:** Home (/#/)
- **Location:** Decades "Breadth of experience" stat cards (100K+ / 50+ / 15+)
- **Type:** design-fidelity · **Change-ID:** H5
- **Description:** H5 was attempted (the "+" is now `text-[1.15em]`, accent orange, `verticalAlign 0.04em`), but because the "+" glyph is inherently small within its em box, increasing font-size doesn't make the mark look large. Measured "+" = 52.9px desktop / 36.8px mobile, next to ~90px numerals, so the plus still reads clearly smaller than the digits — most noticeable on mobile 390 where it looks subordinate. Improvement made but not unambiguously "clearly large" per the client's request.
- **Fix direction:** Use a heavier/custom plus glyph or bump well above 1.15em (and/or raise font-weight) so it visually matches the digits.

### [m-03] Home — hero photo repeats as first featured project card
- **Page:** Home (/#/)
- **Location:** Hero image vs FeaturedProjects card #1 (Broadway Towers)
- **Type:** image-wrong · **Change-ID:** —
- **Description:** The hero photo (`projects/hero-home.jpg`, 1920x1433) is a higher-res export of the same reception scene used for the Broadway Towers featured card (`projects/broadway-towers/01.jpg`, 1800x1343) — identical aspect ratio (1.34) and visually identical scene (same copper pendant cluster, dark stone reception desk, leather chairs, plant arrangement, windows). The first-impression hero reappears further down as the first featured panel. Note: H2 (hero vs teaser adjacency) is correctly fixed; this is a separate cross-page repeat.
- **Fix direction:** Swap the hero or the Broadway card #1 for a distinct shot.

### [m-04] Who We Are — hero photo is the softest image on the page
- **Page:** /#/about
- **Location:** Hero full-bleed photo (`about-origin.jpg`)
- **Type:** image-quality · **Change-ID:** —
- **Description:** Source is 1920x1433, rendered full-bleed (~1440 CSS px, scaled 1.04–1.1x by parallax), so on a 2x retina display it sits at ~67% of ideal pixel density and reads slightly soft versus the razor-sharp project photos below (e.g. co-working/03 is 1800px native into a 549px slot). This IS the best available source — `.image-backup/fullres/hero-about.jpg` is also only 1920x1433; the larger `_hero.jpg` files (3400x2538 / 2400x1792) are the HOME hero, a different photo.
- **Fix direction:** Replace with a higher-res about-hero shot if the client has one; otherwise accept as source-limited.

### [m-05] Who We Are — hero alt text mismatches the image
- **Page:** /#/about
- **Location:** Hero photo alt attribute
- **Type:** copy / accessibility · **Change-ID:** —
- **Description:** Hero alt = `"Interior of a Riarh Group healthcare pharmacy build"` but the image clearly shows a corporate meeting/conference room (leather chairs, long table), not a pharmacy. Alt/content mismatch (accessibility + accuracy). The Promise and Ethos alts correctly match their images; only the hero is wrong.
- **Fix direction:** Rewrite the alt to describe the conference/meeting room.

### [m-06] Project detail (Ignis Gale) — photo 08 still reads as a church/ceremony hall
- **Page:** /#/commercial/ignis-gale
- **Location:** Gallery photo `08.jpg` (presentation room)
- **Type:** image-wrong · **Change-ID:** C12
- **Description:** C12 (remove centre black podium) IS satisfied — the black podium is gone, replaced by a low light-wood platform, and the photo was kept (re-edited Jun 29). However the image still strongly reads as a church/ceremony hall (rows of wooden chairs facing an altar-like platform under arched windows), which is the client's underlying concern.
- **Fix direction:** Swap for a shot that clearly reads as an engineering/corporate office.

### [m-07] Global (mobile) — drawer nav links below 44px tap-target minimum
- **Page:** All routes (mobile hamburger drawer)
- **Location:** Drawer nav links (Home / Who We Are / Portfolio / Services)
- **Type:** responsive · **Change-ID:** —
- **Description:** Drawer menu links measure 342x36px — only 36px tall, below the 44px minimum tap target (`py-2 text-sm`). "Let's Talk" is 43px (borderline). Measured via `getBoundingClientRect` at 390px with `isMobile`. Footer/contact links use `min-h-[44px]` but the drawer links were not given the same minimum.
- **Fix direction:** Add `min-h-[44px]` (and matching vertical padding) to the drawer link items.

---

## NIT

### [n-01] Who We Are — "follow" over-spaced after kerning fix
- **Page:** /#/about
- **Location:** Our Promise heading, "The structures follow."
- **Type:** copy · **Change-ID:** W5/W11
- **Description:** W5/W11 kerning was fixed (the `w` + period no longer collide), but the fix applies a uniform `letterSpacing:0.05em` across the whole word "follow", over-spacing it and introducing a visible gap before the final "w" so it reads slightly as "follo w." (glyph-zoom `crop-promise` confirms). Tightening to track only the final `w`+period, or reducing to ~0.02em, would read cleaner. Net still better than the original overlap.

### [n-02] Commercial — C16 sentence buried inside a pillar card, not a section lead-in
- **Page:** /#/commercial
- **Location:** The Riarh Standard / Built to Last section
- **Type:** copy · **Change-ID:** C16
- **Description:** The C16 copy ("15+ years building across every major commercial sector in BC, from commercial and industrial to hospitality, retail, and healthcare.") is present and verbatim, but it sits as the BODY of the first pillar card "Unmatched Expertise," not as a section-level intro under "The Riarh Standard." The heading has no paragraph beneath it. A perfectionist may expect this sentence as the section lead-in. Placement nuance only; copy passes.

### [n-03] Commercial — hero vs closing CTA button label inconsistency
- **Page:** /#/commercial
- **Location:** Hero CTA vs closing CTA button
- **Type:** copy · **Change-ID:** —
- **Description:** Hero CTA reads "Start Your Build" while the closing CTA (and project-page CTA) reads "Start Your Project." Both valid and may be intentional variety; flagged for awareness. Not in the change-list.

### [n-04] Services — phase sticky-panel images effectively at source ceiling
- **Page:** /#/services
- **Location:** Phase sticky panel images (Planning / Design / Construction)
- **Type:** image-quality · **Change-ID:** —
- **Description:** Phase images are sharp; source 1800x1343, rendered ~619x678 CSS @ DPR2 (needs ~1238x1356). Width has full headroom; vertical source (1343) is ~99% of the 1356 needed at 2x, so effectively crisp with no upscaling. No action needed; noted for completeness.

### [n-05] Project detail (Woodland Veterinary) — gallery ends with two near-identical exteriors
- **Page:** /#/commercial/woodland-veterinary
- **Location:** Gallery tail (`01.jpg`, `02.jpg`)
- **Type:** image-quality · **Change-ID:** C8
- **Description:** The gallery ends with two near-identical exterior storefront shots of the same Woodland Veterinary Clinic facade back to back (moved here from the old preview slot per C8). Slightly redundant at the tail; one would suffice.

### [n-06] Project detail (all) — full-bleed hero/landscape plates slightly soft on retina
- **Page:** All project detail pages
- **Location:** Hero + full-width landscape gallery plates
- **Type:** image-quality · **Change-ID:** —
- **Description:** Sources are 1800px wide (landscape) / 1280px (portrait). Hero displays up to 1440 CSS px and full-width plates ~1232 CSS px, so on 2x displays they render slightly soft (need ~2880/2464 px). Not upscaled beyond source and consistent site-wide, but a perfectionist on Retina may notice softness on the full-bleed hero.

### [n-07] Global — office phone tap targets 4px under the recommended minimum
- **Page:** All routes (Footer) + Contact
- **Location:** Office phone `<a tel:>` links (footer office row + contact office grid)
- **Type:** responsive · **Change-ID:** —
- **Description:** Office phone tap targets are 40px tall (`min-h-[40px]`) in both footer and contact, 4px under the 44px recommended minimum. At 390px: 604-652-0664 = 98x40, 778-401-0664 = 92x40, 587-407-2242 = 89x40, 587-324-2242 = 92x40.

### [n-08] Contact — leftover Web3Forms honeypot field
- **Page:** /#/contact-us
- **Location:** Hidden honeypot input `name='botcheck'`
- **Type:** other · **Change-ID:** —
- **Description:** A Web3Forms-convention honeypot field (`name='botcheck'`, commented `// Web3Forms honeypot`) remains even though the backend is now the custom Apps Script endpoint. Harmless dead attribute; `Code.gs` does not read `botcheck`. Cleanup only.

---

## Confirmed correct (passed checks)

Coverage verification — the following requested changes and quality checks were tested and **pass**.

**Home:** H1 (hero "built right" kern fix), H2 (hero ≠ teaser photo), H3 (marquee opens healthcare-first), H4 (DayCares / Veterinary Clinics / Dental Clinics wording), marquee descenders fully un-clipped desktop + mobile, H6 ("sq. ft. constructed" lowercase), H7 (FeaturedProjects H2 line break), H8 ("sector" replaces "commercial vertical"), H9 (breadth-of-experience copy, no Mission duplication), intro eyebrow alignment, Our Mission 4-photo scatter intact, all Home photos sharp/no upscaling.

**Who We Are:** W1 (orange hero gradient removed), W2 (new distinct hero photo), W3 (stat "+" enlarged to 1.15em, larger than digits in em terms), W4 ("sq. ft." lowercase), W5/W11 (no `w`+period collision — see n-01), W6 (co-working Promise photo, sharp), W7 (Dal photo removed, monogram used), W8 (three team cards correct copy), W9 (ownership ethos copy), W10 (distinct Ethos photo), W12 ("problem solvers." kerning), section left-edge alignment (104px), team-card hover, mobile 390 stacking, all photos high-res no upscaling.

**Commercial:** C1 (nav + footer "Portfolio", route still /commercial), C2 (healthcare-first marquee order), C3 (marquee wording, no clipped descenders), C4 ("Built across every commercial sector."), C5 (header image re-included as first gallery plate), C6 (single dark CTA on detail pages), C7 (Broadway elevator photo removed), C8 (Woodland interior preview/first), C9 (Woodland scope copy exact), C10 (Ignis head-office first), C11 (Ignis bar photo removed), C12 (podium removed — see m-06 on residual look), C13 ("What We Do" heading + body), C14 (three even text-only capability cards 316x400), C15/C20 ("time is capital" break + "We respect both." kern), C16 (copy present verbatim — see n-02 placement), C17 (single closing CTA, footer CTA suppressed), C18 (no "Call 604" button), C19 ("into reality." kern), category filter counts (All=14, Commercial=9, Industrial=1, TI=4), portfolio hover effects, all images sharp, no console/network errors, mobile 390 clean.

**Services:** S1 ("Science of Building" removed), S2 (hero heading + sub-body, "plans" kern, descenders un-clipped), S3 (numbers removed from orange subheads), S4 (emphasis swap, black headings = Planning/Design/Construction), sticky crossfade behavior + progress rail, featured-project hover (lift + ring + zoom), images sharp, mobile 390 clean.

**Project detail:** C5/C6/C7/C8/C9/C10/C11/C12 all verified per-slug, intro a/an logic correct ("An engineering office", "A commercial office tower", "A restaurant fit-out", "A 2,200…"), all-landscape galleries (broadway/ignis/mucho-burrito) clean with no voids, hero `h1` descenders un-clipped, gallery hover = intended scroll parallax only, live gh-pages matches `galleries.json` manifest.

**Global / Footer / Contact / Nav:** G2 (all 4 regional phone numbers in footer + contact), G3 (no phone in nav), G4 (all 4 office addresses paired with phones), C1 (nav "PORTFOLIO" desktop + mobile), footer 4-col rail alignment, nav-link / "Let's Talk" / footer / submit / project-card / social-icon hover states, mobile hamburger scrim + blur, mobile footer renders fully (black void was a fullPage capture artifact), contact form layout single centered card, contact offices centering, G1 backend routing live (HTTP 200, appends to Leads sheet, emails info@riarhgroup.com — see M-03 re: success-state trust).

---

## Action summary

| Priority | Items | Theme |
|---|---|---|
| Critical | C-01 | Rebuild + deploy the "British Columbia" copy fix (currently undeployed) |
| Major | M-01, M-02 | Woodland gallery: deterministic portrait orientation from manifest (kills orphan void + cover-crop) |
| Major | M-03 | Contact form: server-acknowledged success, not opaque no-cors resolve |
| Minor | m-01…m-07 | Hover zoom, stat "+", repeated hero photo, About hero softness/alt, Ignis 08 swap, mobile tap targets |
| Nit | n-01…n-08 | Copy/kerning polish, CTA label, image redundancy, retina softness, tap-target +4px, honeypot cleanup |
