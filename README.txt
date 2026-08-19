IDIS GSX 2026 - Calm Tracking Patch

UPLOAD THESE TWO FILES TO THE ROOT OF YOUR EXISTING GITHUB REPOSITORY:

1. index.html
   Replace the existing index.html.

2. calm-ar.js
   Add this as a NEW file beside ar.js.

DO NOT DELETE OR REPLACE:
- ar.js
- styles.css
- assets/
- assets/targets/gsx2026-two-sided.mind

WHAT CHANGED

MindAR:
filterMinCF: 0.0001
filterBeta: 0.001
warmupTolerance: 8
missTolerance: 20

A second adaptive pose smoother was added in calm-ar.js:
- ignores microscopic position changes
- ignores tiny rotation changes
- gently follows normal movement
- catches up faster when the camera is intentionally moved
- briefly holds the last good pose through very short tracking gaps

Decorative motion was also reduced:
- floating layers about 66% smaller
- floating motion about 40% slower
- ring spins about 42% slower
- scan motion about 38% slower

If it feels TOO slow:
In calm-ar.js lower:
positionTau: 0.18 -> 0.12
rotationTau: 0.22 -> 0.15

If it still feels TOO nervous:
Increase:
positionTau: 0.18 -> 0.24
rotationTau: 0.22 -> 0.30

For a reflective metal coin, diffuse lighting is much better than a point light.
Avoid direct overhead glare.
