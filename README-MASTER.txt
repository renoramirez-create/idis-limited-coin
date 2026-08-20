IDIS GSX 2026 MASTER - HQ CAMERA + CALM TRACKING + 9:16 PARALLAX

This is the FULL MERGED build. It replaces the earlier patch-by-patch files.

KEEP YOUR EXISTING FILE:
assets/targets/gsx2026-two-sided.mind

The ZIP intentionally does not include that .mind file, so uploading these files will not overwrite it.

Upload/replace the files and folders from this ZIP at the ROOT of your GitHub repository.

Key root files:
index.html
styles.css
ar.js
calm-ar.js
hq-camera.js
parallax-config.js
parallax-ar.js
parallax-test.html

Camera:
- prefers rear/environment camera
- asks for 1920x1080 at about 30fps as an IDEAL
- falls back automatically when the browser/device cannot provide that exact mode

9:16 Parallax:
- 3 transparent PNGs, each 1080x1920
- explicitly preloaded by index.html
- bottom + middle fade in together
- top/front layer fades in later while scaling from 72% to 100%
- query-string cache busting forces updated files to load from GitHub Pages

Test the PNG stack without AR:
https://YOUR-USER.github.io/idis-limited-coin/parallax-test.html

After GitHub upload:
1. Wait for Pages deployment.
2. Close the old phone tab completely.
3. Reopen the site.
4. If a stale page appears, append ?v=5 once to the URL.
