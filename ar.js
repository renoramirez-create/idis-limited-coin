/*
  IDIS Americas | GSX 2026 two-sided WebAR coin experience
  ---------------------------------------------------------------------------
  targetIndex 0 = GSX 2026 / Atlanta, Georgia side
  targetIndex 1 = IDIS Americas side

  The live camera feed is created by MindAR. The lifecycle code below adds
  defensive styling and cleanup so the camera stays visible behind A-Frame and
  the HTML close button remains usable while the AR engine is running.
*/

const IDIS_AR = Object.freeze({
  teal: '#18c9c3',
  tealSoft: '#65fff1',
  purple: '#8b5cff',
  purpleSoft: '#c1a8ff',
  white: '#f4f8f9',
  silver: '#bdc9ce',
  dark: '#071014'
});

const TARGET_FILE = './assets/targets/gsx2026-two-sided.mind';

function setAttr(el, name, value) {
  el.setAttribute(name, value);
  return el;
}

function entity(tag = 'a-entity', attrs = {}) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => setAttr(el, key, value));
  return el;
}

function addText(parent, value, position, width, color, options = {}) {
  const text = entity('a-text', {
    value,
    position,
    width: `${width}`,
    color,
    align: options.align || 'center',
    anchor: options.anchor || 'center',
    'letter-spacing': options.letterSpacing || '1.1',
    material: 'shader: flat; transparent: true'
  });
  parent.appendChild(text);
  return text;
}

function makeRing(parent, cfg) {
  const ring = entity('a-torus', {
    radius: cfg.radius,
    'radius-tubular': cfg.tube,
    'segments-radial': 6,
    'segments-tubular': 96,
    material: `color: ${cfg.color}; emissive: ${cfg.color}; emissiveIntensity: 1; opacity: ${cfg.opacity}; transparent: true; shader: flat; depthWrite: false`,
    'soft-spin': `speed: ${cfg.speed}; direction: ${cfg.direction}`
  });
  parent.appendChild(ring);
  return ring;
}

