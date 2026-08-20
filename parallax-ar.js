/* IDIS Atlanta 9:16 three-layer parallax stack. */
(() => {
  'use strict';
  const getCfg = () => (window.IDIS_PARALLAX && window.IDIS_PARALLAX.atlanta) || {};
  const setOpacity = (el, opacity) => el.setAttribute('material', 'opacity', opacity);
  const clearAnimations = (el) => ['animation__opacity','animation__scale','animation__position'].forEach(name => el.removeAttribute(name));

  AFRAME.registerComponent('parallax-stack', {
    init() {
      const c = getCfg();
      const root = document.createElement('a-entity');
      root.classList.add('experience-root','atlanta-experience','parallax-experience');
      root.setAttribute('visible','false');
      this.el.appendChild(root);
      this.root = root;
      this.layers = {
        back: this.makeLayer(c.back, c.zBack, 10, 'back'),
        middle: this.makeLayer(c.middle, c.zMiddle, 20, 'middle'),
        front: this.makeLayer(c.front, c.zFront, 30, 'front')
      };
      this.reset();
      console.info('IDIS 9:16 parallax stack ready', c);
    },

    makeLayer(src, z, renderOrder, name) {
      const c = getCfg();
      const image = document.createElement('a-image');
      image.classList.add('parallax-layer', `parallax-${name}`);
      image.setAttribute('src', src);
      image.setAttribute('width', String(c.width || 1.68));
      image.setAttribute('height', String(c.height || 2.986667));
      image.setAttribute('position', `0 0 ${z || 0}`);
      image.setAttribute('material', 'shader: flat; transparent: true; opacity: 0; depthWrite: false; depthTest: true; alphaTest: 0.005; side: double');
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
      const {back,middle,front} = this.layers;
      [back,middle,front].forEach(clearAnimations);
      this.root.setAttribute('visible','false');
      back.setAttribute('scale','1 1 1');
      middle.setAttribute('scale','1 1 1');
      front.setAttribute('scale', `${c.frontStartScale || 0.72} ${c.frontStartScale || 0.72} ${c.frontStartScale || 0.72}`);
      back.setAttribute('position', `0 0 ${c.zBack}`);
      middle.setAttribute('position', `0 0 ${c.zMiddle}`);
      front.setAttribute('position', `0 0 ${(c.zFront || 0.215) + (c.frontStartZOffset || -0.05)}`);
      setOpacity(back,0); setOpacity(middle,0); setOpacity(front,0);
    },

    reveal() {
      const c = getCfg();
      const {back,middle,front} = this.layers;
      this.root.setAttribute('visible','true');
      [back,middle].forEach(layer => layer.setAttribute('animation__opacity', {
        property:'material.opacity', from:0, to:1, dur:c.bottomFadeMs || 760, easing:'easeOutCubic'
      }));
      front.setAttribute('animation__opacity', {
        property:'material.opacity', from:0, to:1, delay:c.frontDelayMs || 480, dur:c.frontFadeMs || 1500, easing:'easeInOutSine'
      });
      front.setAttribute('animation__scale', {
        property:'scale',
        from:`${c.frontStartScale || 0.72} ${c.frontStartScale || 0.72} ${c.frontStartScale || 0.72}`,
        to:'1 1 1', delay:c.frontDelayMs || 480, dur:c.frontFadeMs || 1500, easing:'easeOutCubic'
      });
      front.setAttribute('animation__position', {
        property:'position',
        from:`0 0 ${(c.zFront || 0.215) + (c.frontStartZOffset || -0.05)}`,
        to:`0 0 ${c.zFront || 0.215}`,
        delay:c.frontDelayMs || 480, dur:c.frontFadeMs || 1500, easing:'easeOutCubic'
      });
    }
  });
})();
