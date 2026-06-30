#!/usr/bin/env python3
"""
Re-space Silver Editorial italic at the font level for even display headings,
keeping the exact glyph shapes.

Model: measure the DENSE BODY (stems/bowls) via column-coverage, but let thin
arms/swashes OVERHANG the gap by a controlled amount so the next letter tucks
under the arm tip (how real italic spacing works) instead of either colliding
(arm fully inside the box) or gapping (advance grown to clear the arm tip).

    effective_right = max(body_right, ink_right - OVERHANG)
    effective_left  = min(body_left,  ink_left  + OVERHANG)
    advance         = effective_right + shift + SB,  shift = SB - effective_left

Usage: fix-italic-spacing.py [SB] [OVERHANG] [OUT]
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen

SRC = 'public/fonts/silver-editorial-italic.woff2'
SB       = int(sys.argv[1]) if len(sys.argv) > 1 else 44
OVERHANG = int(sys.argv[2]) if len(sys.argv) > 2 else 300
DST      = sys.argv[3] if len(sys.argv) > 3 else 'public/fonts/silver-editorial-italic-fixed.woff2'
COV_FRAC = 0.16


class Sampler(BasePen):
    def __init__(self, gs):
        super().__init__(gs); self.pts = []; self._cur = (0, 0)
    def _moveTo(self, p): self._cur = p; self.pts.append(p)
    def _lineTo(self, p): self._dense(self._cur, p); self._cur = p
    def _curveToOne(self, p1, p2, p3):
        p0 = self._cur; n = max(8, int((abs(p3[0]-p0[0])+abs(p3[1]-p0[1]))/24))
        for i in range(1, n+1):
            t = i/n; m = 1-t
            self.pts.append((m*m*m*p0[0]+3*m*m*t*p1[0]+3*m*t*t*p2[0]+t*t*t*p3[0],
                             m*m*m*p0[1]+3*m*m*t*p1[1]+3*m*t*t*p2[1]+t*t*t*p3[1]))
        self._cur = p3
    def _qCurveToOne(self, p1, p2):
        p0 = self._cur; n = max(8, int((abs(p2[0]-p0[0])+abs(p2[1]-p0[1]))/24))
        for i in range(1, n+1):
            t = i/n; m = 1-t
            self.pts.append((m*m*p0[0]+2*m*t*p1[0]+t*t*p2[0],
                             m*m*p0[1]+2*m*t*p1[1]+t*t*p2[1]))
        self._cur = p2
    def _dense(self, a, b):
        n = max(2, int((abs(b[0]-a[0])+abs(b[1]-a[1]))/24))
        for i in range(1, n+1):
            t = i/n; self.pts.append((a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t))


def main():
    f = TTFont(SRC)
    cap = getattr(f['OS/2'], 'sCapHeight', 0) or 1456
    glyf = f['glyf']; hmtx = f['hmtx']; gs = f.getGlyphSet()
    YLO, YHI = 0.0, float(cap); CW = 24.0; RH = (YHI-YLO)/64.0
    need = max(4, int(round(COV_FRAC*64)))
    n_done = 0
    for name in glyf.keys():
        g = glyf[name]
        if g.numberOfContours <= 0:
            continue
        sp = Sampler(gs)
        try: gs[name].draw(sp)
        except Exception: continue
        band = [(x, y) for (x, y) in sp.pts if YLO <= y <= YHI]
        if not band: continue
        xs = [x for x, _ in band]; ink_min, ink_max = min(xs), max(xs)
        cols = {}
        for x, y in band:
            cols.setdefault(int(x//CW), set()).add(int((y-YLO)//RH))
        solid = [c for c, r in cols.items() if len(r) >= need]
        if solid:
            body_min = min(solid)*CW; body_max = (max(solid)+1)*CW
        else:
            body_min, body_max = ink_min, ink_max
        eff_left  = min(body_min, ink_min + OVERHANG)
        eff_right = max(body_max, ink_max - OVERHANG)
        shift = round(SB - eff_left)
        if shift: g.coordinates.translate((shift, 0))
        g.recalcBounds(glyf)
        hmtx[name] = (max(round(eff_right + shift + SB), 0), g.xMin)
        n_done += 1
    for t in ('GPOS', 'GSUB', 'GDEF'):
        if t in f: del f[t]
    f.save(DST)
    print(f'SB={SB} OVERHANG={OVERHANG} respaced {n_done} -> {DST}')


if __name__ == '__main__':
    main()
