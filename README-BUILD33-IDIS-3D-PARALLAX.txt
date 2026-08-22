IDIS GSX 2026 - BUILD 33
IDIS PRESERVE-3D FEATURE + FOREGROUND LOGO PARALLAX

BASED ON WORKING BUILD 32.
A-FRAME / MINDAR LOAD ORDER REMAINS UNCHANGED.

NEW IDIS FEATURE DEPTH STRUCTURE

Foreground:
IDIS LOGO
Z depth approximately 280px

Middle:
YouTube feature video
Z depth approximately 70px

Background:
Frozen transparent showcase
Black-center / dark-teal backdrop


IDIS LOGO

- moved down from the top edge
- now sits around 33% from the top on larger screens
- around 31% on phones
- largest drag parallax ratio
- highest 3D depth plane
- remains above YouTube visually


YOUTUBE VIDEO

The YouTube panel now sits inside a true preserve-3D stage.

Phone tilt:
- left / right -> rotateY
- up / down -> rotateX

Drag:
- left / right contributes to rotateY
- up / down contributes to rotateX

Pinch:
- applies a restrained scene zoom

The YouTube layer moves less than the logo so the logo appears closer
to the viewer.


PARALLAX RATIOS

YouTube:
approximately 0.16 x drag movement
Z = 70px

IDIS logo:
approximately 0.43 x drag movement
Z = 280px


ROTATION LIMITS

Up/down:
about +/- 9 degrees combined

Left/right:
about +/- 10 degrees combined

These include both touch drag and live phone tilt.


EXISTING BUILD 32 FEATURES REMAIN

- IDIS WebM
- 6 second delayed backdrop
- 3 second fade to 80%
- black center -> dark teal outer gradient
- frozen final WebM frame
- YouTube feature video
- IDIS-specific closing:
  See you next time,
  {Name}
  SEE SECURITY SMARTER
- Atlanta remains unchanged


REPLACE TOGETHER

- index.html
- ar.js
- styles.css

TEST

https://renoramirez-create.github.io/idis-limited-coin/?v=33

CONSOLE

[IDIS WebAR] Build 33 IDIS 3D Parallax: 20260821-idis3d33

CACHE VERSION

20260821-idis3d33
