IDIS GSX 2026 - BUILD 23
FULL PHONE TILT + RE-SCAN FIX

BASELINE REMAINS:
- detached 30-second interactive scene
- drag + pinch
- 3-second idle auto-center
- opposite coin face switching
- 1 / 2 / 3 second Atlanta reveal
- dark teal takeover
- remembered guest name
- 6-second personalized end card

FIXED: TILT ONLY WORKED ON FIRST SCAN

Build 22 cleared the raw sensor value when a new coin presentation started.

Build 23 keeps the DeviceOrientation stream alive continuously while AR is
running.

While the scanner is waiting:
- phone sensor samples continue updating in the background

When ANY new coin face is scanned:
- the latest live sensor sample instantly becomes the new neutral position
- no stale first-scan reference is reused
- no waiting for a special new sensor event is required

This makes tilt work for:
- first scan
- second scan
- third scan
- switching coin faces
- returning after the 30-second scene/end card

NEW: FOUR-DIRECTION TILT

LEFT / RIGHT
Uses the phone's gamma axis.

UP / DOWN
Uses the phone's beta axis.

The values are remapped to SCREEN coordinates, so portrait and landscape
orientations use the correct axes.

ATLANTA:
- phone up/down controls rotateX
- phone left/right controls rotateY
- drag tilt is added on top

IDIS:
- phone up/down controls X rotation
- phone left/right controls Y rotation
- drag tilt is added on top

MOTION LIMITS:
- left/right visual tilt about +/- 6.5 degrees
- up/down visual tilt about +/- 5.5 degrees
- smoothing applied to both axes

PHONE ROTATION:
If the visitor rotates the phone from portrait to landscape, the system
re-zeroes on the next orientation sample to prevent a sudden scene jump.

IPHONE:
Motion permission is still requested from the Start AR user tap.
If AR is closed and started again, Build 23 now reattaches the sensor listener.

REPLACE:
- index.html
- ar.js
- styles.css

KEEP:
- all existing assets

TEST:
https://renoramirez-create.github.io/idis-limited-coin/?v=23

CACHE VERSION:
20260821-fulltilt23
