/*
  IDIS GSX 2026 | Screen-Upright Square Parallax

  The physical coin is used as the tracking anchor only.

  IMPORTANT DIFFERENCE FROM THE EARLIER VERSION:
  The PNG artwork is NOT parented to the coin's rotation anymore.
  It follows the coin's position, but faces the phone camera at all times.
  Therefore the artwork remains upright even if the coin is rotated.

  Back layer:
    large, calm, mostly stationary

  Middle layer:
    lifted approximately 40 design pixels
    subtle parallax

  Front layer:
    closest to camera
    strongest parallax
*/
(() => {
  'use strict';

  const THREE = AFRAME.THREE;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const getCfg = () => (window.IDIS_PARALLAX && window.IDIS_PARALLAX.atlanta) || {};
  const expAlpha = (dt, tau) => 1 - Math.exp(-dt / Math.max(0.001, tau));

  function setOpacity(el, opacity) {
    el.setAttribute('material', 'opacity', opacity);
  }

  function clearAnimations(el) {
    ['animation__opacity', 'animation__scale', 'animation__position']
      .forEach(name => el.removeAttribute(name));
  }

  AFRAME.registerComponent('parallax-stack', {
    init() {
      const c = getCfg();

      // The display root is intentionally attached to the SCENE, not the
      // tracked target. That lets us ignore the coin's physical rotation.
      const root = document.createElement('a-entity');
      root.classList.add('experience-root', 'atlanta-experience', 'parallax-experience');
      root.setAttribute('visible', 'false');
      this.el.sceneEl.appendChild(root);

      this.root = root;
      this.cameraEl = this.el.sceneEl.querySelector('a-camera');

      this.layers = {
        back: this.makeLayer(c.back, c.zBack, c.backScale, 10, 'back'),
        middle: this.makeLayer(c.middle, c.zMiddle, c.middleScale, 20, 'middle'),
        front: this.makeLayer(c.front, c.zFront, c.frontScale, 30, 'front')
      };

      this.rawTargetPosition = new THREE.Vector3();
      this.smoothTargetPosition = new THREE.Vector3();
      this.targetQuaternion = new THREE.Quaternion();
      this.cameraQuaternion = new THREE.Quaternion();
      this.inverseCameraQuaternion = new THREE.Quaternion();
      this.targetNormal = new THREE.Vector3();
      this.cameraSpaceTarget = new THREE.Vector3();

      this.smoothMiddle = new THREE.Vector2(0, c.middleBaseY || 0);
      this.smoothFront = new THREE.Vector2(0, c.frontBaseY || 0);

      this.initializedPose = false;
      this.revealed = false;
      this.lastTick = performance.now();

      this.reset();
      console.info('IDIS screen-upright parallax ready', c);
    },

    makeLayer(src, z, scaleMultiplier, renderOrder, name) {
      const c = getCfg();
      const size = (c.baseSize || 3.0) * (scaleMultiplier || 1);

      const image = document.createElement('a-image');
      image.classList.add('parallax-layer', `parallax-${name}`);
      image.setAttribute('src', src);
      image.setAttribute('width', String(size));
      image.setAttribute('height', String(size));
      image.setAttribute('position', `0 0 ${z || 0}`);
      image.setAttribute(
        'material',
        'shader: flat; transparent: true; opacity: 0; depthWrite: false; depthTest: true; alphaTest: 0.005; side: double'
      );

      image.addEventListener('object3dset', () => {
        const mesh = image.getObject3D('mesh');
        if (!mesh) return;
        mesh.renderOrder = renderOrder;
        if (mesh.material) {
          mesh.material.depthWrite = false;
          mesh.material.transparent = true;
        }
      });

      this.root.appendChild(image);
      return image;
    },

    reset() {
      if (!this.layers) return;

      const c = getCfg();
      const { back, middle, front } = this.layers;

      this.revealed = false;
      this.initializedPose = false;
      [back, middle, front].forEach(clearAnimations);

      this.root.setAttribute('visible', 'false');

      back.setAttribute('scale', '1 1 1');
      middle.setAttribute('scale', '1 1 1');
      front.setAttribute(
        'scale',
        `${c.frontStartScale || 0.68} ${c.frontStartScale || 0.68} ${c.frontStartScale || 0.68}`
      );

      back.setAttribute('position', `0 0 ${c.zBack || 0.015}`);
      middle.setAttribute('position', `0 ${c.middleBaseY || 0.063} ${c.zMiddle || 0.12}`);
      front.setAttribute(
        'position',
        `0 ${c.frontBaseY || 0} ${(c.zFront || 0.285) + (c.frontStartZOffset || -0.09)}`
      );

      this.smoothMiddle.set(0, c.middleBaseY || 0.063);
      this.smoothFront.set(0, c.frontBaseY || 0);

      setOpacity(back, 0);
      setOpacity(middle, 0);
      setOpacity(front, 0);
    },

    syncPose(force = false, dt = 1 / 60) {
      if (!this.cameraEl || !this.cameraEl.object3D) return;

      const c = getCfg();
      const targetObj = this.el.object3D;
      const cameraObj = this.cameraEl.object3D;

      targetObj.getWorldPosition(this.rawTargetPosition);
      targetObj.getWorldQuaternion(this.targetQuaternion);
      cameraObj.getWorldQuaternion(this.cameraQuaternion);

      if (!this.initializedPose || force) {
        this.smoothTargetPosition.copy(this.rawTargetPosition);
        this.initializedPose = true;
      } else {
        const a = expAlpha(dt, c.anchorTau || 0.115);
        this.smoothTargetPosition.lerp(this.rawTargetPosition, a);
      }

      // Follow the coin's POSITION...
      this.root.object3D.position.copy(this.smoothTargetPosition);

      // ...but copy the CAMERA orientation, not the coin orientation.
      // This is what keeps the artwork upright to the viewer.
      this.root.object3D.quaternion.copy(this.cameraQuaternion);

      // Use the coin's tilt relative to the camera as a parallax input.
      this.inverseCameraQuaternion.copy(this.cameraQuaternion).invert();
      this.targetNormal
        .set(0, 0, 1)
        .applyQuaternion(this.targetQuaternion)
        .applyQuaternion(this.inverseCameraQuaternion)
        .normalize();

      const tiltX = clamp(this.targetNormal.x, -0.80, 0.80);
      const tiltY = clamp(this.targetNormal.y, -0.80, 0.80);

      // Also use target position in the camera frame.
      cameraObj.updateMatrixWorld(true);
      this.cameraSpaceTarget
        .copy(this.smoothTargetPosition)
        .applyMatrix4(cameraObj.matrixWorldInverse);

      const depth = Math.max(0.20, Math.abs(this.cameraSpaceTarget.z));
      const screenX = clamp(this.cameraSpaceTarget.x / depth, -0.70, 0.70);
      const screenY = clamp(this.cameraSpaceTarget.y / depth, -0.70, 0.70);

      // Back stays centered and calm.
      this.layers.back.object3D.position.x = 0;
      this.layers.back.object3D.position.y = 0;

      const middleTargetX = clamp(
        -tiltX * (c.middleParallaxX || 0.115) - screenX * (c.middleScreenX || 0.055),
        -(c.middleMaxShift || 0.16),
        c.middleMaxShift || 0.16
      );
      const middleTargetY =
        (c.middleBaseY || 0.063) +
        clamp(
          tiltY * (c.middleParallaxY || 0.085) + screenY * (c.middleScreenY || 0.040),
          -(c.middleMaxShift || 0.16),
          c.middleMaxShift || 0.16
        );

      const frontTargetX = clamp(
        -tiltX * (c.frontParallaxX || 0.285) - screenX * (c.frontScreenX || 0.135),
        -(c.frontMaxShift || 0.34),
        c.frontMaxShift || 0.34
      );
      const frontTargetY =
        (c.frontBaseY || 0) +
        clamp(
          tiltY * (c.frontParallaxY || 0.205) + screenY * (c.frontScreenY || 0.095),
          -(c.frontMaxShift || 0.34),
          c.frontMaxShift || 0.34
        );

      const p = expAlpha(dt, c.parallaxTau || 0.155);
      this.smoothMiddle.lerp(new THREE.Vector2(middleTargetX, middleTargetY), p);
      this.smoothFront.lerp(new THREE.Vector2(frontTargetX, frontTargetY), p);

      // Only change X/Y here. Z remains controlled by depth/reveal animation.
      this.layers.middle.object3D.position.x = this.smoothMiddle.x;
      this.layers.middle.object3D.position.y = this.smoothMiddle.y;

      this.layers.front.object3D.position.x = this.smoothFront.x;
      this.layers.front.object3D.position.y = this.smoothFront.y;
    },

    reveal() {
      const c = getCfg();
      const { back, middle, front } = this.layers;

      this.revealed = true;
      this.syncPose(true);
      this.root.setAttribute('visible', 'true');

      // Back + middle resolve together.
      [back, middle].forEach(layer => {
        layer.setAttribute('animation__opacity', {
          property: 'material.opacity',
          from: 0,
          to: 1,
          dur: c.bottomFadeMs || 780,
          easing: 'easeOutCubic'
        });
      });

      // Front arrives later and moves toward the camera.
      front.setAttribute('animation__opacity', {
        property: 'material.opacity',
        from: 0,
        to: 1,
        delay: c.frontDelayMs || 500,
        dur: c.frontFadeMs || 1550,
        easing: 'easeInOutSine'
      });

      front.setAttribute('animation__scale', {
        property: 'scale',
        from: `${c.frontStartScale || 0.68} ${c.frontStartScale || 0.68} ${c.frontStartScale || 0.68}`,
        to: '1 1 1',
        delay: c.frontDelayMs || 500,
        dur: c.frontFadeMs || 1550,
        easing: 'easeOutCubic'
      });

      front.setAttribute('animation__position', {
        property: 'position.z',
        from: (c.zFront || 0.285) + (c.frontStartZOffset || -0.09),
        to: c.zFront || 0.285,
        delay: c.frontDelayMs || 500,
        dur: c.frontFadeMs || 1550,
        easing: 'easeOutCubic'
      });
    },

    tick(time, delta) {
      if (!this.revealed || !this.root.object3D.visible) return;
      const dt = Math.min(0.08, Math.max(1 / 120, (delta || 16.7) / 1000));
      this.syncPose(false, dt);
    },

    remove() {
      if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    }
  });
})();
