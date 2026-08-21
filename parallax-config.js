window.IDIS_PARALLAX = Object.freeze({
  atlanta: {
    // Three 1920 x 1920 transparent PNG panels.
    back: '#px-atlanta-back',
    middle: '#px-atlanta-middle',
    front: '#px-atlanta-front',

    // The entire square composition is intentionally much larger than the coin.
    // Back is slightly oversized so it fills most of the camera view.
    baseSize: 3.00,
    backScale: 1.12,
    middleScale: 1.00,
    frontScale: 1.00,

    // Real AR depth. Front is closest to the viewer.
    zBack: 0.015,
    zMiddle: 0.120,
    zFront: 0.285,

    // 40 px vertical lift on a 1920 px design:
    // 40 / 1920 * 3.00 ~= 0.0625 AR units.
    middleBaseY: 0.063,
    frontBaseY: 0.000,

    // Screen-upright parallax movement.
    // The BACK remains nearly fixed.
    // MIDDLE moves a little.
    // FRONT moves substantially more.
    middleParallaxX: 0.115,
    middleParallaxY: 0.085,
    frontParallaxX: 0.285,
    frontParallaxY: 0.205,

    // Extra movement based on where the target is in the camera frame.
    middleScreenX: 0.055,
    middleScreenY: 0.040,
    frontScreenX: 0.135,
    frontScreenY: 0.095,

    // Safety limits so the layers never slide completely away from one another.
    middleMaxShift: 0.16,
    frontMaxShift: 0.34,

    // Additional smoothing for the visual anchor.
    anchorTau: 0.115,
    parallaxTau: 0.155,

    // Reveal timing.
    bottomFadeMs: 780,
    frontDelayMs: 500,
    frontFadeMs: 1550,
    frontStartScale: 0.68,
    frontStartZOffset: -0.090
  }
});
