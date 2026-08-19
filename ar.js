/*
  IDIS Americas | GSX 2026 WebAR coin experience
  -----------------------------------------------------------------------------
  DESIGN INTENT
  - The physical coin remains visible.
  - AR elements sit at different Z depths to create natural parallax.
  - Teal is the primary signal color. Purple is a secondary accent.
  - No 3D model files are required. The experience uses lightweight SVG art,
    A-Frame geometry, and text to keep mobile load times low.

  IMPORTANT
  The AR page requires ./assets/targets/gsx2026.mind. See README.md.
*/

const IDIS_AR = {
  teal: '#18c9c3',
  tealSoft: '#65fff1',
  purple: '#8b5cff',
  purpleSoft: '#c1a8ff',
  white: '#f4f8f9',
  dark: '#071014'
};

function setAttr(el, name, value) {
  el.setAttribute(name, value);
  return el;
}

function entity(tag = 'a-entity', attrs = {}) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => setAttr(el, key, value));
  return el;
}

AFRAME.registerComponent('float-layer', {
  schema: {
    amount: { type: 'number', default: 0.025 },
    speed: { type: 'number', default: 1 },
    phase: { type: 'number', default: 0 }
  },
  init() {
    this.base = this.el.object3D.position.clone();
  },
  tick(time) {
    const t = time * 0.001 * this.data.speed + this.data.phase;
    this.el.object3D.position.y = this.base.y + Math.sin(t) * this.data.amount;
    this.el.object3D.position.z = this.base.z + Math.cos(t * 0.82) * this.data.amount * 0.38;
  }
});

AFRAME.registerComponent('soft-spin', {
  schema: {
    speed: { type: 'number', default: 7 },
    direction: { type: 'number', default: 1 }
  },
  tick(time, delta) {
    if (!delta) return;
    this.el.object3D.rotation.z += THREE.MathUtils.degToRad(this.data.speed * this.data.direction) * (delta / 1000);
  }
});

AFRAME.registerComponent('preview-turntable', {
  tick(time) {
    this.el.object3D.rotation.y = Math.sin(time * 0.00028) * 0.15;
    this.el.object3D.rotation.x = THREE.MathUtils.degToRad(-17) + Math.sin(time * 0.00021) * 0.035;
  }
});

