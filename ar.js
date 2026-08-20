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
    const root = entity('a-entity', { class: 'experience-root atlanta-experience', visible: 'false' });
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

    const chip = entity('a-entity', { position: '0 -0.77 0.16', 'float-layer': 'amount: 0.015; speed: 1.15; phase: 2.1' });
    root.appendChild(chip);
    chip.appendChild(entity('a-plane', {
      width: '0.72', height: '0.14',
      material: 'color: #071014; opacity: 0.84; transparent: true; shader: flat'
    }));
    addText(chip, 'LIMITED IDIS 2026 COIN', '0 0 0.004', 0.58, '#cbd4d8', { letterSpacing: '.95' });
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
    const root = entity('a-entity', { class: 'experience-root idis-experience', visible: 'false' });
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
  const sideChipKicker = document.querySelector('#side-chip-kicker');
  const sideChipCopy = document.querySelector('#side-chip-copy');
  const errorCard = document.querySelector('#error-card');
  const errorTitle = document.querySelector('#error-title');
  const errorCopy = document.querySelector('#error-copy');
  const startButton = document.querySelector('#start-ar');
  const retryButton = document.querySelector('#retry-ar');
  const closeButton = document.querySelector('#close-ar');
  const errorClose = document.querySelector('#error-close');

  let arSystem = null;
  let starting = false;
  let sessionToken = 0;
  let active = false;
  let cameraObserver = null;
  const foundTargets = new Set();
  const lossTimers = new Map();

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function setARUI(show) {
    [header, footer, status, guide].forEach(el => el && el.classList.toggle('hidden', !show));
    if (!show && sideChip) sideChip.classList.add('hidden');
  }

  function showError(title, copy, statusText = 'AR ERROR') {
    errorTitle.textContent = title;
    errorCopy.textContent = copy;
    errorCard.classList.remove('hidden');
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
      // CSS transparency alone is not enough if WebGL clears opaque black.
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
      // Ignore future asset videos. MindAR's live camera has a MediaStream.
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
      } catch (error) {
        console.warn('Camera cleanup warning:', error);
      }
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
      const response = await fetch(`${TARGET_FILE}?v=20260819`, { cache: 'no-store' });
      if (!response.ok) return false;
      const buffer = await response.arrayBuffer();
      return buffer.byteLength > 128;
    } catch (error) {
      console.warn('Target-file check failed:', error);
      return false;
    }
  }

  function explainCameraError(error) {
    const name = error && error.name ? error.name : '';
    if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      return 'The camera requires HTTPS. Upload the AR folder to an HTTPS address on the IDIS Americas website and open it there.';
    }
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return 'Camera permission was blocked. Allow camera access for this site, then tap Try Again.';
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return 'No usable camera was found on this device.';
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return 'The camera is already in use by another app or browser tab. Close it there and try again.';
    }
    if (error && error.code === 'CAMERA_FRAME_TIMEOUT') {
      return 'Camera permission was granted, but no live camera frame became available. Reload the page, close other camera apps or tabs, and try again.';
    }
    return 'The AR engine could not open the camera. Confirm camera permission, HTTPS hosting, and the target file, then try again.';
  }

  async function startAR() {
    if (starting || active) return;
    starting = true;
    const myToken = ++sessionToken;
    hideError();
    foundTargets.clear();
    status.classList.remove('locked', 'error');
    statusCopy.textContent = 'CHECKING TARGETS';

    try {
      if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        throw Object.assign(new Error('HTTPS_REQUIRED'), { code: 'HTTPS_REQUIRED' });
      }

      // The previous prototype could appear black when the .mind file had not
      // been created yet. Check it before hiding the landing screen.
      const targetReady = await verifyTargetFile();
      if (!targetReady) {
        showError(
          'Two-sided tracking file is missing.',
          'Create gsx2026-two-sided.mind from the Atlanta image first and the IDIS image second. The included Target Setup page walks through the exact order.',
          'TARGET FILE MISSING'
        );
        return;
      }

      intro.classList.add('hidden');
      setARUI(true);
      status.classList.remove('hidden');
      guide.classList.remove('hidden');
      statusCopy.textContent = 'STARTING CAMERA';
      hideAllExperienceRoots();
      watchForCameraVideo();

      arSystem = await waitForSceneSystem();
      if (window.IDIS_HQ_CAMERA) window.IDIS_HQ_CAMERA.patch(arSystem);
      if (myToken !== sessionToken) return;

      // MindAR starts camera acquisition asynchronously. Wait for an actual
      // live frame before treating the AR session as ready for the user.
      arSystem.start();
      const cameraVideo = await waitForLiveCamera();
      if (myToken !== sessionToken) {
        try { arSystem.stop(); } catch (_) {}
        stopAllCameraTracks();
        return;
      }

      active = true;
      styleCameraVideos();
      forceTransparentRenderer();
      console.info('IDIS AR camera live', {
        width: cameraVideo.videoWidth,
        height: cameraVideo.videoHeight,
        readyState: cameraVideo.readyState
      });
      // The inserted camera element can be restyled by MindAR during sizing.
      // Re-apply only visibility/layering a few times without changing geometry.
      [50, 200, 500, 1000, 1800].forEach(delay => setTimeout(() => {
        if (active && myToken === sessionToken) styleCameraVideos();
      }, delay));
      statusCopy.textContent = 'LOOK FOR THE COIN';
    } catch (error) {
      console.error('AR start failed:', error);
      if (error && error.code === 'HTTPS_REQUIRED') {
        showError('HTTPS is required for camera access.', 'Host this folder at an HTTPS URL. Localhost also works for development.', 'HTTPS REQUIRED');
      } else {
        showError('Camera could not start.', explainCameraError(error), 'CAMERA ERROR');
      }
      // If the landing screen was already hidden, keep the close control and
      // camera HUD visible behind the diagnostic card.
    } finally {
      starting = false;
    }
  }

  async function stopAR(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    ++sessionToken; // invalidates any in-flight start()
    active = false;
    starting = false;
    foundTargets.clear();
    lossTimers.forEach(timer => clearTimeout(timer));
    lossTimers.clear();
    hideError();
    stopWatchingCamera();

    try {
      if (!arSystem && scene.systems) arSystem = scene.systems['mindar-image-system'];
      if (arSystem) await Promise.resolve(arSystem.stop());
    } catch (error) {
      console.warn('MindAR stop warning:', error);
    }

    // Defensive cleanup for browsers that keep a MediaStream alive after stop.
    stopAllCameraTracks();
    status.classList.remove('locked', 'error');
    sideChip.classList.add('hidden');
    hideAllExperienceRoots();
    setARUI(false);
    intro.classList.remove('hidden');
  }

  function getExperienceRoot(target) {
    return target ? target.querySelector('.experience-root') : null;
  }

  function getParallaxComponent() {
    return atlantaTarget && atlantaTarget.components ? atlantaTarget.components['parallax-stack'] : null;
  }

  function hideAllExperienceRoots() {
    const parallax = getParallaxComponent();
    if (parallax) parallax.reset();

    [atlantaTarget, idisTarget].forEach((target) => {
      const root = getExperienceRoot(target);
      if (root) root.setAttribute('visible', 'false');
    });
  }

  function clearLossTimer(side) {
    const timer = lossTimers.get(side);
    if (timer) clearTimeout(timer);
    lossTimers.delete(side);
  }

  function revealTarget(target, side, statusLabel) {
    clearLossTimer(side);
    clearLossTimer(side === 'atlanta' ? 'idis' : 'atlanta');

    foundTargets.clear();
    foundTargets.add(side);
    status.classList.remove('error');
    status.classList.add('locked');
    statusCopy.textContent = statusLabel;

    // Clean two-state UI: either scan guidance OR AR artwork, never both.
    guide.classList.add('hidden');
    status.classList.add('hidden');
    sideChip.classList.add('hidden');

    const currentRoot = getExperienceRoot(target);
    const otherRoot = side === 'atlanta' ? getExperienceRoot(idisTarget) : getExperienceRoot(atlantaTarget);
    if (otherRoot) otherRoot.setAttribute('visible', 'false');

    if (side === 'atlanta') {
      const parallax = getParallaxComponent();
      if (parallax) {
        parallax.reset();
        parallax.reveal();
      } else if (currentRoot) {
        currentRoot.setAttribute('visible', 'true');
      }
      return;
    }

    // Keep the existing IDIS-side reveal.
    if (currentRoot) {
      currentRoot.setAttribute('visible', 'true');
      currentRoot.removeAttribute('animation__reveal');
      currentRoot.setAttribute('scale', '0.86 0.86 0.86');
      currentRoot.setAttribute('animation__reveal', 'property: scale; to: 1 1 1; dur: 760; easing: easeOutCubic');
    }
  }

  function loseTarget(side) {
    clearLossTimer(side);

    // Short debounce prevents one weak reflective frame from making the scene blink.
    const timer = setTimeout(() => {
      lossTimers.delete(side);
      foundTargets.delete(side);

      if (side === 'atlanta') {
        const parallax = getParallaxComponent();
        if (parallax) parallax.reset();
      } else {
        const target = idisTarget;
        const root = getExperienceRoot(target);
        if (root) root.setAttribute('visible', 'false');
      }

      if (foundTargets.size === 0) {
        hideAllExperienceRoots();
        status.classList.remove('locked');
        status.classList.remove('hidden');
        statusCopy.textContent = 'LOOK FOR THE COIN';
        guide.classList.remove('hidden');
        sideChip.classList.add('hidden');
      }
    }, 260);

    lossTimers.set(side, timer);
  }

  scene.addEventListener('loaded', () => {
    arSystem = scene.systems['mindar-image-system'];
    forceTransparentRenderer();
  });

  scene.addEventListener('renderstart', () => {
    forceTransparentRenderer();
    styleCameraVideos();
  });

  scene.addEventListener('arReady', () => {
    if (!active && !starting) return;
    styleCameraVideos();
    status.classList.remove('error');
    if (foundTargets.size === 0) statusCopy.textContent = 'LOOK FOR THE COIN';
  });

  scene.addEventListener('arError', event => {
    if (!starting && !active) return;
    console.error('MindAR arError:', event);
    showError('AR engine error.', 'The camera or image-tracking engine could not initialize. Check camera permission, HTTPS hosting, and the two-sided .mind target file.', 'AR ERROR');
  });

  atlantaTarget.addEventListener('targetFound', () => revealTarget(atlantaTarget, 'atlanta', 'ATLANTA SIDE LOCKED'));
  atlantaTarget.addEventListener('targetLost', () => loseTarget('atlanta'));
  idisTarget.addEventListener('targetFound', () => revealTarget(idisTarget, 'idis', 'IDIS SIDE LOCKED'));
  idisTarget.addEventListener('targetLost', () => loseTarget('idis'));

  startButton.addEventListener('click', startAR);
  retryButton.addEventListener('click', startAR);

  // pointerup makes the close control responsive on phones even if a canvas is
  // doing pointer handling. click is kept as a keyboard/mouse fallback.
  closeButton.addEventListener('pointerup', stopAR, { passive: false });
  closeButton.addEventListener('click', event => {
    if (event.detail === 0) stopAR(event); // keyboard activation only
  });
  errorClose.addEventListener('click', () => hideError());

  window.addEventListener('pagehide', () => {
    ++sessionToken;
    try { if (arSystem) arSystem.stop(); } catch (_) {}
    stopAllCameraTracks();
  });
});
