IDIS GSX 2026 - BUILD 13
4K CAMERA + STRONGER PRESERVE-3D + DISTANCE ZOOM

REPLACE:
- index.html
- ar.js
- styles.css
- parallax-test.html

KEEP:
- assets/ui/idis-logo.png
- assets/parallax/atlanta/layer-1-back.mp4
- assets/parallax/atlanta/layer-2-middle.png
- assets/parallax/atlanta/layer-3-front.png
- assets/targets/gsx2026-two-sided.mind

4K CAMERA
The code now attempts camera modes in this order:
1. exact 3840 x 2160
2. exact 2560 x 1440
3. exact 1920 x 1080
4. ideal 3840 x 2160
5. default rear camera

The scan UI briefly displays the ACTUAL resolution selected by the browser.

IMPORTANT:
A phone may have a 4K native camera but its browser can still restrict
getUserMedia() to 1080p. Web code cannot override an OS/browser restriction.
This build requests true 4K first and falls back only when the browser refuses it.

STRONGER 3D
Perspective changed from about 1450px to 820px.
Tilt increased, but Z rotation is still ignored so artwork remains upright.

Depth:
- background video: -95px
- middle: +72px
- front: +245px

DISTANCE ZOOM
The distance at first Atlanta lock is used as a reference.
Move phone closer:
- entire composition grows, up to about 1.58x

Move phone farther:
- composition shrinks, down to about 0.70x

The zoom is smoothed to prevent pulsing/jitter.

TEST:
https://renoramirez-create.github.io/idis-limited-coin/parallax-test.html?v=13

AR:
https://renoramirez-create.github.io/idis-limited-coin/?v=13

CACHE VERSION:
20260821-4k13
