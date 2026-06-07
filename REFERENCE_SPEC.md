# Riarh Group — Reference Clone Spec (ground truth from live reference @ 1440px)

Reference: https://whole-interaction-310969.framer.app/
Fonts are byte-identical to ours already (Silver Editorial = display serif; FFF Acid Grotesk = body sans). DO NOT change font files. The problem is SIZE/line-height/letter-spacing/which-size-where.

## Exact type scale @ 1440px desktop (px). Use clamp() so it scales down on mobile but hits these at ≥1440.
| role | font | size | line-height | letter-spacing | weight | color |
|---|---|---|---|---|---|---|
| eyebrow | Acid Grotesk | 14px | 1.2 | 0.16em (2.24px) | 400 | #da7734, uppercase |
| hero h1 | Silver Editorial | 46px | 1.46 | -0.001em | 400 | #fffdf8 |
| hero sub | Acid Grotesk | 16px | 1.92 | 0.04em | 400 | #ffffff |
| welcome h1 (Unparalleled) | Silver Editorial | 82px | 1.46 | -0.001em | 400 | #fffdf8 |
| welcome/mission/stat body | Acid Grotesk | 14px | 1.92 | 0.04em | 400 | muted |
| commercial h (Built for Growth) | Silver Editorial | 53px | 1.66 | normal | 400 | #fff |
| commercial sub | Acid Grotesk | 23px | 1.92 | 0.04em | 400 | #fff |
| mission h | Silver Editorial | 46px | 1.49 | normal | 400 | cream (dark bg) |
| decades h | Silver Editorial | 46px | 1.46 | normal | 400 | cream |
| stat number (100K+) | Silver Editorial | 46px | 1.46 | normal | 400 | cream |
| why word (Precision) | Silver Editorial | 46px | 1.8 | normal | 400 | cream |
| why desc | Acid Grotesk | 14px | 1.92 | 0.04em | weight 100 (ultralight) | #a1a1a1 |
| approach h | Silver Editorial | 46px | 1.49 | normal | 400 | #fff |
| approach step (Consult) | Silver Editorial | ~31px | — | — | 400 | cream |
| featured name (Coquitlam…) | Silver Editorial | 110px | 1.3 | normal | 400 | cream |
| featured location | Acid Grotesk | 28px | — | — | 400 | cream/80 |

px→rem (16 base): 14=.875 · 16=1 · 23=1.4375 · 31=1.9375 · 46=2.875 · 53=3.3125 · 82=5.125 · 110=6.875 · 28=1.75

Suggested clamps (hit target at 1440): 
- 46px → clamp(2rem, 3.2vw, 2.875rem)
- 53px → clamp(2.2rem, 3.7vw, 3.3125rem)
- 82px → clamp(2.8rem, 5.7vw, 5.125rem)
- 110px → clamp(2.75rem, 7.65vw, 6.875rem)
- 23px → clamp(1.125rem, 1.6vw, 1.4375rem)

## KEY FIX: Hero h1 must be 46px (display-md), NOT 82px. Welcome h1 is the 82px one.

## Section order & content (exact)
1. HERO — bg building exterior photo. h1 "Engineering the future of / business and life," (2nd line italic). sub "By Delivering Complex Commercial Builds." Left-aligned, no eyebrow, no CTA. Nav: logo + HOME COMMERCIAL SERVICES + LET'S TALK + hamburger.
2. WELCOME — eyebrow "WELCOME TO RIARH GROUP" top-left. h1 centered "Unparalleled passion. / Unmatched results." (2nd line italic). body centered. ghost button "Learn more about us". DARK bg.
3. COMMERCIAL — full-bleed photo bg. centered eyebrow "Commercial" (rules both sides). h "Built for Growth." centered. sub centered. ghost CTA "Explore Commercial".
4. MISSION — DARK bg. eyebrow "Our mission". h centered "Building spaces that elevate lives and businesses." body centered. 5 photos scatter-assemble on scroll.
5. DECADES — DARK. h left "Decades of experience", body right "Our brand is founded on over 12 years…". 3 stats: 100K+ Sq. Ft. constructed / 50+ Units Built / 12+ years of experience.
6. WHY — DARK pinned. eyebrow "Why Choose Us" top-left. 3 circles (Precision/Partnership/Expertise) overlap → slide to ONE circle → RIARH GROUP logo resolves inside. why-desc weight 100.
7. APPROACH — DARK. h left "The Riarh Approach." sub. Right vertical stepper, bordered cards w/ dashed check connectors: 01 Consult "Vision alignment. Budget validation. Feasibility analysis." / 02 Pre-Con "Design coordination. Permitting strategy. Critical path scheduling." / 03 Construct "Precision execution. Rigorous safety protocols. Transparent reporting." / 04 Steward "Comprehensive warranty. Asset stewardship. Lifecycle maintenance."
8. FEATURED — full-bleed panels, eyebrow "FEATURED COMMERCIAL" top-left + counter, HUGE centered name (110px) + location below. Image vertical parallax.
9. FOOTER — CTA band + brand/address/email + Quicklinks + copyright "© 2026 | Riarh Group" + Inquire.

## Colors
ink #080808 · cream #fffdf8 · accent #da7734 · muted #a1a1a1

## LAYOUT METRICS (measured @1440)
### Mission photo cluster (5 plates, ALL portrait 3:4, clustered CENTER — they overlap the headline & each other, NOT a wide airy spread). Section ~1440x924. positions (left%, top%, width%):
- A: left 32% top 18% w20%
- B: left 50% top 25% w20%
- C: left 50% top 49% w20%
- D: left 31% top 57% w20%
- E (largest): left 39% top 41% w22%
Net: a tight central column-cluster spanning ~31–72% horizontally, plates overlapping. Headline centered behind/among them. (Keep the scroll fly-in assemble motion.)

### Section vertical padding (reference, desktop):
- welcome: padding-top 50px, padding-bottom 100px
- decades: padding-top 58px, padding-bottom 40px
- approach: padding-top 110px, padding-bottom 110px
Ours currently uses py-28/py-36 (112/144) — generally too tall; tighten toward reference rhythm.
