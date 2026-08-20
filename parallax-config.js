window.IDIS_PARALLAX = Object.freeze({
  atlanta: {
    // 1920 x 1920 square transparent PNG layers.
    back: '#px-atlanta-back',
    middle: '#px-atlanta-middle',
    front: '#px-atlanta-front',

    // Square AR layout.
    width: 1.96,
    height: 1.96,

    // Real AR depth separation.
    // Front layer pushed farther toward the viewer so the parallax reads more strongly.
    zBack: 0.040,
    zMiddle: 0.135,
    zFront: 0.325,

    // Reveal timing and motion.
    bottomFadeMs: 760,
    frontDelayMs: 520,
    frontFadeMs: 1650,
    frontStartScale: 0.64,
    frontStartZOffset: -0.110
  }
});
