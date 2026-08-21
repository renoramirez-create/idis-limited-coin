IDIS GSX 2026 - BUILD 22
PHONE MOTION TILT

BASELINE REMAINS:
- detached 30-second interactive scene
- drag to pan
- pinch to zoom
- 3-second idle auto-center
- opposite-face switching
- 1s / 2s / 3s Atlanta reveal
- dark teal takeover
- remembered guest name
- 6-second personalized end card

NEW: PHONE LEFT / RIGHT TILT

This uses the smartphone motion sensors through the browser's
DeviceOrientation API.

It does NOT use the camera image to estimate the phone tilt.

INPUT:
DeviceOrientationEvent.gamma

Gamma represents left/right phone tilt.

BEHAVIOR:
- phone position when a coin scene starts becomes neutral
- gently tilt phone left -> scene leans left
- gently tilt phone right -> scene leans right
- maximum visual tilt is approximately +/- 5.5 degrees
- sensor readings are smoothed to reduce jitter

ATLANTA:
Phone tilt adds to the preserve-3d rotateY scene angle.

IDIS:
Phone tilt adds to the detached 3D group's Y rotation.

DRAG + PINCH:
Still work normally and combine with phone tilt.

AUTO-CENTER:
The 3-second drag/zoom reset still returns pan and zoom to center.
Phone tilt remains live because it reflects how the visitor is currently
holding the phone.

IPHONE:
iPhone Safari may display a Motion & Orientation permission prompt when
the visitor taps Start AR.

ANDROID:
Chrome typically exposes DeviceOrientation without the separate iOS-style
permission prompt.

If motion permission is denied or unsupported:
- the AR experience still works
- only the phone-tilt enhancement is disabled

REPLACE:
- index.html
- ar.js
- styles.css

KEEP:
- all current logo, video, PNG and .mind assets

TEST:
https://renoramirez-create.github.io/idis-limited-coin/?v=22

CACHE VERSION:
20260821-tilt22
