#!/usr/bin/env python3
"""
Silver Editorial italic — collision repair that keeps the swashy look.

The v/r/w/k arms overhang their advance and collide with the next letter. But
fully clearing the arm (widening advance to arm-tip + clearance) opens gaps
("sol ver s"). Correct italic spacing lets the arm overhang the next letter
PARTIALLY — the next letter tucks under the arm tip.

So per glyph we separate the dense STEM/body (column-coverage) from a thin ARM
(ink past the stem). The next letter must clear the STEM by FLOOR, plus a
FRACTION (AF) of the arm's reach — so the arm overhangs the remaining (1-AF).
Calm letters (no arm) just get FLOOR clearance. We only ever widen / shift-right,
so calm letters and the designed rhythm are preserved, and descender swashes
(below baseline) are excluded from the band so y/p/f/g keep their tails.

Usage: fix-italic-spacing.py [FLOOR] [AF] [OUT]
"""
import sys, os
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public/fonts/silver-editorial-italic.woff2')
FLOOR = int(sys.argv[1]) if len(sys.argv) > 1 else 55
AF = float(sys.argv[2]) if len(sys.argv) > 2 else 0.45
OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, 'public/fonts/silver-editorial-italic-fixed.woff2')


class S(BasePen):
    def __init__(s, gs): super().__init__(gs); s.pts = []; s._c = (0, 0)
    def _moveTo(s, p): s._c = p; s.pts.append(p)
    def _lineTo(s, p): s._d(s._c, p); s._c = p
    def _curveToOne(s, a, b, c):
        p = s._c; n = max(8, int((abs(c[0]-p[0])+abs(c[1]-p[1]))/18))
        for i in range(1, n+1):
            t = i/n; m = 1-t
            s.pts.append((m*m*m*p[0]+3*m*m*t*a[0]+3*m*t*t*b[0]+t*t*t*c[0],
                          m*m*m*p[1]+3*m*m*t*a[1]+3*m*t*t*b[1]+t*t*t*c[1]))
        s._c = c
    def _qCurveToOne(s, a, b):
        p = s._c; n = max(8, int((abs(b[0]-p[0])+abs(b[1]-p[1]))/18))
        for i in range(1, n+1):
            t = i/n; m = 1-t
            s.pts.append((m*m*p[0]+2*m*t*a[0]+t*t*b[0], m*m*p[1]+2*m*t*a[1]+t*t*b[1]))
        s._c = b
    def _d(s, a, b):
        n = max(2, int((abs(b[0]-a[0])+abs(b[1]-a[1]))/18))
        for i in range(1, n+1):
            t = i/n; s.pts.append((a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t))


def main():
    f = TTFont(SRC)
    cap = getattr(f['OS/2'], 'sCapHeight', 0) or 1456
    glyf = f['glyf']; hmtx = f['hmtx']; gs = f.getGlyphSet()
    CW = 24.0; RH = cap/64.0; NEED = 10   # stem column = >=10/64 vertical coverage
    n_adj = 0
    for name in glyf.keys():
        g = glyf[name]
        if g.numberOfContours <= 0:
            continue
        sp = S(gs)
        try: gs[name].draw(sp)
        except Exception: continue
        band = [(x, y) for (x, y) in sp.pts if y >= -20]   # at/above baseline only
        if not band:
            continue
        xs = [x for x, _ in band]; bmin = min(xs); bmax = max(xs)
        cols = {}
        for x, y in band:
            if 0 <= y <= cap:
                cols.setdefault(int(x//CW), set()).add(int(y//RH))
        solid = [c for c, r in cols.items() if len(r) >= NEED]
        stem_max = (max(solid)+1)*CW if solid else bmax
        aw, _ = hmtx[name]
        shift = max(0, FLOOR-bmin)                  # left: clear body ink to FLOOR (right only)
        if shift:
            g.coordinates.translate((round(shift), 0))
        arm = max(0.0, bmax-stem_max)               # thin ink past the stem
        right_edge = stem_max + FLOOR + AF*arm      # clear stem + a fraction of the arm
        new_aw = max(aw, round(right_edge+shift))   # only widen
        g.recalcBounds(glyf)
        if new_aw != aw or shift:
            hmtx[name] = (max(new_aw, 0), g.xMin); n_adj += 1
    for t in ('GPOS', 'GSUB', 'GDEF'):
        if t in f:
            del f[t]
    f.save(OUT)
    print(f'FLOOR={FLOOR} AF={AF} adjusted={n_adj} -> {OUT}')


if __name__ == '__main__':
    main()
