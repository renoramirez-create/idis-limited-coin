IDIS GSX 2026 - BUILD 35
HYBRID 360 VIDEO SPHERE MODE

NEW EXPECTED FILE
assets/video/idis-sphere-360.mp4

RECOMMENDED VIDEO FORMAT
- 2:1 equirectangular 360 video
- H.264 MP4
- 2048 x 1024 is the best starting point for mobile
- 3072 x 1536 if the quality increase is clearly visible
- 30 fps
- muted / no audio track
- yuv420p
- fast-start / web optimized
- avoid 4K unless testing proves event phones can handle it smoothly

SEQUENCE
1. IDIS coin recognized
2. transparent idis-showcase-alpha.webm plays
3. sphere MP4 begins buffering quietly during the opening
4. opening WebM ends and freezes
5. 360 sphere starts
6. sphere fades in over 1.4s
7. frozen WebM fades away over the same transition
8. One Solution. One Company. appears on the closest foreground plane
9. YouTube feature plays on its own preserve-3D plane
10. phone tilt / drag moves the sphere much more than the foreground panels
11. closing screen: See you next time, {Name} / SEE SECURITY SMARTER

SPHERE LOOK-AROUND
Horizontal:
- drag + phone tilt
- up to roughly +/- 78 degrees from center

Vertical:
- drag + phone tilt
- up to roughly +/- 48 degrees

IDLE RESET
The existing 3-second idle home behavior still recenters pan and therefore
smoothly returns the sphere toward its starting view.

FALLBACK
If idis-sphere-360.mp4 is missing or cannot play, the frozen WebM and the
dark-teal background remain visible and the IDIS feature continues.

For testing only, the sphere <video> also contains a fallback source pointing
to idis-showcase-alpha.webm. A normal flat video will appear stretched on a
sphere. Replace it with the 2:1 panoramic MP4 for the real experience.

FILES TO REPLACE
- index.html
- ar.js
- styles.css

NEW OPTIONAL TEST FILE
- sphere-mode-preview.html

UPLOAD NEW MEDIA
- assets/video/idis-sphere-360.mp4

MAIN TEST
https://renoramirez-create.github.io/idis-limited-coin/?v=35

SPHERE-ONLY PREVIEW
https://renoramirez-create.github.io/idis-limited-coin/sphere-mode-preview.html?v=35

CACHE VERSION
20260821-sphere35
