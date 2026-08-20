window.IDIS_PARALLAX = Object.freeze({
  atlanta: {
    // All three PNGs are now 1080 x 1920 (9:16 portrait) and share the same center point.
    back: './assets/parallax/atlanta/layer-1-back.png',
    middle: './assets/parallax/atlanta/layer-2-middle.png',
    front: './assets/parallax/atlanta/layer-3-front.png',

    // Width and height are in MindAR target units.
    // The target itself is about 1 unit wide. This portrait stack is a little narrower
    // than the old widescreen layout but much taller to create more vertical design space.
    width: 1.68,
    height: 2.986667,

    // True AR depth, not CSS z-index.
    zBack: 0.050,
    zMiddle: 0.120,
    zFront: 0.215,

    // Reveal timing.
    bottomFadeMs: 760,
    frontDelayMs: 480,
    frontFadeMs: 1500,
    frontStartScale: 0.72,
    frontStartZOffset: -0.050
  }
});
