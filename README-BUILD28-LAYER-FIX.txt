IDIS GSX 2026 - BUILD 28
WEBM ALPHA + LAYER STACK + YOUTUBE FIX

WHAT WAS WRONG IN BUILD 27

1. YOUTUBE WRAPPER
The YouTube IFrame API replaces the target DIV with an IFRAME.
Build 27 put the positioning/animation class directly on that replaceable DIV.

Result:
- CSS positioning could disappear
- YouTube could render in the wrong place or appear missing

BUILD 28:
A permanent wrapper now stays in the DOM:

idis-feature-video-wrap
    -> idis-youtube-player
       -> YouTube replaces only this inner node

The wrapper keeps all size, position, opacity and animation rules.


2. LAYER STACK

The explicit stack is now:

z 80  IDIS LOGO
z 40  YOUTUBE VIDEO WRAPPER
z 30  FEATURE OVERLAY
z 10  FROZEN SHOWCASE CANVAS
      LIVE CAMERA / WEBAR BELOW

The visible showcase is now a CANVAS instead of the native video element.
That avoids mobile video compositing layers jumping above normal HTML.


3. WEBM TRANSPARENCY

IMPORTANT:
If the actual WebM file was exported without alpha, CSS cannot restore
the original alpha channel.

Build 28 adds a GPU/WebGL compositor:
- if VP9 alpha is present, it preserves the decoded alpha
- if the browser/file gives us an opaque black background, near-black pixels
  are keyed transparent on the GPU

This is designed specifically for the black-background problem you reported.

If WebGL is unavailable, the build falls back to the native WebM using
mix-blend-mode: screen so black behaves visually like transparency.


4. YOUTUBE

YouTube player:
G7vGMc4Z2os

Build 28:
- keeps a stable 16:9 wrapper
- sets autoplay permission on the iframe
- uses strict-origin-when-cross-origin referrer policy
- passes origin + widget_referrer
- starts with loadVideoById instead of cue + seek + play
- detects YouTube ENDED and advances to the thank-you card


UPLOAD / REPLACE

REPLACE ROOT:
- index.html
- ar.js
- styles.css

KEEP:
- assets/video/idis-showcase-alpha.webm
- assets/ui/idis-logo.png
- all Atlanta assets
- .mind target file


TEST MAIN AR:
https://renoramirez-create.github.io/idis-limited-coin/?v=28

TEST MEDIA WITHOUT AR:
https://renoramirez-create.github.io/idis-limited-coin/idis-media-test.html?v=28

The media test is useful because it removes MindAR/camera tracking from the
equation. It lets you confirm:
- WebM black/background removal
- YouTube embedding
- IDIS logo layering


IF YOUTUBE STILL SHOWS AN EMBED ERROR

Confirm the YouTube video has "Allow embedding" enabled in YouTube Studio.
Age-restricted videos generally cannot play normally in third-party embeds.


CACHE VERSION
20260821-layerfix28