function addRevealPulse(root) {
  root.setAttribute('scale', '1 1 1');
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

AFRAME.registerComponent('scan-beam', {
  schema: {
    range: { type: 'number', default: 0.9 },
    speed: { type: 'number', default: 0.75 }
  },
  init() {
    this.baseY = this.el.object3D.position.y;
  },
  tick(time) {
    const normalized = (Math.sin(time * 0.001 * this.data.speed) + 1) / 2;
    this.el.object3D.position.y = this.baseY - this.data.range / 2 + normalized * this.data.range;
  }
});

AFRAME.registerComponent('preview-turntable', {
  tick(time) {
    this.el.object3D.rotation.y = Math.sin(time * 0.00028) * 0.15;
    this.el.object3D.rotation.x = THREE.MathUtils.degToRad(-17) + Math.sin(time * 0.00021) * 0.035;
  }
});

/* --------------------------------------------------------------------------
   ATLANTA / GEORGIA SIDE
*/
AFRAME.registerComponent('gsx-hologram', {
  schema: { preview: { type: 'boolean', default: false } },

  init() {
    const root = entity('a-entity', { class: 'experience-root atlanta-experience' });
    this.el.appendChild(root);
    this.root = root;

    if (this.data.preview && document.querySelector('#coin-preview')) {
      root.appendChild(entity('a-image', {
        src: '#coin-preview', position: '0 0 0', width: '1', height: '1',
        material: 'transparent: true; shader: flat; alphaTest: 0.02'
      }));
    }

    this.makeScanRings(root);
    this.makeTitle(root);
    this.makeLocationArt(root);
    this.makeOrbitDots(root);
    this.makeDataTicks(root);
    addRevealPulse(root);
  },

  makeScanRings(root) {
    const ringGroup = entity('a-entity', { position: '0 0 0.028' });
    root.appendChild(ringGroup);

    [
      { radius: 0.54, tube: 0.004, color: IDIS_AR.teal, opacity: 0.58, speed: 5.5, direction: 1 },
      { radius: 0.61, tube: 0.0025, color: IDIS_AR.purple, opacity: 0.38, speed: 3.4, direction: -1 },
      { radius: 0.69, tube: 0.002, color: IDIS_AR.tealSoft, opacity: 0.20, speed: 2.2, direction: 1 }
    ].forEach((cfg, index) => {
      const ring = makeRing(ringGroup, cfg);
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        ring.appendChild(entity('a-box', {
          width: index === 0 ? 0.055 : 0.035,
          height: '0.006', depth: '0.003',
          position: `${Math.cos(angle) * cfg.radius} ${Math.sin(angle) * cfg.radius} 0.003`,
          rotation: `0 0 ${(i / 3) * 360 + 90}`,
          material: `color: ${cfg.color}; emissive: ${cfg.color}; opacity: ${Math.min(cfg.opacity + 0.28, 0.9)}; transparent: true; shader: flat`
        }));
      }
    });

    ringGroup.appendChild(entity('a-circle', {
      radius: '0.505', position: '0 0 -0.004',
      material: `color: ${IDIS_AR.teal}; opacity: 0.025; transparent: true; shader: flat; depthWrite: false`,
      animation__pulse: 'property: material.opacity; from: 0.018; to: 0.055; dur: 1800; dir: alternate; loop: true; easing: easeInOutSine'
    }));
  },

  makeTitle(root) {
    const title = entity('a-entity', {
      position: '0 0.77 0.19',
      'float-layer': 'amount: 0.018; speed: 0.9; phase: 0.4'
    });
    root.appendChild(title);

    title.appendChild(entity('a-plane', {
      width: '1.22', height: '0.25',
      material: 'color: #071014; opacity: 0.82; transparent: true; shader: flat; side: double'
    }));
    title.appendChild(entity('a-plane', {
      width: '0.008', height: '0.18', position: '-0.58 0 0.004',
      material: `color: ${IDIS_AR.teal}; emissive: ${IDIS_AR.teal}; shader: flat`
    }));

    addText(title, 'GSX 2026', '-0.54 0.047 0.008', 1.6, IDIS_AR.tealSoft, { align: 'left', anchor: 'left', letterSpacing: '2' });
    addText(title, 'ATLANTA, GEORGIA  |  SEPT 14-16', '-0.54 -0.044 0.008', 0.90, IDIS_AR.white, { align: 'left', anchor: 'left' });
    addText(title, 'SEE SECURITY SMARTER', '0.56 -0.087 0.008', 0.63, IDIS_AR.purpleSoft, { align: 'right', anchor: 'right' });

    const chip = entity('a-entity', { position: '0 -0.77 0.16', 'float-layer': 'amount: 0.015; speed: 1.15; phase: 2.1' });
    root.appendChild(chip);
    chip.appendChild(entity('a-plane', {
      width: '0.67', height: '0.17',
      material: 'color: #071014; opacity: 0.84; transparent: true; shader: flat'
    }));
    addText(chip, 'IDIS', '-0.27 0.028 0.004', 0.80, IDIS_AR.white, { align: 'left', anchor: 'left', letterSpacing: '1.5' });
    addText(chip, 'AMERICAS', '-0.05 0.028 0.004', 0.42, IDIS_AR.teal, { align: 'left', anchor: 'left' });
    addText(chip, 'LIMITED GSX 2026 COIN', '0 -0.043 0.004', 0.48, '#cbd4d8', { letterSpacing: '.7' });
  },

  makeLocationArt(root) {
    const items = [
      { src: '#skyline-art', pos: '-0.73 0.27 0.31', w: 0.64, h: 0.43, amount: 0.030, phase: 0.1, label: 'ATLANTA' },
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

      group.appendChild(entity('a-ring', {
        'radius-inner': `${item.w * 0.36}`,
        'radius-outer': `${item.w * 0.38}`,
        position: `0 ${-item.h * 0.37} -0.005`,
        material: `color: ${idx % 2 ? IDIS_AR.purple : IDIS_AR.teal}; opacity: 0.28; transparent: true; shader: flat; side: double`,
        'soft-spin': `speed: ${idx % 2 ? 4 : 6}; direction: ${idx % 2 ? -1 : 1}`
      }));

      group.appendChild(entity('a-image', {
        src: item.src, width: `${item.w}`, height: `${item.h}`,
        material: 'transparent: true; shader: flat; alphaTest: 0.02; depthWrite: false'
      }));

      addText(group, item.label, `0 ${-item.h * 0.62} 0.01`, Math.max(0.38, item.w * 0.85), idx % 2 ? IDIS_AR.purpleSoft : IDIS_AR.tealSoft);
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
      const radius = 0.735;
      const major = i % 6 === 0;
      data.appendChild(entity('a-box', {
        width: major ? '0.042' : '0.018', height: '0.003', depth: '0.002',
        position: `${Math.cos(angle) * radius} ${Math.sin(angle) * radius} 0`,
        rotation: `0 0 ${THREE.MathUtils.radToDeg(angle) + 90}`,
        material: `color: ${major ? IDIS_AR.tealSoft : IDIS_AR.purple}; opacity: ${major ? 0.6 : 0.25}; transparent: true; shader: flat`
      }));
    }
  }
});

