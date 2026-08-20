IDIS GSX 2026 - SQUARE PARALLAX DEPTH UPDATE

This update keeps the 1920 x 1920 square layer system and changes the AR layout so the front panel feels even closer to the camera.

UPLOAD / REPLACE
- index.html
- parallax-config.js
- parallax-ar.js
- parallax-test.html

KEEP AS-IS
- ar.js
- calm-ar.js
- hq-camera.js
- styles.css
- assets/parallax/atlanta/layer-1-back.png
- assets/parallax/atlanta/layer-2-middle.png
- assets/parallax/atlanta/layer-3-front.png
- assets/targets/gsx2026-two-sided.mind

UPDATED DEPTH VALUES
- back   z = 0.040
- middle z = 0.135
- front  z = 0.325

This pushes the top/front layer much farther toward the viewer, so parallax movement should be more noticeable.
The front layer also now starts smaller and farther back, then resolves forward more dramatically.

CACHE BUST VERSION
20260820-depth7

After upload:
1. Commit changes.
2. Wait for GitHub Pages.
3. Close the old browser tab completely.
4. Reopen the site.
5. If needed, open once with ?v=7 at the end of the URL.