AFRAME.registerComponent('gsx-hologram', {
  schema: {
    preview: { type: 'boolean', default: false }
  },

  init() {
    const root = entity('a-entity', { id: `experience-root-${Math.random().toString(16).slice(2)}` });
    this.el.appendChild(root);
    this.root = root;

    if (this.data.preview) {
      const coin = entity('a-image', {
        src: '#coin-preview',
        position: '0 0 0',
        width: '1', height: '1',
        material: 'transparent: true; shader: flat; alphaTest: 0.02'
      });
      root.appendChild(coin);
    }

    this.makeScanRings(root);
    this.makeTitle(root);
    this.makeLocationArt(root);
    this.makeOrbitDots(root);
    this.makeDataTicks(root);
  },

  makeScanRings(root) {
    const ringGroup = entity('a-entity', { position: '0 0 0.028' });
    root.appendChild(ringGroup);

    [
      { r: 0.54, tube: 0.004, color: IDIS_AR.teal, opacity: 0.58, speed: 5.5, dir: 1 },
      { r: 0.61, tube: 0.0025, color: IDIS_AR.purple, opacity: 0.38, speed: 3.4, dir: -1 },
      { r: 0.69, tube: 0.002, color: IDIS_AR.tealSoft, opacity: 0.19, speed: 2.2, dir: 1 }
    ].forEach((cfg, index) => {
      const ring = entity('a-torus', {
        radius: cfg.r,
        'radius-tubular': cfg.tube,
        'segments-radial': 6,
        'segments-tubular': 96,
        material: `color: ${cfg.color}; emissive: ${cfg.color}; emissiveIntensity: 1; opacity: ${cfg.opacity}; transparent: true; shader: flat; depthWrite: false`,
        'soft-spin': `speed: ${cfg.speed}; direction: ${cfg.dir}`
      });
      ringGroup.appendChild(ring);

      for (let i = 0; i < 3; i++) {
        const tick = entity('a-box', {
          width: index === 0 ? 0.055 : 0.035,
          height: '0.006',
          depth: '0.003',
          position: `${Math.cos((i / 3) * Math.PI * 2) * cfg.r} ${Math.sin((i / 3) * Math.PI * 2) * cfg.r} 0.003`,
          rotation: `0 0 ${(i / 3) * 360 + 90}`,
          material: `color: ${cfg.color}; emissive: ${cfg.color}; opacity: ${Math.min(cfg.opacity + 0.28, 0.9)}; transparent: true; shader: flat`
        });
        ring.appendChild(tick);
      }
    });

    const glowDisc = entity('a-circle', {
      radius: '0.505',
      position: '0 0 -0.004',
      material: `color: ${IDIS_AR.teal}; opacity: 0.025; transparent: true; shader: flat; depthWrite: false`,
      animation__pulse: 'property: material.opacity; from: 0.018; to: 0.055; dur: 1800; dir: alternate; loop: true; easing: easeInOutSine'
    });
    ringGroup.appendChild(glowDisc);
  },

  makeTitle(root) {
    const title = entity('a-entity', {
      position: '0 0.77 0.19',
      'float-layer': 'amount: 0.018; speed: 0.9; phase: 0.4'
    });
    root.appendChild(title);

    const panel = entity('a-plane', {
      width: '1.22', height: '0.25',
      material: 'color: #071014; opacity: 0.80; transparent: true; shader: flat; side: double',
      position: '0 0 0'
    });
    title.appendChild(panel);

    const accent = entity('a-plane', {
      width: '0.008', height: '0.18', position: '-0.58 0 0.004',
      material: `color: ${IDIS_AR.teal}; emissive: ${IDIS_AR.teal}; shader: flat`
    });
    title.appendChild(accent);

    title.appendChild(entity('a-text', {
      value: 'GSX 2026',
      align: 'left', anchor: 'left', color: IDIS_AR.tealSoft,
      width: '1.6', position: '-0.54 0.045 0.008',
      'letter-spacing': '2',
      material: 'shader: flat'
    }));
    title.appendChild(entity('a-text', {
      value: 'ATLANTA, GEORGIA  |  SEPT 14-16',
      align: 'left', anchor: 'left', color: IDIS_AR.white,
      width: '0.90', position: '-0.54 -0.045 0.008',
      'letter-spacing': '1.2',
      material: 'shader: flat'
    }));
    title.appendChild(entity('a-text', {
      value: 'SEE SECURITY SMARTER',
      align: 'right', anchor: 'right', color: IDIS_AR.purpleSoft,
      width: '0.63', position: '0.56 -0.086 0.008',
      'letter-spacing': '1',
      material: 'shader: flat'
    }));

    const idisChip = entity('a-entity', { position: '0 -0.77 0.16', 'float-layer': 'amount: 0.015; speed: 1.15; phase: 2.1' });
    root.appendChild(idisChip);
    idisChip.appendChild(entity('a-plane', {
      width: '0.65', height: '0.17',
      material: 'color: #071014; opacity: 0.83; transparent: true; shader: flat',
    }));
    idisChip.appendChild(entity('a-text', {
      value: 'IDIS', color: IDIS_AR.white, align: 'left', anchor: 'left', width: '0.8', position: '-0.27 0.028 0.004', 'letter-spacing': '1.5'
    }));
    idisChip.appendChild(entity('a-text', {
      value: 'AMERICAS', color: IDIS_AR.teal, align: 'left', anchor: 'left', width: '0.42', position: '-0.05 0.028 0.004', 'letter-spacing': '1'
    }));
    idisChip.appendChild(entity('a-text', {
      value: 'LIMITED SPECIAL COIN', color: '#cbd4d8', align: 'center', anchor: 'center', width: '0.48', position: '0 -0.042 0.004', 'letter-spacing': '.7'
    }));
  },

  makeLocationArt(root) {
    const items = [
      { src: '#skyline-art', pos: '-0.73 0.27 0.31', w: 0.64, h: 0.43, amount: 0.03, phase: 0.1, label: 'ATLANTA' },
      { src: '#georgia-art', pos: '0.72 0.31 0.24', w: 0.42, h: 0.48, amount: 0.022, phase: 1.1, label: 'GEORGIA' },
      { src: '#stadium-art', pos: '0.73 -0.20 0.18', w: 0.53, h: 0.34, amount: 0.025, phase: 2.5, label: 'CITY ICON' },
      { src: '#phoenix-art', pos: '-0.74 -0.24 0.21', w: 0.38, h: 0.51, amount: 0.027, phase: 3.3, label: 'PHOENIX' },
      { src: '#peaches-art', pos: '0.54 -0.62 0.29', w: 0.41, h: 0.29, amount: 0.032, phase: 4.7, label: 'THE PEACH STATE' }
    ];

    items.forEach((item, idx) => {
      const group = entity('a-entity', {
        position: item.pos,
        'float-layer': `amount: ${item.amount}; speed: ${0.72 + idx * 0.08}; phase: ${item.phase}`
      });
      root.appendChild(group);

      const halo = entity('a-ring', {
        'radius-inner': `${item.w * 0.36}`,
        'radius-outer': `${item.w * 0.38}`,
        position: `0 ${-item.h * 0.37} -0.005`,
        material: `color: ${idx % 2 ? IDIS_AR.purple : IDIS_AR.teal}; opacity: 0.28; transparent: true; shader: flat; side: double`,
        'soft-spin': `speed: ${idx % 2 ? 4 : 6}; direction: ${idx % 2 ? -1 : 1}`
      });
      group.appendChild(halo);

      group.appendChild(entity('a-image', {
        src: item.src,
        width: `${item.w}`, height: `${item.h}`,
        material: 'transparent: true; shader: flat; alphaTest: 0.02; depthWrite: false'
      }));

      group.appendChild(entity('a-text', {
        value: item.label,
        color: idx % 2 ? IDIS_AR.purpleSoft : IDIS_AR.tealSoft,
        align: 'center', anchor: 'center', width: `${Math.max(0.38, item.w * 0.85)}`,
        position: `0 ${-item.h * 0.62} 0.01`,
        'letter-spacing': '1.3'
      }));
    });
  },

  makeOrbitDots(root) {
    const orbit = entity('a-entity', { position: '0 0 0.09', 'soft-spin': 'speed: 5; direction: 1' });
    root.appendChild(orbit);
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const radius = 0.625 + (i % 2) * 0.035;
      orbit.appendChild(entity('a-sphere', {
        radius: i % 3 === 0 ? '0.009' : '0.005',
        position: `${Math.cos(angle) * radius} ${Math.sin(angle) * radius} ${(i % 3) * 0.018}`,
        material: `color: ${i % 2 ? IDIS_AR.purple : IDIS_AR.tealSoft}; emissive: ${i % 2 ? IDIS_AR.purple : IDIS_AR.tealSoft}; emissiveIntensity: 1.2; opacity: ${i % 3 === 0 ? 0.9 : 0.55}; transparent: true; shader: flat`
      }));
    }
  },

  makeDataTicks(root) {
    const data = entity('a-entity', { position: '0 0 0.12' });
    root.appendChild(data);
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const r = 0.735;
      const major = i % 6 === 0;
      data.appendChild(entity('a-box', {
        width: major ? '0.042' : '0.018', height: '0.003', depth: '0.002',
        position: `${Math.cos(angle) * r} ${Math.sin(angle) * r} 0`,
        rotation: `0 0 ${THREE.MathUtils.radToDeg(angle) + 90}`,
        material: `color: ${major ? IDIS_AR.tealSoft : IDIS_AR.purple}; opacity: ${major ? 0.6 : 0.25}; transparent: true; shader: flat`
      }));
    }
  }
});