/* --------------------------------------------------------------------------
   IDIS AMERICAS SIDE
*/
AFRAME.registerComponent('idis-hologram', {
  schema: { preview: { type: 'boolean', default: false } },

  init() {
    const root = entity('a-entity', { class: 'experience-root idis-experience' });
    this.el.appendChild(root);
    this.root = root;

    if (this.data.preview && document.querySelector('#coin-front-preview')) {
      root.appendChild(entity('a-image', {
        src: '#coin-front-preview', position: '0 0 0', width: '1', height: '1',
        material: 'transparent: true; shader: flat; alphaTest: 0.02'
      }));
    }

    this.makeRings(root);
    this.makeBrandHeader(root);
    this.makeSecurityNodes(root);
    this.makeCenterScan(root);
    this.makeFooter(root);
    addRevealPulse(root);
  },

  makeRings(root) {
    const rings = entity('a-entity', { position: '0 0 0.04' });
    root.appendChild(rings);
    [
      { radius: 0.54, tube: 0.0042, color: IDIS_AR.teal, opacity: 0.62, speed: 6.5, direction: 1 },
      { radius: 0.62, tube: 0.0024, color: IDIS_AR.purple, opacity: 0.38, speed: 4.2, direction: -1 },
      { radius: 0.71, tube: 0.0018, color: IDIS_AR.tealSoft, opacity: 0.17, speed: 2.3, direction: 1 }
    ].forEach(cfg => makeRing(rings, cfg));

    const segmented = entity('a-entity', { 'soft-spin': 'speed: 8; direction: -1' });
    rings.appendChild(segmented);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 0.665;
      segmented.appendChild(entity('a-box', {
        width: i % 4 === 0 ? '0.055' : '0.024', height: '0.005', depth: '0.003',
        position: `${Math.cos(angle) * radius} ${Math.sin(angle) * radius} 0.01`,
        rotation: `0 0 ${THREE.MathUtils.radToDeg(angle) + 90}`,
        material: `color: ${i % 2 ? IDIS_AR.purpleSoft : IDIS_AR.tealSoft}; emissive: ${i % 2 ? IDIS_AR.purple : IDIS_AR.teal}; opacity: ${i % 4 === 0 ? 0.72 : 0.32}; transparent: true; shader: flat`
      }));
    }
  },

  makeBrandHeader(root) {
    const header = entity('a-entity', {
      position: '0 0.78 0.22',
      'float-layer': 'amount: 0.018; speed: 0.82; phase: 0.2'
    });
    root.appendChild(header);

    header.appendChild(entity('a-plane', {
      width: '1.18', height: '0.26',
      material: 'color: #061015; opacity: 0.84; transparent: true; shader: flat'
    }));
    header.appendChild(entity('a-plane', {
      width: '0.42', height: '0.008', position: '-0.34 0.107 0.006',
      material: `color: ${IDIS_AR.teal}; emissive: ${IDIS_AR.teal}; shader: flat`
    }));
    addText(header, 'IDIS AMERICAS', '-0.52 0.042 0.01', 1.22, IDIS_AR.white, { align: 'left', anchor: 'left', letterSpacing: '1.8' });
    addText(header, 'SEE SECURITY SMARTER', '-0.52 -0.052 0.01', 0.82, IDIS_AR.tealSoft, { align: 'left', anchor: 'left', letterSpacing: '1.2' });
    addText(header, 'GSX 2026', '0.52 -0.052 0.01', 0.47, IDIS_AR.purpleSoft, { align: 'right', anchor: 'right', letterSpacing: '1.4' });
  },

  makeSecurityNodes(root) {
    const labels = [
      { text: 'AI', angle: 145, z: 0.29 },
      { text: 'VIDEO', angle: 96, z: 0.23 },
      { text: 'VMS', angle: 38, z: 0.27 },
      { text: 'SECURE', angle: -28, z: 0.20 },
      { text: 'DATA', angle: -96, z: 0.31 },
      { text: 'CLOUD', angle: -150, z: 0.24 }
    ];

    labels.forEach((item, index) => {
      const rad = THREE.MathUtils.degToRad(item.angle);
      const radius = 0.77;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      const node = entity('a-entity', {
        position: `${x} ${y} ${item.z}`,
        'float-layer': `amount: ${0.015 + (index % 3) * 0.006}; speed: ${0.72 + index * 0.07}; phase: ${index * 0.65}`
      });
      root.appendChild(node);

      const primary = index % 2 === 0 ? IDIS_AR.teal : IDIS_AR.purple;
      const secondary = index % 2 === 0 ? IDIS_AR.tealSoft : IDIS_AR.purpleSoft;
      node.appendChild(entity('a-circle', {
        radius: '0.105',
        material: `color: #071014; opacity: 0.82; transparent: true; shader: flat; side: double`
      }));
      node.appendChild(entity('a-ring', {
        'radius-inner': '0.108', 'radius-outer': '0.116', position: '0 0 0.003',
        material: `color: ${primary}; emissive: ${primary}; opacity: 0.75; transparent: true; shader: flat; side: double`,
        'soft-spin': `speed: ${index % 2 ? 10 : 7}; direction: ${index % 2 ? -1 : 1}`
      }));
      addText(node, item.text, '0 0 0.009', item.text.length > 4 ? 0.27 : 0.34, secondary, { letterSpacing: '1' });

      const stemLength = 0.16;
      node.appendChild(entity('a-box', {
        width: `${stemLength}`, height: '0.0025', depth: '0.001',
        position: `${-Math.sign(x || 1) * 0.15} ${-Math.sign(y || 1) * 0.02} -0.01`,
        rotation: `0 0 ${item.angle + 180}`,
        material: `color: ${primary}; opacity: 0.28; transparent: true; shader: flat`
      }));
    });
  },

  makeCenterScan(root) {
    const scan = entity('a-entity', { position: '0 0 0.32' });
    root.appendChild(scan);

    scan.appendChild(entity('a-ring', {
      'radius-inner': '0.34', 'radius-outer': '0.345',
      material: `color: ${IDIS_AR.tealSoft}; opacity: 0.20; transparent: true; shader: flat; side: double`
    }));
    scan.appendChild(entity('a-ring', {
      'radius-inner': '0.25', 'radius-outer': '0.253',
      material: `color: ${IDIS_AR.purpleSoft}; opacity: 0.18; transparent: true; shader: flat; side: double`,
      'soft-spin': 'speed: 5; direction: -1'
    }));

    const beam = entity('a-plane', {
      width: '0.64', height: '0.008', position: '0 0 0.018',
      material: `color: ${IDIS_AR.tealSoft}; emissive: ${IDIS_AR.teal}; opacity: 0.78; transparent: true; shader: flat; depthWrite: false`,
      'scan-beam': 'range: 0.64; speed: 0.85'
    });
    scan.appendChild(beam);

    const mark = entity('a-entity', { position: '0 0 0.07', 'float-layer': 'amount: 0.012; speed: 1.0; phase: 1.2' });
    root.appendChild(mark);
    mark.appendChild(entity('a-plane', {
      width: '0.34', height: '0.14',
      material: 'color: #061015; opacity: 0.68; transparent: true; shader: flat'
    }));
    addText(mark, 'IDIS', '-0.13 0.012 0.006', 0.78, IDIS_AR.white, { align: 'left', anchor: 'left', letterSpacing: '2' });
    addText(mark, 'AMERICAS', '0.005 0.012 0.006', 0.33, IDIS_AR.tealSoft, { align: 'left', anchor: 'left', letterSpacing: '1' });
    addText(mark, 'ONE SOLUTION', '0 -0.044 0.006', 0.31, IDIS_AR.silver, { letterSpacing: '.9' });
  },

  makeFooter(root) {
    const footer = entity('a-entity', {
      position: '0 -0.79 0.19',
      'float-layer': 'amount: 0.016; speed: 0.95; phase: 2.8'
    });
    root.appendChild(footer);
    footer.appendChild(entity('a-plane', {
      width: '0.92', height: '0.16',
      material: 'color: #071014; opacity: 0.84; transparent: true; shader: flat'
    }));
    addText(footer, 'ONE SOLUTION  •  ONE COMPANY', '0 0.027 0.006', 0.80, IDIS_AR.white, { letterSpacing: '1.4' });
    addText(footer, 'LIMITED IDIS AMERICAS GSX 2026 COIN', '0 -0.037 0.006', 0.50, IDIS_AR.purpleSoft, { letterSpacing: '.75' });
  }
});

