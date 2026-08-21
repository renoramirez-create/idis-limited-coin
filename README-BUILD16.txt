IDIS GSX 2026 - BUILD 16
INTERACTIVE SCENE BASELINE

BASELINE BEHAVIOR
- scan a coin face
- detach the experience from the coin
- drag to pan
- pinch to zoom
- 3 seconds idle -> auto-center
- 30 seconds -> return to SCAN COIN NOW
- same face does not restart the timer
- opposite face interrupts immediately

NEW: DARK TEAL BACKGROUND TAKEOVER

At 3 seconds on the Atlanta experience:
1. background MP4 begins playing
2. dark teal full-screen background begins fading in
3. it reaches about 98.5% opacity

This visually replaces the live camera background while the Atlanta
interactive scene is active.

The teal background disappears when:
- the 30-second timer ends
- IDIS face replaces Atlanta
- X / Close is pressed

NEW: OPPOSITE COIN SWITCH FIX

MindAR defaults maxTrack to 1.
Build 16 explicitly sets:

maxTrack: 2

This allows both compiled target faces to remain eligible for tracking.

There are now TWO switch paths:
1. normal targetFound event
2. target-visibility watchdog

The watchdog:
- watches only the OTHER face
- requires it to be visible for about 220 ms
- cuts the current 30-second presentation short
- starts the new face immediately with a fresh 30-second timer

Showing the SAME face again still does nothing.

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

PREVIEW
https://renoramirez-create.github.io/idis-limited-coin/parallax-test.html?v=16

AR
https://renoramirez-create.github.io/idis-limited-coin/?v=16

CACHE VERSION
20260821-scene16
