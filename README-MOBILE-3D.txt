IDIS GSX 2026 - MOBILE STAGE TIMING + GENTLE 3D FIX

WHY THE OLD MOBILE TIMING LOOKED WRONG
The prior package still contained the older CSS keyframes:
- back + middle together
- front delayed

So even though ar.js had the new comments/timer, CSS was still visually
driving the wrong order.

THIS VERSION REMOVES CSS TIMING FROM THE EQUATION.
JavaScript now sets each layer's opacity every animation frame.

EXACT SEQUENCE
0.0s  FRONT/TOP PNG starts
0.8s  FRONT is fully visible

1.0s  MIDDLE PNG starts
1.9s  MIDDLE is fully visible

3.0s  BACKGROUND MP4 starts playing and fading
4.2s  BACKGROUND VIDEO is fully visible

GENTLE 3D
The overlay now uses CSS perspective + preserve-3d.

It reads the coin's X/Y perspective tilt but ignores coin Z rotation.
So:
- the composition stays upright
- it gently tilts toward the coin's viewing perspective
- back = -18px depth
- middle = +34px depth
- front = +105px depth

The perspective is intentionally clamped to about ±5.5 degrees so it
does not become a spinning/rotating UI.

REPLACE
- index.html
- ar.js
- styles.css
- parallax-test.html

KEEP
- assets/ui/idis-logo.png
- assets/parallax/atlanta/layer-1-back.mp4
- assets/parallax/atlanta/layer-2-middle.png
- assets/parallax/atlanta/layer-3-front.png
- assets/targets/gsx2026-two-sided.mind

TEST PREVIEW
https://renoramirez-create.github.io/idis-limited-coin/parallax-test.html?v=12

TEST AR
https://renoramirez-create.github.io/idis-limited-coin/?v=12

CACHE VERSION
20260821-stage12
