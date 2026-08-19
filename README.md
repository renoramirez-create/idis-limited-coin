# IDIS Americas GSX 2026 WebAR Coin

A mobile browser augmented reality experience built for the limited GSX 2026 Atlanta coin.
The physical coin is the image target. Once recognized, the page anchors layered holographic
Atlanta and Georgia visuals around it using MindAR + A-Frame.

## Included

- Mobile start screen and camera permission flow
- Coin image tracking with MindAR
- Teal and purple IDIS-inspired visual system
- Layered parallax around the physical coin
- Atlanta skyline hologram
- Georgia state hologram
- Stadium-inspired hologram
- Atlanta Phoenix-inspired monument graphic
- Peach State graphic
- GSX 2026 / Atlanta / event date title card
- IDIS Americas limited coin badge
- Target found / target lost UI states
- Desktop visual preview at `preview.html`

## 1. Compile the coin target

MindAR requires a precompiled `.mind` target file.

Official compiler:
https://hiukim.github.io/mind-ar-js-doc/tools/compile/

Upload:
`assets/targets/gsx2026-coin-reference.png`

Download the generated file, rename it to:
`gsx2026.mind`

Put it here:
`assets/targets/gsx2026.mind`

## 2. Preview the design

`preview.html` renders the same AR content without the camera or tracking.
Run the folder through a local web server instead of double-clicking the file.

Example with Python:

```bash
python -m http.server 8080
```

Then open:
`http://localhost:8080/preview.html`

## 3. Test AR on a phone

Camera access requires a secure context in normal production use, so deploy the folder to an
HTTPS URL on the IDIS Americas website, for example:

`https://idisamericas.com/ar/gsx-2026/`

Point the campaign QR code to that URL.

The flow is:

QR code -> IDIS landing page -> Start AR -> camera permission -> scan coin -> AR layers appear

## 4. Recommended WordPress / Divi deployment

For the cleanest setup, upload the entire folder to a dedicated path on the same domain rather
than pasting the AR scene into a Divi Code Module. The page needs full-screen camera/video and
is easier to maintain as a standalone static page.

Example server path:
`/public_html/ar/gsx-2026/`

The folder's `index.html` becomes the landing page.

## 5. Brand assets

The supplied scene intentionally uses lightweight vector line art and an IDIS-inspired palette.
For final production, replace the simple text lockup with an official IDIS Americas SVG/PNG logo
if your brand team supplies one.

Main colors are defined in both:
- `styles.css`
- `ar.js` (`IDIS_AR` object)

## 6. Adjusting placement

Edit `makeLocationArt()` in `ar.js`.
Each asset has:

- `pos`: x, y, z position relative to the center of the coin
- `w`: width
- `h`: height
- `amount`: floating/parallax motion amount
- `phase`: animation timing offset

The Z value is important. Different Z depths produce the layered parallax effect as the user
moves the phone around the coin.

## 7. Coin tracking notes

A minted metal coin is more difficult to track than a flat printed card because highlights and
reflections change with viewing angle. Use the detailed relief and asymmetric artwork as the
tracking signal, and test the final physical coin under several lighting conditions.

If the minted result differs noticeably from the supplied render, compile the final `.mind` file
from a straight-on photograph of the real manufactured coin.

## Libraries

- A-Frame 1.5.0
- MindAR 1.2.5

The versions above follow the current MindAR installation examples for A-Frame image tracking.
