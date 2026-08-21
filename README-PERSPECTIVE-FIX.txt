IDIS GSX 2026 - PERSPECTIVE TRACKING FIX
BUILD 14

The prior build used reversed X/Y signs for the plane tilt and did not normalize the target normal to face the camera.

FIX:
- convert target normal to camera space
- if normal.z < 0, flip it so it faces the viewer
- yaw = atan2(normal.x, normal.z)
- pitch = -atan2(normal.y, normal.z)
- CSS rotateY = yaw
- CSS rotateX = pitch
- ignore Z roll so text/logos remain upright
- remove large manual tilt-driven XY shifts that were fighting preserve-3d

KEEP:
- 4K camera request
- distance zoom
- front/middle/back staged reveal
- translateZ depth separation

REPLACE:
- index.html
- ar.js
- parallax-test.html

styles.css is unchanged from Build 13 and included for convenience.

TEST:
https://renoramirez-create.github.io/idis-limited-coin/parallax-test.html?v=14

AR:
https://renoramirez-create.github.io/idis-limited-coin/?v=14

CACHE VERSION:
20260821-perspective14
