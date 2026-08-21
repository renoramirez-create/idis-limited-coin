IDIS ATLANTA OVERLAY FIX

WHY THIS VERSION
The live GitHub repository was still serving the older code that only loaded ar.js
and still used gsx-hologram on the Atlanta target. The parallax files were not
wired into the live page.

THIS VERSION REMOVES THAT DEPENDENCY.

Atlanta is now controlled directly by index.html + ar.js + styles.css.
The three 1920x1920 PNG files are normal HTML overlays, so they are guaranteed
to stay upright and are much easier to debug.

REPLACE THESE ROOT FILES:
- index.html
- ar.js
- styles.css

ADD / REPLACE:
- parallax-test.html

KEEP YOUR EXISTING:
- assets/parallax/atlanta/layer-1-back.png
- assets/parallax/atlanta/layer-2-middle.png
- assets/parallax/atlanta/layer-3-front.png
- assets/targets/gsx2026-two-sided.mind

EXPECTED ATLANTA BEHAVIOR
1. Scan UI visible before target.
2. Atlanta target detected.
3. Scan UI disappears.
4. Back + middle fade in.
5. Front fades/scales in later.
6. All three remain upright even when coin rotates.
7. Back fills most of screen.
8. Middle moves slightly.
9. Front moves much more.
10. Target lost for ~420ms -> overlays disappear and scan UI returns.
11. X -> full reset to landing screen.

IMPORTANT
PNG transparency is required to see the live physical coin through the artwork.

CACHE VERSION:
20260821-overlay9
