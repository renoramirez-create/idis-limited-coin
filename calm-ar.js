/*
  IDIS Americas GSX 2026
  Calm Tracking Layer
  ------------------------------------------------------------
  This file adds a second, gentle stabilizing pass on top of
  MindAR's OneEuroFilter and tones down intentional AR motion.

  The goal is not "zero movement." The goal is calm, premium
  motion that follows the coin without vibrating around it.
*/
(() => {
  'use strict';

  const CALM = Object.freeze({
    // Hold the last good pose briefly through tiny recognition gaps.
    lostHoldMs: 360,

    // Time constants in seconds. Higher = calmer, but more lag.
    positionTau: 0.18,
    rotationTau: 0.22,
    scaleTau: 0.20,

    // Faster catch-up when the phone/coin is deliberately moved.
    fastTau: 0.075,
    fastPositionThreshold: 0.035,
    fastRotationThresholdDeg: 4.0,

    // Ignore microscopic pose changes that read visually as vibration.
    positionDeadband: 0.0010,
    rotationDeadbandDeg: 0.30,
    scaleDeadband: 0.0015,

    // Reduce the built-in decorative movement from ar.js.
    floatAmountMultiplier: 0.34,
    floatSpeedMultiplier: 0.60,
    spinSpeedMultiplier: 0.58,
    scanSpeedMultiplier: 0.62
  });

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const alphaFromTau = (dt, tau) => 1 - Math.exp(-dt / Math.max(0.001, tau));

  function patchTarget(targetEl) {
    if (!targetEl || !targetEl.components) return false;

    const component = targetEl.components['mindar-image-target'];
    if (!component || component.__idisCalmPatched) return false;

    const THREE = AFRAME.THREE;
    const originalUpdate = component.updateWorldMatrix;

    const rawMatrix = new THREE.Matrix4();
    const smoothMatrix = new THREE.Matrix4();

    const rawPosition = new THREE.Vector3();
    const rawQuaternion = new THREE.Quaternion();
    const rawScale = new THREE.Vector3();

    const smoothPosition = new THREE.Vector3();
    const smoothQuaternion = new THREE.Quaternion();
    const smoothScale = new THREE.Vector3();

    let initialized = false;
    let lastFrameTime = performance.now();
    let lastSeenTime = 0;

    component.updateWorldMatrix = function (worldMatrix) {
      const now = performance.now();

      // Keep the last stable pose for a fraction of a second if a reflection,
      // glare, finger, or slight angle causes one or two weak tracking frames.
      if (worldMatrix === null) {
        if (initialized && now - lastSeenTime < CALM.lostHoldMs) {
          return;
        }

        initialized = false;
        return originalUpdate.call(component, null);
      }

      lastSeenTime = now;

      rawMatrix.fromArray(worldMatrix);
      rawMatrix.decompose(rawPosition, rawQuaternion, rawScale);

      if (!initialized) {
        smoothPosition.copy(rawPosition);
        smoothQuaternion.copy(rawQuaternion);
        smoothScale.copy(rawScale);
        initialized = true;
        lastFrameTime = now;

        smoothMatrix.compose(smoothPosition, smoothQuaternion, smoothScale);
        return originalUpdate.call(component, smoothMatrix.elements.slice());
      }

      const dt = clamp((now - lastFrameTime) / 1000, 1 / 120, 0.10);
      lastFrameTime = now;

      const positionDelta = smoothPosition.distanceTo(rawPosition);
      const rotationDelta = smoothQuaternion.angleTo(rawQuaternion);
      const rotationDeltaDeg = THREE.MathUtils.radToDeg(rotationDelta);
      const scaleDelta = smoothScale.distanceTo(rawScale);

      const deliberateMove =
        positionDelta > CALM.fastPositionThreshold ||
        rotationDeltaDeg > CALM.fastRotationThresholdDeg;

      const pTau = deliberateMove ? CALM.fastTau : CALM.positionTau;
      const rTau = deliberateMove ? CALM.fastTau : CALM.rotationTau;
      const sTau = deliberateMove ? CALM.fastTau : CALM.scaleTau;

      if (positionDelta > CALM.positionDeadband) {
        smoothPosition.lerp(rawPosition, alphaFromTau(dt, pTau));
      }

      if (rotationDeltaDeg > CALM.rotationDeadbandDeg) {
        smoothQuaternion.slerp(rawQuaternion, alphaFromTau(dt, rTau));
        smoothQuaternion.normalize();
      }

      if (scaleDelta > CALM.scaleDeadband) {
        smoothScale.lerp(rawScale, alphaFromTau(dt, sTau));
      }

      smoothMatrix.compose(smoothPosition, smoothQuaternion, smoothScale);
      return originalUpdate.call(component, smoothMatrix.elements.slice());
    };

    component.__idisCalmPatched = true;
    console.info(`IDIS Calm Tracking enabled for #${targetEl.id || 'target'}`);
    return true;
  }

  function calmDecorativeMotion(scene) {
    if (!scene) return;

    scene.querySelectorAll('[float-layer]').forEach((el) => {
      const c = el.components && el.components['float-layer'];
      if (!c || el.dataset.idisCalmedFloat === '1') return;

      el.setAttribute('float-layer', {
        amount: c.data.amount * CALM.floatAmountMultiplier,
        speed: c.data.speed * CALM.floatSpeedMultiplier,
        phase: c.data.phase
      });

      el.dataset.idisCalmedFloat = '1';
    });

    scene.querySelectorAll('[soft-spin]').forEach((el) => {
      const c = el.components && el.components['soft-spin'];
      if (!c || el.dataset.idisCalmedSpin === '1') return;

      el.setAttribute('soft-spin', {
        speed: c.data.speed * CALM.spinSpeedMultiplier,
        direction: c.data.direction
      });

      el.dataset.idisCalmedSpin = '1';
    });

    scene.querySelectorAll('[scan-beam]').forEach((el) => {
      const c = el.components && el.components['scan-beam'];
      if (!c || el.dataset.idisCalmedScan === '1') return;

      el.setAttribute('scan-beam', {
        range: c.data.range,
        speed: c.data.speed * CALM.scanSpeedMultiplier
      });

      el.dataset.idisCalmedScan = '1';
    });
  }

  function install() {
    const scene = document.querySelector('#ar-scene');
    if (!scene) return;

    const apply = () => {
      patchTarget(document.querySelector('#atlanta-target'));
      patchTarget(document.querySelector('#idis-target'));
      calmDecorativeMotion(scene);
    };

    if (scene.hasLoaded) {
      apply();
    } else {
      scene.addEventListener('loaded', apply, { once: true });
    }

    // The experience objects are created by components during scene setup.
    // Re-check a few times so the calmer decorative settings are always applied.
    [250, 700, 1400, 2600].forEach((delay) => setTimeout(apply, delay));

    document.querySelector('#atlanta-target')?.addEventListener('targetFound', apply);
    document.querySelector('#idis-target')?.addEventListener('targetFound', apply);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
