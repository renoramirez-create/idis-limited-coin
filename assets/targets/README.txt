IDIS AMERICAS GSX 2026 — TWO-SIDED MINDAR TARGET
=================================================

REQUIRED RUNTIME FILE:
  gsx2026-two-sided.mind

The .mind file must contain BOTH coin faces in this exact order:

  targetIndex 0
  assets/targets/gsx2026-coin-back.png
  GSX 2026 / Atlanta, Georgia side

  targetIndex 1
  assets/targets/gsx2026-coin-front.png
  IDIS Americas side

HOW TO BUILD IT
---------------
1. Open the official MindAR Image Targets Compiler:
   https://hiukim.github.io/mind-ar-js-doc/tools/compile/

2. Add BOTH PNG files to the same compile job.
   Add the Atlanta image FIRST.
   Add the IDIS Americas image SECOND.

3. Start compilation and inspect the feature-point previews.

4. Download the generated targets.mind file.

5. Rename it:
   gsx2026-two-sided.mind

6. Put it in this folder:
   assets/targets/gsx2026-two-sided.mind

7. Open SETUP-TARGETS.html and click CHECK TARGET FILE.

PRODUCTION NOTE
---------------
The supplied art is excellent for development because it contains a large
amount of high-contrast detail. A reflective minted coin can look different
under real lighting. Before the event, photograph BOTH final manufactured coin
faces straight-on under soft, even light and test tracking on actual phones.
If the production coin differs significantly, compile a new two-sided .mind
file from those photographs using the same target order.
