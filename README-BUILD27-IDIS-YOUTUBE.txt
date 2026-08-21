IDIS GSX 2026 - BUILD 27
IDIS YOUTUBE FEATURE VIDEO

CORRECT IDIS FACE FLOW:

SCAN IDIS SIDE
        ↓
assets/video/idis-showcase-alpha.webm
plays with transparency
        ↓
transparent video ends
        ↓
last frame freezes
        ↓
IDIS logo animates into top center
        ↓
YouTube video loads / plays
https://youtu.be/G7vGMc4Z2os
        ↓
YouTube ENDED event fires
        ↓
scene smoothly fades
        ↓
6-second personalized Thank You end card
        ↓
SCAN COIN NOW


YOUTUBE VIDEO ID
G7vGMc4Z2os


UPLOAD TO GITHUB

Required:
assets/video/idis-showcase-alpha.webm

NOT REQUIRED ANYMORE:
assets/video/idis-feature-15s.mp4
assets/video/idis-showcase-alpha.mov


YOUTUBE BEHAVIOR

The page uses the official YouTube IFrame Player API.

Player settings:
- autoplay triggered when feature segment begins
- muted for reliable mobile autoplay
- inline playback
- controls hidden
- keyboard disabled
- fullscreen button hidden
- related-video behavior reduced
- JavaScript ENDED event advances to Thank You card


IF YOUTUBE CANNOT START

There is a 12-second startup safety timeout.
If YouTube is unavailable or mobile autoplay is blocked, the experience
will not hang forever. It advances to the Thank You end card.


ATLANTA

Atlanta remains unchanged from the current baseline:
- 1 / 2 / 3-second layer reveal
- drag + pinch
- phone tilt
- 30-second interactive timer
- personalized end card


REPLACE
- index.html
- ar.js
- styles.css

UPLOAD
- assets/video/idis-showcase-alpha.webm

KEEP
- assets/ui/idis-logo.png
- assets/parallax/atlanta/*
- assets/targets/gsx2026-two-sided.mind


TEST
https://renoramirez-create.github.io/idis-limited-coin/?v=27

CACHE VERSION
20260821-idisyoutube27
