IDIS GSX 2026 - BUILD 30 FAST LOAD OPTIMIZED

Startup improvements applied:
- A-Frame, MindAR, and ar.js use defer so intro paints first
- YouTube API removed from initial page; loads only after IDIS scan
- Atlanta MP4 and IDIS WebM changed from preload=auto to metadata
- large videos no longer play/pause during Start AR
- media warms only after camera is live
- duplicate full .mind target fetch removed
- exact 4K/1440p retry chain replaced by one flexible 1080p camera request
- obsolete IDIS/Atlanta A-Frame hologram component library removed
- obsolete five SVG a-assets removed
- idis-hologram target component removed
- A-Frame antialias disabled because scene is tracking-only
- development no-cache meta tags removed

AR.JS SIZE
Before: 96.1 KB
After: 76.2 KB

REPLACE TOGETHER
- index.html
- ar.js
- styles.css

Optional:
- idis-media-test.html

KEEP ALL CURRENT MEDIA AND .MIND ASSETS.

TEST:
https://renoramirez-create.github.io/idis-limited-coin/?v=30

Console should show:
[IDIS WebAR] Build 30 Fast Load: 20260821-fast30opt

MEDIA FILES ARE STILL THE BIGGEST UNKNOWN.
For best event performance, keep the transparent WebM as small as practical, preferably under about 10 MB, and keep the Atlanta H.264 background video compressed.
