IDIS GSX 2026 - PARALLAX + CALM MASTER PATCH

WHY THE SHAKE CAME BACK
The previous UI patch was based on the camera-fix build, so it restored the older aggressive MindAR tracking values. This package merges the calm tracking back in and keeps the new UI/logo behavior.

UPLOAD / REPLACE AT REPOSITORY ROOT
- index.html            REPLACE
- ar.js                 REPLACE
- styles.css            REPLACE
- calm-ar.js             NEW/REPLACE
- parallax-config.js     NEW
- parallax-ar.js         NEW

UPLOAD THIS ASSET
- assets/ui/idis-logo.png

UPLOAD THIS FOLDER
- assets/parallax/atlanta/

KEEP YOUR EXISTING TARGET FILE
- assets/targets/gsx2026-two-sided.mind
Do not delete or overwrite it.

THREE PNG LAYERS
All three must remain exactly 1920 x 1080 and aligned to the same center:
1. assets/parallax/atlanta/layer-1-back.png
2. assets/parallax/atlanta/layer-2-middle.png
3. assets/parallax/atlanta/layer-3-front.png

The included PNGs are only working demo artwork. Replace them with your finished transparent PNGs using the same filenames.

DESIGN GUIDE
assets/parallax/atlanta/DESIGN-GUIDE-1920x1080.png
Use it as a temporary Photoshop/Illustrator guide. Do not use it as an AR layer.

DEPTH
The layers use TRUE 3D target-space Z depth:
Back   = 0.055
Middle = 0.125
Front  = 0.225
This produces parallax naturally as the phone moves around the coin.

REVEAL
Back + middle fade in together: 720 ms
Front begins after: 460 ms
Front fades/scales forward over: 1450 ms
Front starts at: 72% size

EDIT THESE VALUES IN parallax-config.js.

TRACKING
MindAR has been reset to calmer values:
filterMinCF: 0.0001
filterBeta: 0.001
warmupTolerance: 8
missTolerance: 20

calm-ar.js adds a second adaptive smoother and briefly holds the last good pose through tiny reflective tracking gaps.

UI STATE
When target found: scan guide disappears, AR appears.
When target truly lost: AR disappears, scan guide returns.
A short 260 ms loss debounce prevents one weak reflective frame from blinking the scene.
