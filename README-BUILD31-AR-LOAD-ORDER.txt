IDIS GSX 2026 - BUILD 31
A-FRAME / MINDAR LOAD ORDER FIX

THE ERROR

Build 30 changed both A-Frame and MindAR scripts to "defer".

That caused this chain:

THREE renderer init error
    ↓
A-Frame did not complete initialization
    ↓
MindAR executed without a valid global AFRAME
    ↓
AFRAME is not defined
    ↓
MindAR image system never registered
    ↓
Start AR timed out

FIX

The dependency order is restored to:

1. A-Frame 1.5.0 loads synchronously
2. MindAR 1.2.5 loads synchronously
3. ar.js loads deferred

DO NOT add defer or async to the first two scripts.

BUILD 30 PERFORMANCE IMPROVEMENTS KEPT

- 1080p rear-camera request instead of repeated exact 4K attempts
- YouTube API is not in the initial HTML
- YouTube loads only for the IDIS experience
- large media does not preload aggressively on the landing page
- media warms only after camera startup
- duplicate .mind verification download remains removed
- obsolete IDIS hologram assets/components remain removed
- old A-Frame SVG asset preload remains removed
- cache-friendly versioned local files remain

WHY THIS IS THE RIGHT COMPROMISE

A-Frame + MindAR are foundational dependencies. Trying to defer them saves
very little compared with the cost of the videos, camera, YouTube, and target
database, but it can break A-Frame's custom-element initialization.

So Build 31 keeps those two libraries stable and optimizes the expensive
resources around them instead.

REPLACE TOGETHER

- index.html
- ar.js
- styles.css

TEST

https://renoramirez-create.github.io/idis-limited-coin/?v=31

CONSOLE SHOULD SHOW

[IDIS WebAR] Build 31 AR Load Order Fix: 20260821-arorder31

YOU SHOULD NOT SEE

AFRAME is not defined

or

Cannot set properties of undefined (setting 'useLegacyLights')

The THREE useLegacyLights DEPRECATION warning may still appear as a warning
inside the A-Frame/THREE stack. A warning by itself is not a camera failure.

CACHE VERSION

20260821-arorder31