/* --------------------------------------------------------------------------
   UI + MINDAR LIFECYCLE
*/
/* --------------------------------------------------------------------------
   UI + MINDAR LIFECYCLE
   Atlanta uses a SCREEN-SPACE overlay so all 1920x1920 layers remain upright.
---------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('#ar-scene');
  const arContainer = document.querySelector('#ar-container');
  if (!scene) return;

  const atlantaTarget = document.querySelector('#atlanta-target');
  const idisTarget = document.querySelector('#idis-target');

  const intro = document.querySelector('#intro');
  const header = document.querySelector('#ar-header');
  const footer = document.querySelector('#ar-footer');
  const status = document.querySelector('#scan-status');
  const statusCopy = document.querySelector('#status-copy');
  const guide = document.querySelector('#scan-guide');
  const sideChip = document.querySelector('#side-chip');

  const errorCard = document.querySelector('#error-card');
  const errorTitle = document.querySelector('#error-title');
  const errorCopy = document.querySelector('#error-copy');

  const startButton = document.querySelector('#start-ar');
  const retryButton = document.querySelector('#retry-ar');
  const closeButton = document.querySelector('#close-ar');
  const errorClose = document.querySelector('#error-close');

  const overlay = document.querySelector('#atlanta-parallax');
  const layerBack = document.querySelector('#atlanta-layer-back');
  const layerMiddle = document.querySelector('#atlanta-layer-middle');
  const layerFront = document.querySelector('#atlanta-layer-front');

  const TARGET_FILE = './assets/targets/gsx2026-two-sided.mind';

  let arSystem = null;
  let starting = false;
  let active = false;
  let sessionToken = 0;
  let cameraObserver = null;
  let currentSide = null;
  let lossTimer = null;
  let overlayRAF = 0;
  let backVideoStartTimer = null;

  // Smoothed screen anchor and offsets.
  let sx = 0, sy = 0;
  let smx = 0, smy = 0;
  let sfx = 0, sfy = 0;
  let initializedOverlay = false;
  let frontRevealStart = 0;

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

  function clearBackVideoTimer() {
    if (backVideoStartTimer) {
      clearTimeout(backVideoStartTimer);
      backVideoStartTimer = null;
    }
  }

  function prepareBackVideo() {
    if (!layerBack || layerBack.tagName !== 'VIDEO') return;
    layerBack.muted = true;
    layerBack.defaultMuted = true;
    layerBack.playsInline = true;
    layerBack.setAttribute('playsinline', '');
    layerBack.setAttribute('webkit-playsinline', '');
  }

  function startBackVideo() {
    if (!layerBack || layerBack.tagName !== 'VIDEO') return;
    prepareBackVideo();

    try {
      // Restart the background motion each time the Atlanta side is acquired.
      if (Number.isFinite(layerBack.duration) && layerBack.duration > 0) {
        layerBack.currentTime = 0;
      } else {
        layerBack.currentTime = 0;
      }
    } catch (_) {}

    const playPromise = layerBack.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(error => {
        console.warn('Atlanta background video could not autoplay yet:', error);
      });
    }
  }

  function stopBackVideo(reset = true) {
    if (!layerBack || layerBack.tagName !== 'VIDEO') return;
    try { layerBack.pause(); } catch (_) {}
    if (reset) {
      try { layerBack.currentTime = 0; } catch (_) {}
    }
  }

  function setARUI(show) {
    [header, footer].forEach(el => el && el.classList.toggle('hidden', !show));
    if (!show) {
      status.classList.add('hidden');
      guide.classList.add('hidden');
      sideChip.classList.add('hidden');
    }
  }

  function showScanUI(text = 'LOOK FOR THE COIN') {
    if (!active && !starting) return;
    status.classList.remove('hidden', 'error', 'locked');
    guide.classList.remove('hidden');
    sideChip.classList.add('hidden');
    statusCopy.textContent = text;
  }

  function hideScanUI() {
    status.classList.add('hidden');
    guide.classList.add('hidden');
    sideChip.classList.add('hidden');
  }

  function hideAtlantaOverlay() {
    cancelAnimationFrame(overlayRAF);
    overlayRAF = 0;
    initializedOverlay = false;
    frontRevealStart = 0;

    clearBackVideoTimer();
    stopBackVideo(true);

    overlay.classList.remove('is-visible');
    overlay.classList.add('hidden');

    [layerBack, layerMiddle, layerFront].forEach(layer => {
      layer.style.opacity = '0';
      layer.style.transform = 'translate3d(-9999px,-9999px,0)';
      layer.style.animation = 'none';
    });

    // Force CSS animation reset for the next detection.
    void overlay.offsetWidth;
    [layerBack, layerMiddle, layerFront].forEach(layer => layer.style.animation = '');
  }

  function showAtlantaOverlay() {
    hideAtlantaOverlay();

    overlay.classList.remove('hidden');
    overlay.classList.add('is-visible');
    frontRevealStart = performance.now();

    // Reveal sequence:
    // 0.0s  front/top PNG
    // 1.0s  middle PNG
    // 3.0s  background video begins and fades in
    backVideoStartTimer = setTimeout(() => {
      backVideoStartTimer = null;
      if (active && currentSide === 'atlanta' && !overlay.classList.contains('hidden')) {
        startBackVideo();
      }
    }, 3000);

    updateAtlantaOverlay(true);
  }

  function showError(title, copy, statusText = 'AR ERROR') {
    errorTitle.textContent = title;
    errorCopy.textContent = copy;
    errorCard.classList.remove('hidden');
    status.classList.remove('hidden');
    status.classList.add('error');
    statusCopy.textContent = statusText;
  }

  function hideError() {
    errorCard.classList.add('hidden');
    status.classList.remove('error');
  }

  function forceTransparentRenderer() {
    if (!scene || !scene.renderer) return;
    try {
      scene.renderer.setClearColor(0x000000, 0);
      scene.renderer.setClearAlpha(0);
      if (scene.renderer.domElement) {
        scene.renderer.domElement.style.background = 'transparent';
        scene.renderer.domElement.style.backgroundColor = 'transparent';
      }
    } catch (error) {
      console.warn('Renderer transparency warning:', error);
    }
  }

  function styleCameraVideos() {
    const videos = arContainer ? [...arContainer.querySelectorAll('video')] : [...document.querySelectorAll('video')];
    videos.forEach(video => {
      if (!video.srcObject && video.closest('a-assets')) return;
      video.classList.add('mindar-camera-feed');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.muted = true;
      video.style.zIndex = '1';
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      video.style.display = 'block';
      video.style.pointerEvents = 'none';
    });

    const canvas = scene.querySelector('.a-canvas') || document.querySelector('.a-canvas');
    if (canvas) {
      canvas.style.zIndex = '2';
      canvas.style.background = 'transparent';
      canvas.style.backgroundColor = 'transparent';
      canvas.style.pointerEvents = 'none';
    }
    forceTransparentRenderer();
  }

  async function waitForLiveCamera(maxMs = 12000) {
    const started = performance.now();
    while (performance.now() - started < maxMs) {
      const video = (arSystem && arSystem.video) || (arContainer && arContainer.querySelector('video'));
      if (video && video.srcObject && video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
        try { await video.play(); } catch (_) {}
        styleCameraVideos();
        return video;
      }
      await wait(100);
    }
    throw Object.assign(new Error('CAMERA_FRAME_TIMEOUT'), { code: 'CAMERA_FRAME_TIMEOUT' });
  }

  function watchForCameraVideo() {
    if (cameraObserver) cameraObserver.disconnect();
    cameraObserver = new MutationObserver(styleCameraVideos);
    cameraObserver.observe(arContainer || document.body, { childList: true, subtree: true });
    styleCameraVideos();
  }

  function stopWatchingCamera() {
    if (cameraObserver) cameraObserver.disconnect();
    cameraObserver = null;
  }

  function stopAllCameraTracks() {
    const videos = arContainer ? arContainer.querySelectorAll('video') : document.querySelectorAll('video');
    videos.forEach(video => {
      if (!video.srcObject) return;
      try {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.pause();
        video.srcObject = null;
      } catch (_) {}
    });
  }

  async function waitForSceneSystem(maxMs = 8000) {
    const started = performance.now();
    while (performance.now() - started < maxMs) {
      const system = scene.systems && scene.systems['mindar-image-system'];
      if (system) return system;
      await wait(80);
    }
    throw new Error('MindAR image system did not initialize in time.');
  }

  async function verifyTargetFile() {
    try {
      const response = await fetch(`${TARGET_FILE}?v=20260821`, { cache: 'no-store' });
      if (!response.ok) return false;
      const buffer = await response.arrayBuffer();
      return buffer.byteLength > 128;
    } catch (_) {
      return false;
    }
  }

  function projectTargetToScreen() {
    const camera = scene.camera;
    const canvas = scene.canvas;
    if (!camera || !canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const world = new THREE.Vector3();
    atlantaTarget.object3D.getWorldPosition(world);

    const projected = world.clone().project(camera);
    if (!Number.isFinite(projected.x) || !Number.isFinite(projected.y)) return null;

    return {
      x: rect.left + (projected.x + 1) * 0.5 * rect.width,
      y: rect.top + (1 - (projected.y + 1) * 0.5) * rect.height,
      rect,
      camera
    };
  }

  function getTiltInputs(camera) {
    const targetQuat = new THREE.Quaternion();
    const cameraQuat = new THREE.Quaternion();
    const invCamera = new THREE.Quaternion();
    const normal = new THREE.Vector3(0, 0, 1);

    atlantaTarget.object3D.getWorldQuaternion(targetQuat);
    camera.getWorldQuaternion(cameraQuat);
    invCamera.copy(cameraQuat).invert();

    normal.applyQuaternion(targetQuat).applyQuaternion(invCamera).normalize();

    return {
      x: clamp(normal.x, -0.8, 0.8),
      y: clamp(normal.y, -0.8, 0.8)
    };
  }

  function updateAtlantaOverlay(force = false) {
    if (!active || currentSide !== 'atlanta' || overlay.classList.contains('hidden')) return;

    const projected = projectTargetToScreen();
    if (!projected) {
      overlayRAF = requestAnimationFrame(() => updateAtlantaOverlay(false));
      return;
    }

    const { x, y, rect, camera } = projected;
    const tilt = getTiltInputs(camera);

    // Square size is based on the long screen dimension so the back layer fills
    // most of the phone display, like the preview.
    const longSide = Math.max(window.innerWidth, window.innerHeight);
    const baseSize = longSide * 0.92;
    const backSize = baseSize * 1.12;

    const nx = clamp((x - rect.left - rect.width / 2) / Math.max(1, rect.width / 2), -1, 1);
    const ny = clamp((y - rect.top - rect.height / 2) / Math.max(1, rect.height / 2), -1, 1);

    // Middle is about 40 design pixels above the back.
    const middleYOffset = -(40 / 1920) * baseSize;

    const middleTargetX = (-tilt.x * baseSize * 0.040) - (nx * baseSize * 0.018);
    const middleTargetY = middleYOffset + (tilt.y * baseSize * 0.030) + (ny * baseSize * 0.012);

    const frontTargetX = (-tilt.x * baseSize * 0.105) - (nx * baseSize * 0.045);
    const frontTargetY = (tilt.y * baseSize * 0.072) + (ny * baseSize * 0.032);

    if (!initializedOverlay || force) {
      sx = x; sy = y;
      smx = middleTargetX; smy = middleTargetY;
      sfx = frontTargetX; sfy = frontTargetY;
      initializedOverlay = true;
    } else {
      // Strong smoothing keeps the layout calm.
      sx = lerp(sx, x, 0.13);
      sy = lerp(sy, y, 0.13);
      smx = lerp(smx, middleTargetX, 0.10);
      smy = lerp(smy, middleTargetY, 0.10);
      sfx = lerp(sfx, frontTargetX, 0.11);
      sfy = lerp(sfy, frontTargetY, 0.11);
    }

    // Back: large, calm, centered on the tracked coin.
    layerBack.style.width = `${backSize}px`;
    layerBack.style.height = `${backSize}px`;
    layerBack.style.transform =
      `translate3d(${sx - backSize/2}px, ${sy - backSize/2}px, 0)`;

    // Middle: same square coordinate system, subtle parallax and +40px design lift.
    layerMiddle.style.width = `${baseSize}px`;
    layerMiddle.style.height = `${baseSize}px`;
    layerMiddle.style.transform =
      `translate3d(${sx + smx - baseSize/2}px, ${sy + smy - baseSize/2}px, 0)`;

    // Front: strongest parallax and dramatic scale-in.
    const elapsed = frontRevealStart ? performance.now() - frontRevealStart : 1200;
    const revealT = easeOutCubic(elapsed / 900);
    const frontScale = lerp(0.82, 1.0, revealT);

    layerFront.style.width = `${baseSize}px`;
    layerFront.style.height = `${baseSize}px`;
    layerFront.style.transform =
      `translate3d(${sx + sfx - baseSize/2}px, ${sy + sfy - baseSize/2}px, 0) scale(${frontScale})`;

    overlayRAF = requestAnimationFrame(() => updateAtlantaOverlay(false));
  }

  function hideIDISExperience() {
    const root = idisTarget.querySelector('.experience-root');
    if (root) root.setAttribute('visible', 'false');
  }

  function showIDISExperience() {
    const root = idisTarget.querySelector('.experience-root');
    if (root) {
      root.setAttribute('visible', 'true');
      root.removeAttribute('animation__reveal');
      root.setAttribute('scale', '0.86 0.86 0.86');
      root.setAttribute('animation__reveal',
        'property: scale; to: 1 1 1; dur: 760; easing: easeOutCubic');
    }
  }

  function resetDetectedState() {
    if (lossTimer) clearTimeout(lossTimer);
    lossTimer = null;
    currentSide = null;
    hideAtlantaOverlay();
    hideIDISExperience();
  }

  function foundAtlanta() {
    if (!active) return;
    if (lossTimer) clearTimeout(lossTimer);
    lossTimer = null;
    if (currentSide === 'atlanta') return;

    currentSide = 'atlanta';
    hideIDISExperience();
    hideScanUI();
    showAtlantaOverlay();
  }

  function foundIDIS() {
    if (!active) return;
    if (lossTimer) clearTimeout(lossTimer);
    lossTimer = null;
    if (currentSide === 'idis') return;

    currentSide = 'idis';
    hideAtlantaOverlay();
    hideScanUI();
    showIDISExperience();
  }

  function lostSide(side) {
    if (!active || currentSide !== side) return;
    if (lossTimer) clearTimeout(lossTimer);

    // Brief hold prevents one weak reflective frame from causing a blink.
    lossTimer = setTimeout(() => {
      if (currentSide !== side) return;
      resetDetectedState();
      showScanUI('LOOK FOR THE COIN');
    }, 420);
  }

  async function startAR() {
    if (starting || active) return;

    // Prime the muted inline MP4 during the user's tap. It remains paused
    // until the Atlanta target is actually detected.
    prepareBackVideo();
    if (layerBack && layerBack.tagName === 'VIDEO') {
      try {
        const priming = layerBack.play();
        if (priming && typeof priming.then === 'function') {
          priming.then(() => {
            layerBack.pause();
            try { layerBack.currentTime = 0; } catch (_) {}
          }).catch(() => {});
        }
      } catch (_) {}
    }

    starting = true;
    const myToken = ++sessionToken;
    hideError();
    resetDetectedState();

    try {
      const targetReady = await verifyTargetFile();
      if (!targetReady) {
        showError('Tracking file is missing.',
          'Keep gsx2026-two-sided.mind inside assets/targets/.',
          'TARGET FILE MISSING');
        return;
      }

      intro.classList.add('hidden');
      setARUI(true);
      showScanUI('STARTING CAMERA');
      watchForCameraVideo();

      arSystem = await waitForSceneSystem();
      if (myToken !== sessionToken) return;

      await Promise.resolve(arSystem.start());
      await waitForLiveCamera();

      if (myToken !== sessionToken) return;

      active = true;
      styleCameraVideos();
      showScanUI('LOOK FOR THE COIN');
    } catch (error) {
      console.error(error);
      showError('Camera could not start.',
        'Allow camera permission, close other camera apps, then try again.',
        'CAMERA ERROR');
    } finally {
      starting = false;
    }
  }

  async function stopAR(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    ++sessionToken;
    active = false;
    starting = false;
    resetDetectedState();
    hideError();
    stopWatchingCamera();

    try {
      if (!arSystem && scene.systems) arSystem = scene.systems['mindar-image-system'];
      if (arSystem) await Promise.resolve(arSystem.stop());
    } catch (_) {}

    stopAllCameraTracks();

    status.classList.remove('locked', 'error');
    status.classList.add('hidden');
    guide.classList.add('hidden');
    sideChip.classList.add('hidden');
    setARUI(false);
    intro.classList.remove('hidden');
  }

  scene.addEventListener('loaded', () => {
    arSystem = scene.systems['mindar-image-system'];
    forceTransparentRenderer();
    hideIDISExperience();
    hideAtlantaOverlay();
  });

  scene.addEventListener('renderstart', () => {
    forceTransparentRenderer();
    styleCameraVideos();
  });

  scene.addEventListener('arReady', () => {
    if (active && !currentSide) showScanUI('LOOK FOR THE COIN');
  });

  atlantaTarget.addEventListener('targetFound', foundAtlanta);
  atlantaTarget.addEventListener('targetLost', () => lostSide('atlanta'));

  idisTarget.addEventListener('targetFound', foundIDIS);
  idisTarget.addEventListener('targetLost', () => lostSide('idis'));

  startButton.addEventListener('click', startAR);
  retryButton.addEventListener('click', startAR);

  // Use both events. stopAR is idempotent.
  closeButton.addEventListener('pointerup', stopAR, { passive: false });
  closeButton.addEventListener('touchend', stopAR, { passive: false });
  closeButton.addEventListener('click', stopAR);

  errorClose.addEventListener('click', hideError);

  window.addEventListener('pagehide', () => {
    ++sessionToken;
    active = false;
    resetDetectedState();
    try { if (arSystem) arSystem.stop(); } catch (_) {}
    stopAllCameraTracks();
  });
});
