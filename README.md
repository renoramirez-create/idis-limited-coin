# IDIS Americas GSX 2026 Two-Sided WebAR Coin

This package is a browser-based augmented reality experience for the limited IDIS Americas GSX 2026 coin.

Both sides are supported:

- **Target 0:** GSX 2026 / Atlanta, Georgia
- **Target 1:** IDIS Americas / One Solution • One Company

The project uses **MindAR image tracking + A-Frame** and is intended to be hosted as a standalone HTTPS page on the IDIS Americas website.

## What changed in this revision

This build fixes the two problems found in the first prototype:

1. **Live camera not visible behind the AR canvas**
   - The MindAR camera video is now explicitly kept visible below the transparent A-Frame canvas.
   - A `MutationObserver` catches the camera `<video>` when MindAR inserts it and reapplies safe visibility/z-index settings.
   - The code does **not** override MindAR's camera width/height/top/left values, so video-to-tracking alignment is preserved.
   - Built-in MindAR loading/scanning/error overlays are disabled because this project provides its own HUD.

2. **Close / X button not responding**
   - The HTML HUD now sits far above the A-Frame/camera layers.
   - The WebGL canvas has `pointer-events: none` because this scene has no direct 3D tapping requirements.
   - The close button responds to `pointerup` on phones.
   - Closing invalidates any in-progress camera startup, stops MindAR, and defensively stops all active camera tracks.

The start flow also checks for the required `.mind` file **before** hiding the landing screen. If the tracking file has not been compiled yet, the page now tells you exactly what is missing instead of leaving you with a black screen.

---

## Files

```text
IDIS-GSX2026-WebAR/
├── index.html
├── ar.js
├── styles.css
├── preview.html
├── camera-test.html
├── SETUP-TARGETS.html
├── README.md
├── AR-concept-reference.png
└── assets/
    ├── graphics/
    │   ├── atlanta-skyline.svg
    │   ├── georgia-state.svg
    │   ├── peaches.svg
    │   ├── phoenix-statue.svg
    │   └── stadium.svg
    └── targets/
        ├── gsx2026-coin-back.png
        ├── gsx2026-coin-front.png
        ├── gsx2026-two-sided.mind   <-- YOU CREATE THIS ONCE
        └── README.txt
```

---

## Step 1 — Build the two-sided tracking file

MindAR tracks a compiled `.mind` file, not the PNG directly.

Open:

`SETUP-TARGETS.html`

It shows the correct target order and links to the official MindAR Image Targets Compiler.

Compile both images in **one job** in this exact order:

1. `assets/targets/gsx2026-coin-back.png`
2. `assets/targets/gsx2026-coin-front.png`

Download the generated file, rename it:

`gsx2026-two-sided.mind`

and place it here:

`assets/targets/gsx2026-two-sided.mind`

The target order matters because the HTML uses:

```text
targetIndex 0 = Atlanta / Georgia side
targetIndex 1 = IDIS Americas side
```

---

## Step 2 — Test the phone camera first

Open:

`camera-test.html`

This page uses the browser camera without A-Frame or MindAR. It is useful for separating camera-permission/HTTPS problems from image-tracking problems.

If the live camera works there, return to `index.html` and test the AR tracker.

---

## Step 3 — Preview both AR designs without a camera

Open:

`preview.html`

Use the buttons in the upper-right corner to switch between:

- Atlanta Side
- IDIS Side

Run the folder through a web server rather than double-clicking the files.

Local development example:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/preview.html
```

---

## Step 4 — Test AR on a phone

For production, host the entire folder on HTTPS, for example:

```text
https://idisamericas.com/ar/gsx-2026/
```

Then point the QR code to that URL.

Suggested user flow:

```text
QR code
→ IDIS GSX landing screen
→ Start AR Experience
→ camera permission
→ scan either coin side
→ correct AR scene locks to that side
→ flip coin to discover the other experience
```

---

## AR side 1 — Atlanta / Georgia

The Atlanta side includes:

- GSX 2026 title panel
- Atlanta, Georgia and event dates
- See Security Smarter
- Atlanta skyline hologram
- Georgia outline
- stadium-inspired visual
- Phoenix monument-inspired visual
- peaches / Peach State visual
- layered teal/purple orbit rings
- parallax depth and floating motion
- Limited GSX 2026 Coin badge

## AR side 2 — IDIS Americas

The IDIS side includes:

- IDIS Americas header
- See Security Smarter
- One Solution • One Company
- AI / Video / VMS / Secure / Data / Cloud nodes
- animated scan beam
- concentric telemetry rings
- teal/purple orbit accents
- layered parallax around the physical coin

---

## WordPress / Divi deployment

For this AR page, use a dedicated folder rather than pasting the entire scene into a Divi Code Module.

Example server location:

```text
/public_html/ar/gsx-2026/
```

Upload the complete contents of this package to that folder.

Make sure these files resolve publicly:

```text
/ar/gsx-2026/index.html
/ar/gsx-2026/ar.js
/ar/gsx-2026/styles.css
/ar/gsx-2026/assets/targets/gsx2026-two-sided.mind
```

---

## Troubleshooting

### Black screen after tapping Start

Check these in order:

1. Open `camera-test.html`.
2. Confirm the browser asked for and received camera permission.
3. Confirm the site is HTTPS, or use localhost for development.
4. Open `SETUP-TARGETS.html` and click **Check Target File**.
5. Confirm `assets/targets/gsx2026-two-sided.mind` exists.
6. Reload `index.html` after replacing the target file.

### Camera works but coin is never recognized

- Confirm both targets were compiled in the correct order.
- Keep the coin mostly straight-on during initial acquisition.
- Use soft lighting and avoid hard glare across the coin face.
- Fill most of the circular guide with the coin.
- Test the actual manufactured coin, not only a screen rendering.

### Wrong experience appears on the wrong side

The two images were compiled in the wrong order. Recompile:

1. Atlanta first
2. IDIS second

### Close button

The X now explicitly stops MindAR and the underlying camera tracks. If a browser keeps the camera indicator alive after leaving the page, close that browser tab and reopen the URL.

---

## Libraries

- A-Frame 1.5.0
- MindAR 1.2.5

The project loads both libraries from their public CDNs.
