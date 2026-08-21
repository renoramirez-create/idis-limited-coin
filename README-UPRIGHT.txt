IDIS GSX 2026 - UPRIGHT SQUARE PARALLAX UPDATE

THIS VERSION CHANGES THE AR BEHAVIOR, NOT YOUR 1920 x 1920 ARTWORK.

REPLACE
- index.html
- ar.js
- parallax-config.js
- parallax-ar.js
- parallax-test.html

KEEP
- your three 1920 x 1920 PNG files
- calm-ar.js
- hq-camera.js
- styles.css
- assets/targets/gsx2026-two-sided.mind

NEW AR BEHAVIOR

1. The three PNG panels remain upright to the phone screen.
   They no longer inherit the physical coin's rotation.

2. The physical coin is still the tracking anchor.
   The AR composition follows the coin POSITION.

3. Back layer:
   - 12% larger than the other panels
   - fills most of the background
   - remains almost stationary

4. Middle layer:
   - approximately 40 design pixels higher
   - subtle horizontal + vertical parallax

5. Front layer:
   - closest to the camera
   - much stronger parallax movement
   - dramatic delayed fade + scale + forward reveal

6. Additional smoothing is built into the display anchor.

IMPORTANT FOR SEEING THE REAL COIN
Your PNG artwork should have transparency where you want the live camera/coin
to show through. A fully opaque PNG will cover the camera image regardless of AR code.

TEST FIRST
Open:
/parallax-test.html

The preview now demonstrates the intended upright behavior.

CACHE VERSION
20260820-upright8
