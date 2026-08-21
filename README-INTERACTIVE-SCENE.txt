IDIS GSX 2026 - BUILD 15
INTERACTIVE 30-SECOND SCENE MODE

NEW BEHAVIOR

1. CAMERA STARTS IN SCAN MODE
   Scan either coin face.

2. AFTER A FACE IS RECOGNIZED
   The unlocked scene becomes independent from the physical coin.
   The coin can leave the camera view and the scene remains on screen.

3. TOUCH CONTROLS
   One finger:
   - drag / pan scene

   Two fingers:
   - pinch to zoom in/out
   - move both fingers to pan while zooming

   Zoom limits:
   - minimum 0.58x
   - maximum 2.45x

4. AUTO CENTER
   After 3 seconds without interaction:
   - scene smoothly pans back to center
   - zoom smoothly returns to 1.0x

5. 30 SECOND EXPERIENCE
   Each unlocked face stays active for 30 seconds.

   At 30 seconds:
   - presentation is cleared
   - camera remains running
   - UI returns to "SCAN COIN NOW"

6. DIFFERENT FACE OVERRIDES THE TIMER
   If Atlanta is active and the IDIS face appears:
   - Atlanta ends immediately
   - IDIS starts immediately
   - new 30-second timer begins

   If IDIS is active and Atlanta appears:
   - same behavior in reverse

7. SAME FACE DOES NOT RESTART OR SWITCH
   Reacquiring the SAME face during its presentation does nothing.
   targetLost also does nothing.

   A presentation only switches early when the OTHER coin face is actually found.

8. ATLANTA
   Keeps:
   - front 1920x1920 PNG
   - middle 1920x1920 PNG
   - 1080x1080 MP4 background
   - staged reveal

   But it is now screen-centered and user-controlled instead of tracking the coin.

9. IDIS SIDE
   The existing IDIS hologram is cloned into a detached presentation group.
   It becomes independent from the physical target and supports the same drag/pinch controls.

10. 4K REQUEST
    The existing 4K -> 1440p -> 1080p fallback camera request remains.

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

TEST PREVIEW:
https://renoramirez-create.github.io/idis-limited-coin/parallax-test.html?v=15

TEST AR:
https://renoramirez-create.github.io/idis-limited-coin/?v=15

CACHE VERSION:
20260821-scene15
