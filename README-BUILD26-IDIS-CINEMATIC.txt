IDIS GSX 2026 - BUILD 26
IDIS FACE CINEMATIC SEQUENCE

CORRECTION FROM BUILD 25:
The cinematic two-video sequence now belongs to the IDIS face.

ATLANTA IS RESTORED TO THE EXISTING BASELINE:
- layered interactive scene
- 1 / 2 / 3 second reveal
- drag + pinch
- phone tilt
- 3-second auto-center
- 30-second timer
- 6-second thank-you end card

IDIS FACE FLOW:

SCAN IDIS COIN FACE
        ↓
TRANSPARENT SHOWCASE VIDEO plays
        ↓
video finishes naturally
        ↓
FINAL SHOWCASE FRAME remains frozen
        ↓
IDIS LOGO animates into top center
        ↓
~0.85 seconds
        ↓
15-SECOND FEATURE VIDEO starts
        ↓
feature video finishes naturally
        ↓
IDIS scene smoothly fades out
        ↓
6-SECOND PERSONALIZED THANK-YOU END CARD
        ↓
SCAN COIN NOW


FILES TO UPLOAD

Transparent MOV:
assets/video/idis-showcase-alpha.mov

Optional Chrome / Android alpha fallback:
assets/video/idis-showcase-alpha.webm

15-second second video:
assets/video/idis-feature-15s.mp4


TRANSPARENT MOV NOTE

For Safari/iPhone:
- an alpha-capable HEVC MOV is generally appropriate for web playback

For Chrome/Android:
- use the optional VP9-alpha WebM fallback

The HTML tries WebM first, then MOV.


FINAL FRAME

When the first IDIS showcase video reaches the end:
- it pauses
- it seeks to approximately duration - 0.04 seconds
- that final frame stays visible under the IDIS logo and second video


IDIS TIMING

The old 30-second timer is NOT used for the IDIS face anymore.
IDIS duration follows the actual media files.

Atlanta still keeps its 30-second timer.


REPLACE
- index.html
- ar.js
- styles.css

UPLOAD
- assets/video/idis-showcase-alpha.mov
- assets/video/idis-feature-15s.mp4

OPTIONAL
- assets/video/idis-showcase-alpha.webm

KEEP ALL EXISTING
- assets/ui/idis-logo.png
- assets/parallax/atlanta/layer-1-back.mp4
- assets/parallax/atlanta/layer-2-middle.png
- assets/parallax/atlanta/layer-3-front.png
- assets/targets/gsx2026-two-sided.mind

TEST
https://renoramirez-create.github.io/idis-limited-coin/?v=26

CACHE VERSION
20260821-idiscinema26
