IDIS GSX 2026 - BUILD 29
START AR LAUNCH FIX

ROOT CAUSE
Build 28 still contained an obsolete initialization block referencing:

idisFeatureVideo

That variable belonged to the older local-MP4 version.

Because the variable no longer existed, the browser threw:

ReferenceError: idisFeatureVideo is not defined

The exception occurred during page initialization and prevented the
remaining event listeners, including the Start AR button workflow, from
finishing setup.

FIX
- removed the obsolete local-feature-video listener block
- verified there are no remaining standalone idisFeatureVideo references
- JavaScript passes node --check syntax validation
- preserved the new YouTube wrapper/player implementation
- preserved the WebGL alpha compositor
- preserved logo > YouTube > showcase stacking
- changed every cache key to:

20260821-launchfix29

CONSOLE CHECK

After uploading, refresh the main page and look for:

[IDIS WebAR] Build 29 loaded: 20260821-launchfix29

If the console still says:

ar.js?v=20260821-idisyoutube27

or:

ar.js?v=20260821-layerfix28

then GitHub is still serving an older index.html or the browser has an old
page open.

REPLACE ALL THREE ROOT FILES TOGETHER:
- index.html
- ar.js
- styles.css

Also upload:
- idis-media-test.html

DO NOT ONLY REPLACE ar.js.
The new index.html is what points the browser at the Build 29 cache key.

MAIN TEST:
https://renoramirez-create.github.io/idis-limited-coin/?v=29

MEDIA TEST:
https://renoramirez-create.github.io/idis-limited-coin/idis-media-test.html?v=29

KEEP:
assets/video/idis-showcase-alpha.webm
assets/ui/idis-logo.png
assets/parallax/atlanta/*
assets/targets/gsx2026-two-sided.mind