// UI and MindAR lifecycle.
document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('#ar-scene');
  if (!scene) return; // preview.html uses the scene component only.

  const target = document.querySelector('#coin-target');
  const intro = document.querySelector('#intro');
  const header = document.querySelector('#ar-header');
  const footer = document.querySelector('#ar-footer');
  const status = document.querySelector('#scan-status');
  const statusCopy = document.querySelector('#status-copy');
  const guide = document.querySelector('#scan-guide');
  const errorCard = document.querySelector('#error-card');
  const startButton = document.querySelector('#start-ar');
  const retryButton = document.querySelector('#retry-ar');
  const closeButton = document.querySelector('#close-ar');

  let arSystem = null;
  let starting = false;

  function setARUI(show) {
    [header, footer, status, guide].forEach(el => el.classList.toggle('hidden', !show));
  }

  async function startAR() {
    if (starting) return;
    starting = true;
    errorCard.classList.add('hidden');
    intro.classList.add('hidden');
    setARUI(true);
    status.classList.remove('locked');
    statusCopy.textContent = 'STARTING CAMERA';

    try {
      arSystem = scene.systems['mindar-image-system'];
      if (!arSystem) throw new Error('MindAR system is not ready.');
      await arSystem.start();
      statusCopy.textContent = 'LOOK FOR THE COIN';
    } catch (error) {
      console.error(error);
      errorCard.classList.remove('hidden');
      statusCopy.textContent = 'CAMERA ERROR';
    } finally {
      starting = false;
    }
  }

  function stopAR() {
    try { if (arSystem) arSystem.stop(); } catch (error) { console.warn(error); }
    setARUI(false);
    errorCard.classList.add('hidden');
    intro.classList.remove('hidden');
  }

  scene.addEventListener('loaded', () => {
    arSystem = scene.systems['mindar-image-system'];
  });

  scene.addEventListener('arReady', () => {
    statusCopy.textContent = 'LOOK FOR THE COIN';
  });

  scene.addEventListener('arError', () => {
    errorCard.classList.remove('hidden');
    statusCopy.textContent = 'CAMERA ERROR';
  });

  target.addEventListener('targetFound', () => {
    status.classList.add('locked');
    statusCopy.textContent = 'COIN LOCKED';
    guide.classList.add('hidden');

    const experienceRoot = target.querySelector('[id^="experience-root-"]');
    if (experienceRoot) {
      experienceRoot.removeAttribute('animation__reveal');
      experienceRoot.setAttribute('scale', '0.82 0.82 0.82');
      experienceRoot.setAttribute('animation__reveal', 'property: scale; to: 1 1 1; dur: 650; easing: easeOutBack');
    }
  });

  target.addEventListener('targetLost', () => {
    status.classList.remove('locked');
    statusCopy.textContent = 'REACQUIRE COIN';
    guide.classList.remove('hidden');
  });

  startButton.addEventListener('click', startAR);
  retryButton.addEventListener('click', startAR);
  closeButton.addEventListener('click', stopAR);
});
