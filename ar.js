/*
  IDIS Americas | GSX 2026 WebAR - FAST LOAD PRODUCTION
  targetIndex 0 = Atlanta / Georgia
  targetIndex 1 = IDIS Americas

  Target-attached 3D holograms were removed. MindAR is used only for
  target recognition; both presentations render as detached HTML/video.
*/

console.info('[IDIS WebAR] Build 34 IDIS Text Tagline: 20260821-idistext34');

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
  const overlayStage = document.querySelector('#atlanta-parallax-stage');
  const backgroundWash = document.querySelector('#atlanta-background-wash');
  const layerBack = document.querySelector('#atlanta-layer-back');
  const layerMiddle = document.querySelector('#atlanta-layer-middle');
  const layerFront = document.querySelector('#atlanta-layer-front');

  const gestureSurface = document.querySelector('#presentation-gesture-surface');
  const presentationUI = document.querySelector('#presentation-ui');
  const presentationSeconds = document.querySelector('#presentation-seconds');

  const idisCinematic = document.querySelector('#idis-cinematic');
  const idisCinematicBackdrop = document.querySelector('#idis-cinematic-backdrop');
  const idisShowcaseVideo = document.querySelector('#idis-showcase-video');
  const idisShowcaseCanvas = document.querySelector('#idis-showcase-canvas');
  const idisFeatureOverlay = document.querySelector('#idis-feature-overlay');
  const idisFeatureStage = document.querySelector('#idis-feature-stage');
  const idisFeatureVideoLayer = document.querySelector('#idis-feature-video-layer');
  const idisFeatureLogoLayer = document.querySelector('#idis-feature-logo-layer');
  const idisFeatureLogo = document.querySelector('#idis-feature-logo');
  const idisFeatureVideoWrap = document.querySelector('#idis-feature-video-wrap');
  const idisFeatureYouTubeHost = document.querySelector('#idis-youtube-player');

  const guestNameInput = document.querySelector('#guest-name');
  const guestNameField = document.querySelector('.guest-name-field');

  const endCard = document.querySelector('#end-card');
  const personalizedThanksLine1 = document.querySelector('#personalized-thanks-line1');
  const personalizedThanksLine2 = document.querySelector('#personalized-thanks-line2');

  const TARGET_FILE = './assets/targets/gsx2026-two-sided.mind';

  const PRESENTATION_MS = 30000; // Atlanta keeps the 30-second interactive timer.
  const HOME_DELAY_MS = 3000;

  // IDIS is now media-driven.
  const IDIS_LOGO_TO_FEATURE_DELAY_MS = 850;
  const IDIS_CINEMATIC_EXIT_MS = 620;

  // IDIS background takeover:
  // wait 6 seconds of actual showcase playback, then CSS fades for 3 seconds.
  const IDIS_BACKDROP_DELAY_MS = 4000;
  const IDIS_BACKDROP_FADE_MS = 1800;

  const IDIS_YOUTUBE_VIDEO_ID = 'G7vGMc4Z2os';
  const IDIS_YOUTUBE_START_TIMEOUT_MS = 12000;

  const END_CARD_MS = 6000;
  const END_CARD_FADE_OUT_MS = 900;

  const GUEST_NAME_STORAGE_KEY = 'idis-gsx2026-guest-name';
  let guestName = '';

  let arSystem = null;
  let starting = false;
  let active = false;
  let sessionToken = 0;
  let cameraObserver = null;

  // null = scanner mode. atlanta/idis = interactive presentation mode.
  let currentSide = null;

  // Presentation timing.
  let presentationStartedAt = 0;
  let presentationDeadline = 0;
  let presentationTimeout = null;
  let countdownRAF = 0;

  let endCardTimer = null;
  let endCardFadeTimer = null;
  let endCardActive = false;
  let endCardVariant = 'atlanta';

  // Atlanta video reveal.
  let backVideoStartTimer = null;
  let revealStartedAt = 0;

  // Atlanta render loop.
  let presentationRAF = 0;

  // Opposite-face recognition watchdog.
  let switchWatcherRAF = 0;
  let oppositeVisibleSince = 0;
  const OPPOSITE_FACE_HOLD_MS = 220;

  // IDIS detached/frozen presentation.
  // Kept for cleanup compatibility, but the IDIS face now uses the
  // cinematic video sequence instead of the old 30-second hologram.
  // IDIS cinematic sequence.
  let idisFeatureStartTimer = null;
  let idisCinematicExitTimer = null;
  let idisYouTubeStartTimeout = null;
  let idisBackdropTimer = null;
  let idisSequenceActive = false;
  let idisSequencePhase = 'idle';

  let idisYouTubePlayer = null;
  let idisYouTubeReady = false;
  let idisYouTubePendingPlay = false;

  // GPU compositor for the transparent/black-key showcase.
  let idisAlphaGL = null;
  let idisAlphaProgram = null;
  let idisAlphaTexture = null;
  let idisAlphaPositionBuffer = null;
  let idisAlphaTexCoordBuffer = null;
  let idisAlphaRAF = 0;
  let idisAlphaRendererReady = false;
  let idisAlphaUseVideoFallback = false;

  // Gesture state shared by both scenes.
  const pointers = new Map();
  let panX = 0;
  let panY = 0;
  let zoom = 1;

  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartPanX = 0;
  let dragStartPanY = 0;

  let pinchStartDistance = 0;
  let pinchStartZoom = 1;
  let pinchStartMidX = 0;
  let pinchStartMidY = 0;
  let pinchStartPanX = 0;
  let pinchStartPanY = 0;

  let lastInteractionAt = 0;
  let returningHome = false;

  // Phone motion / orientation tilt.
  let motionTiltEnabled = false;
  let motionPermissionAttempted = false;

  // DeviceOrientation is preferred for left/right because gamma is very
  // responsive. DeviceMotion gravity is preferred for up/down because it is
  // much more reliable when the phone is held upright.
  let orientationListenerEnabled = false;
  let motionListenerEnabled = false;

  let orientationSampleReady = false;
  let gravitySampleReady = false;

  let rawOrientationLR = 0;
  let rawOrientationUDFallback = 0;

  let rawGravityLR = 0;
  let rawGravityUD = 0;

  let smoothPhoneTiltLR = 0;
  let smoothPhoneTiltUD = 0;

  let phoneTiltNeutralLR = 0;
  let phoneTiltNeutralUD = 0;
  let phoneTiltNeutralCaptured = false;
  let phoneTiltNeutralPending = true;

  // Track which source is currently driving each axis. If a better sensor
  // becomes available mid-scene, that axis is re-zeroed to prevent a jump.
  let activeLRSource = 'none';
  let activeUDSource = 'none';

  const PHONE_TILT_INPUT_LIMIT_LR = 30;
  const PHONE_TILT_INPUT_LIMIT_UD = 28;

  const PHONE_TILT_SCENE_LIMIT_LR = 6.5;
  const PHONE_TILT_SCENE_LIMIT_UD = 7.0;

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

  /* ------------------------------------------------------------------------
     PHONE MOTION TILT

     LEFT / RIGHT:
       DeviceOrientation gamma, screen-remapped.
       Falls back to gravity roll if orientation data is unavailable.

     UP / DOWN:
       DeviceMotion accelerationIncludingGravity.
       We calculate the angle of the screen normal against gravity. This is
       much more reliable than beta for a phone held vertically.
       Falls back to DeviceOrientation beta when gravity is unavailable.

     Sensor streams remain active between scans. Every new coin scene captures
     a fresh neutral point from the latest live sensor values.
  ------------------------------------------------------------------------ */

  function normalizeScreenAngle(value) {
    let angle = Number(value) || 0;
    angle = ((angle % 360) + 360) % 360;

    if (angle >= 315 || angle < 45) return 0;
    if (angle >= 45 && angle < 135) return 90;
    if (angle >= 135 && angle < 225) return 180;
    return 270;
  }

  function getScreenOrientationAngle() {
    if (
      window.screen &&
      screen.orientation &&
      Number.isFinite(Number(screen.orientation.angle))
    ) {
      return normalizeScreenAngle(screen.orientation.angle);
    }

    if (Number.isFinite(Number(window.orientation))) {
      return normalizeScreenAngle(window.orientation);
    }

    return 0;
  }

  function mapDeviceTiltToScreen(beta, gamma) {
    const angle = getScreenOrientationAngle();

    switch (angle) {
      case 90:
        return {
          leftRight: beta,
          upDown: -gamma
        };

      case 180:
        return {
          leftRight: -gamma,
          upDown: -beta
        };

      case 270:
        return {
          leftRight: -beta,
          upDown: gamma
        };

      case 0:
      default:
        return {
          leftRight: gamma,
          upDown: beta
        };
    }
  }

  function mapGravityToScreen(x, y, z) {
    const angle = getScreenOrientationAngle();

    let sx = x;
    let sy = y;

    // Rotate device X/Y into screen-relative horizontal/vertical axes.
    switch (angle) {
      case 90:
        sx = -y;
        sy = x;
        break;

      case 180:
        sx = -x;
        sy = -y;
        break;

      case 270:
        sx = y;
        sy = -x;
        break;

      case 0:
      default:
        sx = x;
        sy = y;
        break;
    }

    const horizontalDenominator =
      Math.max(0.001, Math.sqrt(sy * sy + z * z));

    const normalDenominator =
      Math.max(0.001, Math.sqrt(sx * sx + sy * sy));

    // Roll around the screen's vertical axis, useful as LR fallback.
    const leftRight =
      THREE.MathUtils.radToDeg(
        Math.atan2(sx, horizontalDenominator)
      );

    // Screen-normal pitch. At an upright neutral phone z is near zero.
    // Tipping the top of the phone toward/away changes z strongly.
    const upDown =
      THREE.MathUtils.radToDeg(
        Math.atan2(z, normalDenominator)
      );

    return {
      leftRight,
      upDown
    };
  }

  function shortestAngleDelta(current, neutral) {
    let delta = current - neutral;

    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;

    return delta;
  }

  function getCurrentTiltSources() {
    return {
      lrSource:
        orientationSampleReady
          ? 'orientation'
          : gravitySampleReady
            ? 'gravity'
            : 'none',

      udSource:
        gravitySampleReady
          ? 'gravity'
          : orientationSampleReady
            ? 'orientation'
            : 'none',

      leftRight:
        orientationSampleReady
          ? rawOrientationLR
          : gravitySampleReady
            ? rawGravityLR
            : 0,

      upDown:
        gravitySampleReady
          ? rawGravityUD
          : orientationSampleReady
            ? rawOrientationUDFallback
            : 0
    };
  }

  function capturePhoneTiltNeutral() {
    if (!motionTiltEnabled) {
      phoneTiltNeutralCaptured = false;
      phoneTiltNeutralPending = true;
      return;
    }

    const sources = getCurrentTiltSources();

    if (
      sources.lrSource === 'none' ||
      sources.udSource === 'none'
    ) {
      phoneTiltNeutralCaptured = false;
      phoneTiltNeutralPending = true;
      return;
    }

    activeLRSource = sources.lrSource;
    activeUDSource = sources.udSource;

    phoneTiltNeutralLR = sources.leftRight;
    phoneTiltNeutralUD = sources.upDown;

    smoothPhoneTiltLR = sources.leftRight;
    smoothPhoneTiltUD = sources.upDown;

    phoneTiltNeutralCaptured = true;
    phoneTiltNeutralPending = false;
  }

  function rezeroAxisIfSourceChanged() {
    if (!phoneTiltNeutralCaptured) return;

    const sources = getCurrentTiltSources();

    if (
      sources.lrSource !== 'none' &&
      sources.lrSource !== activeLRSource
    ) {
      activeLRSource = sources.lrSource;
      phoneTiltNeutralLR = sources.leftRight;
      smoothPhoneTiltLR = sources.leftRight;
    }

    if (
      sources.udSource !== 'none' &&
      sources.udSource !== activeUDSource
    ) {
      activeUDSource = sources.udSource;
      phoneTiltNeutralUD = sources.upDown;
      smoothPhoneTiltUD = sources.upDown;
    }
  }

  function handleDeviceOrientation(event) {
    if (!motionTiltEnabled) return;

    const beta = Number(event.beta);
    const gamma = Number(event.gamma);

    if (!Number.isFinite(beta) || !Number.isFinite(gamma)) {
      return;
    }

    const mapped =
      mapDeviceTiltToScreen(beta, gamma);

    rawOrientationLR = mapped.leftRight;
    rawOrientationUDFallback = mapped.upDown;
    orientationSampleReady = true;

    if (phoneTiltNeutralPending || !phoneTiltNeutralCaptured) {
      capturePhoneTiltNeutral();
    } else {
      rezeroAxisIfSourceChanged();
    }
  }

  function handleDeviceMotion(event) {
    if (!motionTiltEnabled) return;

    const gravity =
      event.accelerationIncludingGravity;

    if (!gravity) return;

    const x = Number(gravity.x);
    const y = Number(gravity.y);
    const z = Number(gravity.z);

    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      !Number.isFinite(z)
    ) {
      return;
    }

    const mapped =
      mapGravityToScreen(x, y, z);

    rawGravityLR = mapped.leftRight;
    rawGravityUD = mapped.upDown;
    gravitySampleReady = true;

    if (phoneTiltNeutralPending || !phoneTiltNeutralCaptured) {
      capturePhoneTiltNeutral();
    } else {
      // Gravity becoming available upgrades up/down from beta to the
      // accelerometer without making the scene jump.
      rezeroAxisIfSourceChanged();
    }
  }

  function resetPhoneTiltNeutral() {
    // Keep all live raw samples. Re-zero instantly from the newest values.
    phoneTiltNeutralCaptured = false;
    phoneTiltNeutralPending = true;
    activeLRSource = 'none';
    activeUDSource = 'none';

    capturePhoneTiltNeutral();
  }

  function handleScreenOrientationChange() {
    // Sensor axes have changed relative to the visible screen.
    phoneTiltNeutralCaptured = false;
    phoneTiltNeutralPending = true;
    activeLRSource = 'none';
    activeUDSource = 'none';
  }

  async function enablePhoneTilt() {
    if (motionTiltEnabled) return true;

    const hasOrientation =
      typeof window.DeviceOrientationEvent !== 'undefined';

    const hasMotion =
      typeof window.DeviceMotionEvent !== 'undefined';

    if (!hasOrientation && !hasMotion) {
      return false;
    }

    motionPermissionAttempted = true;

    try {
      // Invoke both permission functions before awaiting so iOS sees both
      // requests as part of the same Start AR user gesture.
      const permissionChecks = [];

      if (
        hasOrientation &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        permissionChecks.push(
          DeviceOrientationEvent.requestPermission()
            .then(value => ({
              type: 'orientation',
              granted: value === 'granted'
            }))
            .catch(() => ({
              type: 'orientation',
              granted: false
            }))
        );
      } else if (hasOrientation) {
        permissionChecks.push(
          Promise.resolve({
            type: 'orientation',
            granted: true
          })
        );
      }

      if (
        hasMotion &&
        typeof DeviceMotionEvent.requestPermission === 'function'
      ) {
        permissionChecks.push(
          DeviceMotionEvent.requestPermission()
            .then(value => ({
              type: 'motion',
              granted: value === 'granted'
            }))
            .catch(() => ({
              type: 'motion',
              granted: false
            }))
        );
      } else if (hasMotion) {
        permissionChecks.push(
          Promise.resolve({
            type: 'motion',
            granted: true
          })
        );
      }

      const results =
        await Promise.all(permissionChecks);

      const orientationGranted =
        results.some(
          item =>
            item.type === 'orientation' &&
            item.granted
        );

      const motionGranted =
        results.some(
          item =>
            item.type === 'motion' &&
            item.granted
        );

      if (orientationGranted) {
        window.addEventListener(
          'deviceorientation',
          handleDeviceOrientation,
          true
        );

        orientationListenerEnabled = true;
      }

      if (motionGranted) {
        window.addEventListener(
          'devicemotion',
          handleDeviceMotion,
          true
        );

        motionListenerEnabled = true;
      }

      if (!orientationGranted && !motionGranted) {
        return false;
      }

      window.addEventListener(
        'orientationchange',
        handleScreenOrientationChange,
        true
      );

      if (
        screen.orientation &&
        typeof screen.orientation.addEventListener === 'function'
      ) {
        screen.orientation.addEventListener(
          'change',
          handleScreenOrientationChange
        );
      }

      motionTiltEnabled = true;

      orientationSampleReady = false;
      gravitySampleReady = false;

      resetPhoneTiltNeutral();

      return true;
    } catch (error) {
      console.warn(
        'Phone motion permission unavailable:',
        error
      );

      return false;
    }
  }

  function disablePhoneTilt() {
    if (orientationListenerEnabled) {
      window.removeEventListener(
        'deviceorientation',
        handleDeviceOrientation,
        true
      );
    }

    if (motionListenerEnabled) {
      window.removeEventListener(
        'devicemotion',
        handleDeviceMotion,
        true
      );
    }

    window.removeEventListener(
      'orientationchange',
      handleScreenOrientationChange,
      true
    );

    if (
      screen.orientation &&
      typeof screen.orientation.removeEventListener === 'function'
    ) {
      screen.orientation.removeEventListener(
        'change',
        handleScreenOrientationChange
      );
    }

    orientationListenerEnabled = false;
    motionListenerEnabled = false;
    motionTiltEnabled = false;

    orientationSampleReady = false;
    gravitySampleReady = false;

    phoneTiltNeutralCaptured = false;
    phoneTiltNeutralPending = true;

    activeLRSource = 'none';
    activeUDSource = 'none';
  }

  function updatePhoneTilt() {
    if (
      !motionTiltEnabled ||
      !phoneTiltNeutralCaptured
    ) {
      return { x: 0, y: 0 };
    }

    const sources = getCurrentTiltSources();

    if (
      sources.lrSource === 'none' ||
      sources.udSource === 'none'
    ) {
      return { x: 0, y: 0 };
    }

    rezeroAxisIfSourceChanged();

    smoothPhoneTiltLR = lerp(
      smoothPhoneTiltLR,
      sources.leftRight,
      0.10
    );

    smoothPhoneTiltUD = lerp(
      smoothPhoneTiltUD,
      sources.upDown,
      0.085
    );

    const deltaLR = clamp(
      shortestAngleDelta(
        smoothPhoneTiltLR,
        phoneTiltNeutralLR
      ),
      -PHONE_TILT_INPUT_LIMIT_LR,
      PHONE_TILT_INPUT_LIMIT_LR
    );

    const deltaUD = clamp(
      shortestAngleDelta(
        smoothPhoneTiltUD,
        phoneTiltNeutralUD
      ),
      -PHONE_TILT_INPUT_LIMIT_UD,
      PHONE_TILT_INPUT_LIMIT_UD
    );

    const leftRight = clamp(
      (deltaLR / PHONE_TILT_INPUT_LIMIT_LR) *
        PHONE_TILT_SCENE_LIMIT_LR,
      -PHONE_TILT_SCENE_LIMIT_LR,
      PHONE_TILT_SCENE_LIMIT_LR
    );

    const upDown = clamp(
      -(deltaUD / PHONE_TILT_INPUT_LIMIT_UD) *
        PHONE_TILT_SCENE_LIMIT_UD,
      -PHONE_TILT_SCENE_LIMIT_UD,
      PHONE_TILT_SCENE_LIMIT_UD
    );

    return {
      x: upDown,
      y: leftRight
    };
  }

  /* ------------------------------------------------------------------------
     REMEMBERED GUEST NAME
  ------------------------------------------------------------------------ */

  function cleanGuestName(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40);
  }

  function readGuestName() {
    try {
      return cleanGuestName(
        window.localStorage.getItem(GUEST_NAME_STORAGE_KEY)
      );
    } catch (_) {
      return '';
    }
  }

  function saveGuestName(value) {
    guestName = cleanGuestName(value);

    try {
      if (guestName) {
        window.localStorage.setItem(
          GUEST_NAME_STORAGE_KEY,
          guestName
        );
      } else {
        window.localStorage.removeItem(
          GUEST_NAME_STORAGE_KEY
        );
      }
    } catch (_) {
      // Private browsing or browser storage restrictions should not block AR.
    }

    if (guestNameInput) {
      guestNameInput.value = guestName;
    }

    if (guestNameField) {
      guestNameField.classList.toggle(
        'has-memory',
        !!guestName
      );
    }

    return guestName;
  }

  function loadRememberedGuestName() {
    guestName = readGuestName();

    if (guestNameInput && guestName) {
      guestNameInput.value = guestName;
    }

    if (guestNameField) {
      // If this browser already remembers a name, hide the entire
      // name-entry section. The saved name is still used by the end card.
      guestNameField.classList.toggle(
        'has-memory',
        !!guestName
      );
    }
  }

  function updatePersonalizedThanks(variant = 'atlanta') {
    if (!personalizedThanksLine1 || !personalizedThanksLine2) return;

    const isIDIS = variant === 'idis';

    if (isIDIS) {
      personalizedThanksLine1.textContent =
        guestName
          ? 'See you next time,'
          : 'See you next time';

      if (guestName) {
        personalizedThanksLine2.textContent = guestName;
        personalizedThanksLine2.style.display = '';
      } else {
        personalizedThanksLine2.textContent = '';
        personalizedThanksLine2.style.display = 'none';
      }

      return;
    }

    // Atlanta keeps the established closing card.
    personalizedThanksLine1.textContent = 'Thank you,';

    if (guestName) {
      personalizedThanksLine2.textContent = guestName;
      personalizedThanksLine2.style.display = '';
    } else {
      personalizedThanksLine2.textContent = 'Guest';
      personalizedThanksLine2.style.display = 'none';
      personalizedThanksLine1.textContent = 'Thank you';
    }
  }

  function clearEndCardTimers() {
    if (endCardTimer) {
      clearTimeout(endCardTimer);
      endCardTimer = null;
    }

    if (endCardFadeTimer) {
      clearTimeout(endCardFadeTimer);
      endCardFadeTimer = null;
    }
  }

  function hideEndCard() {
    clearEndCardTimers();
    endCardActive = false;

    if (!endCard) return;

    endCard.classList.remove(
      'phase-in',
      'phase-out',
      'is-idis-closing'
    );
    endCard.classList.add('hidden');
    endCard.setAttribute('aria-hidden', 'true');
  }

  function showEndCard(variant = 'atlanta') {
    clearEndCardTimers();

    endCardVariant = variant;
    updatePersonalizedThanks(variant);

    if (!endCard) {
      finishEndCardToScan();
      return;
    }

    endCardActive = true;

    endCard.classList.toggle(
      'is-idis-closing',
      variant === 'idis'
    );

    // Force a clean animation restart every time.
    endCard.classList.remove('hidden', 'phase-in', 'phase-out');
    void endCard.offsetWidth;
    endCard.classList.add('phase-in');
    endCard.setAttribute('aria-hidden', 'false');

    // Begin fade-out so the complete end-card experience lasts 6 seconds.
    endCardFadeTimer = setTimeout(() => {
      endCardFadeTimer = null;

      if (!endCardActive) return;

      endCard.classList.remove('phase-in');
      endCard.classList.add('phase-out');
    }, END_CARD_MS - END_CARD_FADE_OUT_MS);

    endCardTimer = setTimeout(() => {
      endCardTimer = null;
      finishEndCardToScan();
    }, END_CARD_MS);
  }


  /* ------------------------------------------------------------------------
     CAMERA / UI
  ------------------------------------------------------------------------ */

  function setARUI(show) {
    [header, footer].forEach(el => el && el.classList.toggle('hidden', !show));
    if (!show) {
      status.classList.add('hidden');
      guide.classList.add('hidden');
      sideChip.classList.add('hidden');
    }
  }

  function showScanUI(text = 'SCAN COIN NOW') {
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

  function showPresentationControls() {
    gestureSurface.classList.remove('hidden');
    presentationUI.classList.remove('hidden');
  }

  function hidePresentationControls() {
    gestureSurface.classList.add('hidden');
    presentationUI.classList.add('hidden');
    pointers.clear();
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
    const videos = arContainer
      ? [...arContainer.querySelectorAll('video')]
      : [...document.querySelectorAll('video')];

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
    const videos = arContainer
      ? arContainer.querySelectorAll('video')
      : document.querySelectorAll('video');

    videos.forEach(video => {
      if (!video.srcObject) return;
      try {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.pause();
        video.srcObject = null;
      } catch (_) {}
    });
  }

  function install4KCameraPatch(system) {
    if (!system || system.__idisFastCameraPatched) return;

    system._startVideo = function () {
      this.video = document.createElement('video');
      this.video.setAttribute('autoplay', '');
      this.video.setAttribute('muted', '');
      this.video.setAttribute('playsinline', '');
      this.video.setAttribute('webkit-playsinline', '');
      this.video.muted = true;
      this.video.playsInline = true;
      this.video.style.position = 'absolute';
      this.video.style.top = '0px';
      this.video.style.left = '0px';
      this.video.style.zIndex = '-2';
      this.container.appendChild(this.video);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.el.emit('arError', { error: 'VIDEO_FAIL' });
        return;
      }

      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30, max: 30 }
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          const track = stream.getVideoTracks()[0];
          const settings = track && track.getSettings ? track.getSettings() : {};
          window.IDIS_CAMERA_INFO = {
            requested: 'FAST 1080P',
            width: settings.width || 0,
            height: settings.height || 0,
            frameRate: settings.frameRate || 0,
            facingMode: settings.facingMode || ''
          };

          this.video.addEventListener('loadedmetadata', () => {
            this.video.setAttribute('width', this.video.videoWidth);
            this.video.setAttribute('height', this.video.videoHeight);
            window.IDIS_CAMERA_INFO.width = this.video.videoWidth;
            window.IDIS_CAMERA_INFO.height = this.video.videoHeight;
            this._startAR();
          }, { once: true });

          this.video.srcObject = stream;
        })
        .catch(error => {
          console.warn('Rear camera request unavailable', error);
          this.el.emit('arError', { error: 'VIDEO_FAIL' });
        });
    };

    system.__idisFastCameraPatched = true;
  }

  async function waitForLiveCamera(maxMs = 18000) {
    const started = performance.now();

    while (performance.now() - started < maxMs) {
      const video =
        (arSystem && arSystem.video) ||
        (arContainer && arContainer.querySelector('video'));

      if (
        video &&
        video.srcObject &&
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        video.readyState >= 2
      ) {
        try { await video.play(); } catch (_) {}
        styleCameraVideos();
        return video;
      }

      await wait(100);
    }

    throw new Error('CAMERA_FRAME_TIMEOUT');
  }

  async function waitForSceneSystem(maxMs = 8000) {
    const started = performance.now();

    while (performance.now() - started < maxMs) {
      const system = scene.systems && scene.systems['mindar-image-system'];
      if (system) return system;
      await wait(80);
    }

    throw new Error(
      'MindAR image system did not initialize in time. Verify A-Frame loaded before MindAR.'
    );
  }

  async function verifyTargetFile() {
    // MindAR loads the .mind file itself. Avoid downloading the same database
    // once here and a second time during arSystem.start().
    return true;
  }

  /* ------------------------------------------------------------------------
     NON-BLOCKING MEDIA WARMUP
  ------------------------------------------------------------------------ */

  let mediaWarmupScheduled = false;

  function warmVideo(video) {
    if (!video) return;
    try {
      video.preload = 'auto';
      if (video.readyState < 2) video.load();
    } catch (_) {}
  }

  function scheduleMediaWarmup() {
    if (mediaWarmupScheduled) return;
    mediaWarmupScheduled = true;

    const warm = () => {
      warmVideo(layerBack);
      setTimeout(() => warmVideo(idisShowcaseVideo), 500);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(warm, { timeout: 1400 });
    } else {
      setTimeout(warm, 900);
    }
  }

  /* ------------------------------------------------------------------------
     ATLANTA VIDEO / LAYERS
  ------------------------------------------------------------------------ */

  function prepareBackVideo() {
    if (!layerBack || layerBack.tagName !== 'VIDEO') return;

    layerBack.muted = true;
    layerBack.defaultMuted = true;
    layerBack.playsInline = true;
    layerBack.setAttribute('playsinline', '');
    layerBack.setAttribute('webkit-playsinline', '');
  }

  function clearBackVideoTimer() {
    if (backVideoStartTimer) {
      clearTimeout(backVideoStartTimer);
      backVideoStartTimer = null;
    }
  }

  function startBackVideo() {
    if (!layerBack || layerBack.tagName !== 'VIDEO') return;

    prepareBackVideo();

    try { layerBack.currentTime = 0; } catch (_) {}

    const playPromise = layerBack.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(error => {
        console.warn('Atlanta background video autoplay warning:', error);
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

  function hideAtlantaPresentation() {
    cancelAnimationFrame(presentationRAF);
    presentationRAF = 0;

    clearBackVideoTimer();
    stopBackVideo(true);

    overlay.classList.remove('is-visible');
    overlay.classList.add('hidden');

    if (backgroundWash) {
      backgroundWash.style.opacity = '0';
    }

    [layerBack, layerMiddle, layerFront].forEach(layer => {
      layer.style.opacity = '0';
      layer.style.transform = 'translate3d(-9999px,-9999px,0)';
      layer.style.webkitTransform = 'translate3d(-9999px,-9999px,0)';
    });

    if (overlayStage) {
      overlayStage.style.transform = 'none';
      overlayStage.style.webkitTransform = 'none';
    }
  }

  function showAtlantaPresentation() {
    hideAtlantaPresentation();

    overlay.classList.remove('hidden');
    overlay.classList.add('is-visible');

    revealStartedAt = performance.now();

    // Staged reveal:
    // 0.0s -> 1.0s = front/top fades in
    // 1.0s -> 2.0s = middle fades in
    // 2.0s -> 3.0s = background video + teal fade in
    backVideoStartTimer = setTimeout(() => {
      backVideoStartTimer = null;

      if (
        active &&
        currentSide === 'atlanta' &&
        !overlay.classList.contains('hidden')
      ) {
        startBackVideo();
      }
    }, 2000);

    renderPresentation();
  }

  /* ------------------------------------------------------------------------
     IDIS CINEMATIC SEQUENCE
  ------------------------------------------------------------------------ */

  function compileIDISShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`IDIS_SHADER_ERROR: ${log}`);
    }

    return shader;
  }

  function initIDISAlphaRenderer() {
    if (
      idisAlphaRendererReady ||
      idisAlphaUseVideoFallback
    ) {
      return idisAlphaRendererReady;
    }

    if (!idisShowcaseCanvas || !idisShowcaseVideo) {
      return false;
    }

    try {
      const gl =
        idisShowcaseCanvas.getContext(
          'webgl',
          {
            alpha: true,
            premultipliedAlpha: false,
            antialias: false,
            preserveDrawingBuffer: true
          }
        ) ||
        idisShowcaseCanvas.getContext(
          'experimental-webgl',
          {
            alpha: true,
            premultipliedAlpha: false,
            antialias: false,
            preserveDrawingBuffer: true
          }
        );

      if (!gl) {
        throw new Error('WEBGL_UNAVAILABLE');
      }

      const vertexSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;

        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }
      `;

      const fragmentSource = `
        precision mediump float;

        uniform sampler2D u_texture;
        varying vec2 v_texCoord;

        void main() {
          vec4 c = texture2D(u_texture, v_texCoord);

          // Preserve genuine decoded alpha where the codec/browser provides it.
          // If the export came through as fully opaque, remove near-black
          // pixels as a fallback. This solves the common black-background
          // WebM export problem without CPU pixel processing.
          float maxRGB = max(c.r, max(c.g, c.b));
          float keyedAlpha = smoothstep(0.025, 0.16, maxRGB);

          float decodedHasTransparency =
            1.0 - step(0.999, c.a);

          float alpha =
            mix(keyedAlpha, c.a, decodedHasTransparency);

          // Avoid dark fringe on keyed pixels.
          vec3 rgb = c.rgb;

          gl_FragColor = vec4(rgb, alpha);
        }
      `;

      const vertexShader =
        compileIDISShader(
          gl,
          gl.VERTEX_SHADER,
          vertexSource
        );

      const fragmentShader =
        compileIDISShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentSource
        );

      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(
          `IDIS_PROGRAM_ERROR: ${gl.getProgramInfoLog(program)}`
        );
      }

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1
        ]),
        gl.STATIC_DRAW
      );

      const texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          0, 0,
          1, 0,
          0, 1,
          0, 1,
          1, 0,
          1, 1
        ]),
        gl.STATIC_DRAW
      );

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        gl.LINEAR
      );

      gl.useProgram(program);

      const positionLocation =
        gl.getAttribLocation(
          program,
          'a_position'
        );

      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        positionBuffer
      );

      gl.enableVertexAttribArray(
        positionLocation
      );

      gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      const texCoordLocation =
        gl.getAttribLocation(
          program,
          'a_texCoord'
        );

      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        texCoordBuffer
      );

      gl.enableVertexAttribArray(
        texCoordLocation
      );

      gl.vertexAttribPointer(
        texCoordLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      const textureLocation =
        gl.getUniformLocation(
          program,
          'u_texture'
        );

      gl.uniform1i(textureLocation, 0);

      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );

      idisAlphaGL = gl;
      idisAlphaProgram = program;
      idisAlphaTexture = texture;
      idisAlphaPositionBuffer = positionBuffer;
      idisAlphaTexCoordBuffer = texCoordBuffer;
      idisAlphaRendererReady = true;

      return true;
    } catch (error) {
      console.warn(
        'IDIS WebGL alpha compositor unavailable:',
        error
      );

      idisAlphaUseVideoFallback = true;
      return false;
    }
  }

  function sizeIDISAlphaCanvas() {
    if (
      !idisShowcaseCanvas ||
      !idisShowcaseVideo
    ) {
      return;
    }

    const width =
      idisShowcaseVideo.videoWidth || 1280;

    const height =
      idisShowcaseVideo.videoHeight || 720;

    if (
      idisShowcaseCanvas.width !== width ||
      idisShowcaseCanvas.height !== height
    ) {
      idisShowcaseCanvas.width = width;
      idisShowcaseCanvas.height = height;
    }

    if (idisAlphaGL) {
      idisAlphaGL.viewport(
        0,
        0,
        idisShowcaseCanvas.width,
        idisShowcaseCanvas.height
      );
    }
  }

  function renderIDISAlphaFrame() {
    if (
      !idisAlphaRendererReady ||
      !idisAlphaGL ||
      !idisShowcaseVideo ||
      idisShowcaseVideo.readyState < 2
    ) {
      return false;
    }

    const gl = idisAlphaGL;

    try {
      sizeIDISAlphaCanvas();

      gl.clear(
        gl.COLOR_BUFFER_BIT
      );

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(
        gl.TEXTURE_2D,
        idisAlphaTexture
      );

      gl.pixelStorei(
        gl.UNPACK_FLIP_Y_WEBGL,
        true
      );

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        idisShowcaseVideo
      );

      gl.drawArrays(
        gl.TRIANGLES,
        0,
        6
      );

      return true;
    } catch (error) {
      console.warn(
        'IDIS alpha frame render failed:',
        error
      );

      return false;
    }
  }

  function stopIDISAlphaRenderLoop() {
    if (idisAlphaRAF) {
      cancelAnimationFrame(idisAlphaRAF);
      idisAlphaRAF = 0;
    }
  }

  function startIDISAlphaRenderLoop() {
    stopIDISAlphaRenderLoop();

    const tick = () => {
      idisAlphaRAF = 0;

      if (
        !idisSequenceActive ||
        idisSequencePhase !== 'showcase'
      ) {
        return;
      }

      renderIDISAlphaFrame();

      idisAlphaRAF =
        requestAnimationFrame(tick);
    };

    idisAlphaRAF =
      requestAnimationFrame(tick);
  }

  function showIDISAlphaSurface() {
    if (idisAlphaUseVideoFallback) {
      idisShowcaseVideo.classList.add(
        'webgl-fallback-visible'
      );
      return;
    }

    if (idisShowcaseCanvas) {
      idisShowcaseCanvas.classList.remove(
        'cinematic-hidden',
        'is-frozen',
        'is-entering'
      );

      void idisShowcaseCanvas.offsetWidth;
      idisShowcaseCanvas.classList.add(
        'is-entering'
      );
    }
  }

  function freezeIDISAlphaSurface() {
    stopIDISAlphaRenderLoop();

    if (idisAlphaUseVideoFallback) {
      idisShowcaseVideo.classList.add(
        'webgl-fallback-visible'
      );
      return;
    }

    renderIDISAlphaFrame();

    if (idisShowcaseCanvas) {
      idisShowcaseCanvas.classList.remove(
        'is-entering',
        'cinematic-hidden'
      );

      idisShowcaseCanvas.classList.add(
        'is-frozen'
      );
    }
  }

  function hideIDISAlphaSurface() {
    stopIDISAlphaRenderLoop();

    if (idisShowcaseCanvas) {
      idisShowcaseCanvas.classList.remove(
        'is-entering',
        'is-frozen'
      );
      idisShowcaseCanvas.classList.add(
        'cinematic-hidden'
      );
    }

    if (idisShowcaseVideo) {
      idisShowcaseVideo.classList.remove(
        'webgl-fallback-visible'
      );
    }
  }

  function prepareIDISCinematicVideo(video) {
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  }

  function safeResetIDISVideo(video) {
    if (!video) return;

    try { video.pause(); } catch (_) {}

    try {
      video.currentTime = 0;
    } catch (_) {}
  }

  function clearIDISCinematicTimers() {
    if (idisFeatureStartTimer) {
      clearTimeout(idisFeatureStartTimer);
      idisFeatureStartTimer = null;
    }

    if (idisCinematicExitTimer) {
      clearTimeout(idisCinematicExitTimer);
      idisCinematicExitTimer = null;
    }

    if (idisYouTubeStartTimeout) {
      clearTimeout(idisYouTubeStartTimeout);
      idisYouTubeStartTimeout = null;
    }

    if (idisBackdropTimer) {
      clearTimeout(idisBackdropTimer);
      idisBackdropTimer = null;
    }
  }

  function resetIDISCinematicSequence() {
    clearIDISCinematicTimers();

    idisSequenceActive = false;
    idisSequencePhase = 'idle';

    if (idisCinematicBackdrop) {
      idisCinematicBackdrop.classList.remove('fade-in');
    }

    if (idisFeatureStage) {
      idisFeatureStage.style.transform = '';
      idisFeatureStage.style.webkitTransform = '';
    }

    if (idisFeatureVideoLayer) {
      idisFeatureVideoLayer.style.transform = '';
      idisFeatureVideoLayer.style.webkitTransform = '';
    }

    if (idisFeatureLogoLayer) {
      idisFeatureLogoLayer.style.transform = '';
      idisFeatureLogoLayer.style.webkitTransform = '';
    }

    hideIDISAlphaSurface();

    if (idisShowcaseVideo) {
      safeResetIDISVideo(idisShowcaseVideo);
    }

    if (idisFeatureOverlay) {
      idisFeatureOverlay.classList.remove(
        'logo-in',
        'video-in'
      );
      idisFeatureOverlay.classList.add('cinematic-hidden');
      idisFeatureOverlay.setAttribute('aria-hidden', 'true');
    }

    stopIDISYouTubeFeature();

    if (idisCinematic) {
      idisCinematic.classList.remove('cinematic-exit');
      idisCinematic.classList.add('cinematic-hidden');
      idisCinematic.setAttribute('aria-hidden', 'true');
    }
  }

  function playIDISVideo(video) {
    if (!video) {
      return Promise.reject(
        new Error('IDIS_VIDEO_ELEMENT_MISSING')
      );
    }

    prepareIDISCinematicVideo(video);

    const promise = video.play();

    return promise &&
      typeof promise.then === 'function'
      ? promise
      : Promise.resolve();
  }

  function showIDISCinematicShell() {
    if (!idisCinematic) return;

    idisCinematic.classList.remove(
      'cinematic-hidden',
      'cinematic-exit'
    );

    idisCinematic.setAttribute('aria-hidden', 'false');
  }

  function scheduleIDISBackdropFade() {
    if (idisBackdropTimer) {
      clearTimeout(idisBackdropTimer);
      idisBackdropTimer = null;
    }

    if (!idisCinematicBackdrop) return;

    // Always begin a new IDIS presentation fully transparent.
    idisCinematicBackdrop.classList.remove('fade-in');

    idisBackdropTimer = setTimeout(() => {
      idisBackdropTimer = null;

      if (
        !active ||
        currentSide !== 'idis' ||
        !idisSequenceActive
      ) {
        return;
      }

      idisCinematicBackdrop.classList.add('fade-in');
    }, IDIS_BACKDROP_DELAY_MS);
  }

  function startIDISShowcaseVideo() {
    if (
      !active ||
      currentSide !== 'idis' ||
      !idisSequenceActive
    ) {
      return;
    }

    idisSequencePhase = 'showcase';
    showIDISCinematicShell();

    if (!idisShowcaseVideo) {
      launchIDISFeatureSegment();
      return;
    }

    safeResetIDISVideo(idisShowcaseVideo);

    initIDISAlphaRenderer();
    showIDISAlphaSurface();

    playIDISVideo(idisShowcaseVideo)
      .then(() => {
        startIDISAlphaRenderLoop();

        // Count the requested 6 seconds from successful video playback,
        // not from coin recognition or network loading.
        scheduleIDISBackdropFade();
      })
      .catch(error => {
      console.warn(
        'IDIS transparent showcase could not play:',
        error
      );

        launchIDISFeatureSegment();
      });
  }

  function freezeIDISShowcaseFinalFrame() {
    if (!idisShowcaseVideo) return;

    try { idisShowcaseVideo.pause(); } catch (_) {}

    // Keep the final image on screen. Seeking just before duration prevents
    // black-frame behavior on some mobile browsers.
    try {
      if (
        Number.isFinite(idisShowcaseVideo.duration) &&
        idisShowcaseVideo.duration > 0.08
      ) {
        idisShowcaseVideo.currentTime =
          Math.max(
            0,
            idisShowcaseVideo.duration - 0.04
          );
      }
    } catch (_) {}

    // Render the final decoded frame into the transparent canvas and stop
    // the render loop. The frozen canvas remains underneath the logo/YouTube.
    freezeIDISAlphaSurface();
  }

  function initializeIDISYouTubePlayer() {
    if (
      idisYouTubePlayer ||
      !idisFeatureYouTubeHost ||
      !window.YT ||
      typeof window.YT.Player !== 'function'
    ) {
      return;
    }

    idisYouTubePlayer = new YT.Player(
      idisFeatureYouTubeHost,
      {
        width: '100%',
        height: '100%',
        videoId: IDIS_YOUTUBE_VIDEO_ID,

        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          origin: window.location.origin,
          widget_referrer: window.location.href
        },

        events: {
          onReady: event => {
            idisYouTubeReady = true;

            try {
              const iframe =
                event.target.getIframe();

              iframe.setAttribute(
                'allow',
                'autoplay; encrypted-media; picture-in-picture'
              );

              iframe.setAttribute(
                'referrerpolicy',
                'strict-origin-when-cross-origin'
              );

              iframe.setAttribute(
                'playsinline',
                ''
              );

              event.target.mute();
              event.target.cueVideoById(
                IDIS_YOUTUBE_VIDEO_ID
              );
            } catch (_) {}

            if (idisYouTubePendingPlay) {
              playIDISYouTubeFeature();
            }
          },

          onStateChange: event => {
            if (!window.YT) return;

            if (
              event.data === YT.PlayerState.PLAYING
            ) {
              if (idisYouTubeStartTimeout) {
                clearTimeout(
                  idisYouTubeStartTimeout
                );
                idisYouTubeStartTimeout = null;
              }
            }

            if (
              event.data === YT.PlayerState.ENDED
            ) {
              handleIDISFeatureEnded();
            }
          },

          onError: event => {
            console.warn(
              'IDIS YouTube player error:',
              event.data
            );

            if (
              idisSequenceActive &&
              (
                idisSequencePhase === 'logo' ||
                idisSequencePhase === 'feature'
              )
            ) {
              finishIDISCinematicSequence();
            }
          }
        }
      }
    );
  }

  let idisYouTubeAPILoading = false;

  function ensureIDISYouTubeAPI() {
    if (window.YT && typeof window.YT.Player === 'function') {
      initializeIDISYouTubePlayer();
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') {
        try { previous(); } catch (_) {}
      }
      idisYouTubeAPILoading = false;
      initializeIDISYouTubePlayer();
    };

    if (idisYouTubeAPILoading) return;
    idisYouTubeAPILoading = true;

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      idisYouTubeAPILoading = false;
      console.warn('YouTube API could not load.');
    };
    document.head.appendChild(script);
  }

  function stopIDISYouTubeFeature() {
    idisYouTubePendingPlay = false;

    if (idisYouTubeStartTimeout) {
      clearTimeout(idisYouTubeStartTimeout);
      idisYouTubeStartTimeout = null;
    }

    if (
      idisYouTubePlayer &&
      typeof idisYouTubePlayer.stopVideo ===
        'function'
    ) {
      try {
        idisYouTubePlayer.stopVideo();
      } catch (_) {}
    }
  }

  function playIDISYouTubeFeature() {
    if (
      !active ||
      currentSide !== 'idis' ||
      !idisSequenceActive
    ) {
      return;
    }

    ensureIDISYouTubeAPI();

    if (
      !idisYouTubeReady ||
      !idisYouTubePlayer
    ) {
      idisYouTubePendingPlay = true;

      if (!idisYouTubeStartTimeout) {
        idisYouTubeStartTimeout =
          setTimeout(() => {
            idisYouTubeStartTimeout = null;

            if (
              idisSequenceActive &&
              idisSequencePhase === 'feature'
            ) {
              console.warn(
                'YouTube feature did not start in time.'
              );

              finishIDISCinematicSequence();
            }
          }, IDIS_YOUTUBE_START_TIMEOUT_MS);
      }

      return;
    }

    idisYouTubePendingPlay = false;

    try {
      idisYouTubePlayer.mute();

      // loadVideoById is more reliable here than seeking a previously-cued
      // iframe and then issuing a separate play command.
      idisYouTubePlayer.loadVideoById({
        videoId: IDIS_YOUTUBE_VIDEO_ID,
        startSeconds: 0
      });

      if (idisYouTubeStartTimeout) {
        clearTimeout(idisYouTubeStartTimeout);
      }

      idisYouTubeStartTimeout =
        setTimeout(() => {
          idisYouTubeStartTimeout = null;

          if (
            idisSequenceActive &&
            idisSequencePhase === 'feature'
          ) {
            let state = null;

            try {
              state =
                idisYouTubePlayer.getPlayerState();
            } catch (_) {}

            if (
              !window.YT ||
              state !== YT.PlayerState.PLAYING
            ) {
              console.warn(
                'YouTube autoplay was blocked.'
              );

              finishIDISCinematicSequence();
            }
          }
        }, IDIS_YOUTUBE_START_TIMEOUT_MS);
    } catch (error) {
      console.warn(
        'Could not start IDIS YouTube feature:',
        error
      );

      finishIDISCinematicSequence();
    }
  }

  function launchIDISFeatureSegment() {
    if (
      !active ||
      currentSide !== 'idis' ||
      !idisSequenceActive
    ) {
      return;
    }

    idisSequencePhase = 'logo';
    showIDISCinematicShell();

    if (idisFeatureOverlay) {
      idisFeatureOverlay.classList.remove(
        'cinematic-hidden',
        'logo-in',
        'video-in'
      );

      idisFeatureOverlay.setAttribute('aria-hidden', 'false');

      void idisFeatureOverlay.offsetWidth;
      idisFeatureOverlay.classList.add('logo-in');
    }

    idisFeatureStartTimer = setTimeout(() => {
      idisFeatureStartTimer = null;

      if (
        !active ||
        currentSide !== 'idis' ||
        !idisSequenceActive
      ) {
        return;
      }

      idisSequencePhase = 'feature';

      if (idisFeatureOverlay) {
        idisFeatureOverlay.classList.add('video-in');
      }

      playIDISYouTubeFeature();
    }, IDIS_LOGO_TO_FEATURE_DELAY_MS);
  }

  function handleIDISShowcaseEnded() {
    if (
      !idisSequenceActive ||
      currentSide !== 'idis'
    ) {
      return;
    }

    freezeIDISShowcaseFinalFrame();
    launchIDISFeatureSegment();
  }

  function handleIDISFeatureEnded() {
    if (
      !idisSequenceActive ||
      currentSide !== 'idis'
    ) {
      return;
    }

    stopIDISYouTubeFeature();
    finishIDISCinematicSequence();
  }

  function finishIDISCinematicSequence() {
    if (!idisSequenceActive) return;

    idisSequencePhase = 'exiting';
    hidePresentationControls();

    if (idisCinematic) {
      idisCinematic.classList.add('cinematic-exit');
    }

    idisCinematicExitTimer = setTimeout(() => {
      idisCinematicExitTimer = null;

      if (!active) return;

      clearPresentationTimer();
      hidePresentationControls();

      currentSide = null;
      oppositeVisibleSince = 0;
      resetGestureState();

      // Now that the cinematic fade has completed, remove all IDIS media.
      resetIDISCinematicSequence();

      hideScanUI();
      showEndCard('idis');
    }, IDIS_CINEMATIC_EXIT_MS);
  }

  function startIDISCinematicSequence() {
    resetIDISCinematicSequence();

    console.log(
      '[IDIS] cinematic start',
      {
        webmReady:
          !!idisShowcaseVideo &&
          idisShowcaseVideo.readyState,
        youtubeReady: idisYouTubeReady
      }
    );

    idisSequenceActive = true;
    idisSequencePhase = 'showcase';

    prepareIDISCinematicVideo(idisShowcaseVideo);
    ensureIDISYouTubeAPI();

    startIDISShowcaseVideo();
  }

  /* ------------------------------------------------------------------------
     IDIS CINEMATIC RESET
  ------------------------------------------------------------------------ */

  function removeIDISPresentation() {
    resetIDISCinematicSequence();
  }

  /* ------------------------------------------------------------------------
     SHARED INTERACTIVE SCENE CONTROLS
  ------------------------------------------------------------------------ */

  function resetGestureState() {
    pointers.clear();
    panX = 0;
    panY = 0;
    zoom = 1;
    lastInteractionAt = 0;
    returningHome = false;
  }

  function noteInteraction() {
    lastInteractionAt = performance.now();
    returningHome = false;
  }

  function pointerDistance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  function pointerMidpoint(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  }

  function beginSingleDrag(point) {
    dragStartX = point.x;
    dragStartY = point.y;
    dragStartPanX = panX;
    dragStartPanY = panY;
  }

  function beginPinch() {
    const values = [...pointers.values()];
    if (values.length < 2) return;

    const a = values[0];
    const b = values[1];
    const midpoint = pointerMidpoint(a, b);

    pinchStartDistance = Math.max(20, pointerDistance(a, b));
    pinchStartZoom = zoom;
    pinchStartMidX = midpoint.x;
    pinchStartMidY = midpoint.y;
    pinchStartPanX = panX;
    pinchStartPanY = panY;
  }

  function onPointerDown(event) {
    if (!currentSide) return;

    event.preventDefault();

    try { gestureSurface.setPointerCapture(event.pointerId); } catch (_) {}

    pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    noteInteraction();

    if (pointers.size === 1) {
      beginSingleDrag([...pointers.values()][0]);
    } else if (pointers.size === 2) {
      beginPinch();
    }
  }

  function onPointerMove(event) {
    if (!currentSide || !pointers.has(event.pointerId)) return;

    event.preventDefault();

    pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    noteInteraction();

    const values = [...pointers.values()];

    if (values.length === 1) {
      const point = values[0];

      panX = clamp(
        dragStartPanX + point.x - dragStartX,
        -window.innerWidth * 0.48,
        window.innerWidth * 0.48
      );

      panY = clamp(
        dragStartPanY + point.y - dragStartY,
        -window.innerHeight * 0.42,
        window.innerHeight * 0.42
      );
    } else if (values.length >= 2) {
      const a = values[0];
      const b = values[1];

      const distance = Math.max(20, pointerDistance(a, b));
      const midpoint = pointerMidpoint(a, b);

      zoom = clamp(
        pinchStartZoom * (distance / pinchStartDistance),
        0.58,
        2.45
      );

      // Moving both fingers together also pans the scene.
      panX = clamp(
        pinchStartPanX + midpoint.x - pinchStartMidX,
        -window.innerWidth * 0.48,
        window.innerWidth * 0.48
      );

      panY = clamp(
        pinchStartPanY + midpoint.y - pinchStartMidY,
        -window.innerHeight * 0.42,
        window.innerHeight * 0.42
      );
    }
  }

  function onPointerEnd(event) {
    if (!pointers.has(event.pointerId)) return;

    event.preventDefault();
    pointers.delete(event.pointerId);

    try { gestureSurface.releasePointerCapture(event.pointerId); } catch (_) {}

    noteInteraction();

    if (pointers.size === 1) {
      beginSingleDrag([...pointers.values()][0]);
    } else if (pointers.size >= 2) {
      beginPinch();
    }
  }

  function updateAutoHome(now) {
    if (!currentSide || pointers.size > 0 || !lastInteractionAt) return;

    if (!returningHome && now - lastInteractionAt >= HOME_DELAY_MS) {
      returningHome = true;
    }

    if (!returningHome) return;

    panX = lerp(panX, 0, 0.105);
    panY = lerp(panY, 0, 0.105);
    zoom = lerp(zoom, 1, 0.10);

    if (
      Math.abs(panX) < 0.35 &&
      Math.abs(panY) < 0.35 &&
      Math.abs(zoom - 1) < 0.002
    ) {
      panX = 0;
      panY = 0;
      zoom = 1;
      returningHome = false;
      lastInteractionAt = 0;
    }
  }

  /* ------------------------------------------------------------------------
     PRESENTATION RENDERING
  ------------------------------------------------------------------------ */

  function renderAtlanta(now) {
    const elapsed = revealStartedAt
      ? now - revealStartedAt
      : 5000;

    // Clean 1-second reveal windows:
    // FRONT:  0.0s -> 1.0s
    // MIDDLE: 1.0s -> 2.0s
    // VIDEO:  2.0s -> 3.0s
    const frontOpacity = easeOutCubic(elapsed / 1000);
    const middleOpacity = easeOutCubic((elapsed - 1000) / 1000);
    const backOpacity = easeOutCubic((elapsed - 2000) / 1000);

    const frontRevealScale = lerp(
      0.82,
      1,
      easeOutCubic(elapsed / 1000)
    );

    const longSide = Math.max(window.innerWidth, window.innerHeight);
    const baseSize = longSide * 0.92 * zoom;
    const backSize = baseSize * 1.12;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Different pan ratios create tactile parallax during drag.
    const backX = centerX + panX * 0.72;
    const backY = centerY + panY * 0.72;

    const middleX = centerX + panX * 0.94;
    const middleY =
      centerY +
      panY * 0.94 -
      (40 / 1920) * baseSize;

    const frontX = centerX + panX * 1.13;
    const frontY = centerY + panY * 1.13;

    layerBack.style.opacity = String(clamp(backOpacity, 0, 1));
    layerMiddle.style.opacity = String(clamp(middleOpacity, 0, 1));
    layerFront.style.opacity = String(clamp(frontOpacity, 0, 1));

    // Dark teal background takes over the live camera at the same time
    // as the background MP4 fades in. Tracking still uses the raw camera
    // stream underneath this visual overlay.
    if (backgroundWash) {
      backgroundWash.style.opacity =
        String(clamp(backOpacity * 0.985, 0, 0.985));
    }

    // No coin tracking is used here. All coordinates are screen-centered.
    const backZ = -95;
    const middleZ = 72;
    const frontZ = 245;

    layerBack.style.width = `${backSize}px`;
    layerBack.style.height = `${backSize}px`;

    const backTransform =
      `translate3d(${backX - backSize / 2}px, ${backY - backSize / 2}px, ${backZ}px)`;

    layerBack.style.transform = backTransform;
    layerBack.style.webkitTransform = backTransform;

    layerMiddle.style.width = `${baseSize}px`;
    layerMiddle.style.height = `${baseSize}px`;

    const middleTransform =
      `translate3d(${middleX - baseSize / 2}px, ${middleY - baseSize / 2}px, ${middleZ}px)`;

    layerMiddle.style.transform = middleTransform;
    layerMiddle.style.webkitTransform = middleTransform;

    layerFront.style.width = `${baseSize}px`;
    layerFront.style.height = `${baseSize}px`;

    const frontTransform =
      `translate3d(${frontX - baseSize / 2}px, ${frontY - baseSize / 2}px, ${frontZ}px) scale(${frontRevealScale})`;

    layerFront.style.transform = frontTransform;
    layerFront.style.webkitTransform = frontTransform;

    // Subtle user-driven depth angle. It is tied to DRAG position,
    // not the physical coin.
    if (overlayStage) {
      const gestureRX = clamp(
        -(panY / Math.max(1, window.innerHeight)) * 7,
        -3.5,
        3.5
      );

      const gestureRY = clamp(
        (panX / Math.max(1, window.innerWidth)) * 8,
        -4,
        4
      );

      // Full phone orientation enhancement:
      // phoneTilt.x = up/down pitch
      // phoneTilt.y = left/right yaw
      const phoneTilt = updatePhoneTilt();

      const rx = clamp(
        gestureRX + phoneTilt.x,
        -9.0,
        9.0
      );

      const ry = clamp(
        gestureRY + phoneTilt.y,
        -10.0,
        10.0
      );

      const stageTransform =
        `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;

      overlayStage.style.transform = stageTransform;
      overlayStage.style.webkitTransform = stageTransform;
    }
  }

  function renderIDISFeature(now) {
    if (!idisFeatureStage) return;

    /*
      Match the Atlanta interaction language:
      - drag contributes to X/Y rotation
      - phone motion contributes to X/Y rotation
      - pinch contributes a restrained overall zoom
      - separate planes use different pan ratios + Z depth
    */

    const gestureRX = clamp(
      -(panY / Math.max(1, window.innerHeight)) * 7,
      -3.5,
      3.5
    );

    const gestureRY = clamp(
      (panX / Math.max(1, window.innerWidth)) * 8,
      -4,
      4
    );

    const phoneTilt = updatePhoneTilt();

    const rx = clamp(
      gestureRX + phoneTilt.x,
      -9.0,
      9.0
    );

    const ry = clamp(
      gestureRY + phoneTilt.y,
      -10.0,
      10.0
    );

    // Keep pinch useful without allowing the embedded video to become huge.
    const sceneScale = clamp(
      1 + (zoom - 1) * 0.18,
      0.90,
      1.28
    );

    const stageTransform =
      `rotateX(${rx.toFixed(3)}deg) ` +
      `rotateY(${ry.toFixed(3)}deg) ` +
      `scale(${sceneScale.toFixed(4)})`;

    idisFeatureStage.style.transform =
      stageTransform;

    idisFeatureStage.style.webkitTransform =
      stageTransform;

    /*
      The logo is the foreground-most layer and therefore gets:
      - the largest lateral parallax
      - the largest vertical parallax
      - the greatest translateZ depth

      YouTube stays deeper and moves less.
    */
    if (idisFeatureVideoLayer) {
      const videoX = panX * 0.16;
      const videoY = panY * 0.16;

      const videoTransform =
        `translate3d(${videoX.toFixed(2)}px, ` +
        `${videoY.toFixed(2)}px, 70px)`;

      idisFeatureVideoLayer.style.transform =
        videoTransform;

      idisFeatureVideoLayer.style.webkitTransform =
        videoTransform;
    }

    if (idisFeatureLogoLayer) {
      const logoX = panX * 0.48;
      const logoY = panY * 0.48;

      const logoTransform =
        `translate3d(${logoX.toFixed(2)}px, ` +
        `${logoY.toFixed(2)}px, 320px)`;

      idisFeatureLogoLayer.style.transform =
        logoTransform;

      idisFeatureLogoLayer.style.webkitTransform =
        logoTransform;
    }
  }

  function renderPresentation(now = performance.now()) {
    if (!active || !currentSide) {
      presentationRAF = 0;
      return;
    }

    updateAutoHome(now);

    if (currentSide === 'atlanta') {
      renderAtlanta(now);
    } else if (currentSide === 'idis') {
      renderIDISFeature(now);
    }

    presentationRAF =
      requestAnimationFrame(renderPresentation);
  }

  /* ------------------------------------------------------------------------
     OPPOSITE FACE WATCHER

     targetFound remains the primary switch trigger. This second path watches
     MindAR's target entity visibility so an opposite face can interrupt the
     detached 30-second presentation even on phones where a second targetFound
     callback is slow or inconsistent.

     maxTrack:2 is enabled on the scene.
  ------------------------------------------------------------------------ */

  function stopSwitchWatcher() {
    cancelAnimationFrame(switchWatcherRAF);
    switchWatcherRAF = 0;
    oppositeVisibleSince = 0;
  }

  function startSwitchWatcher() {
    stopSwitchWatcher();

    const watch = now => {
      if (!active) {
        switchWatcherRAF = 0;
        return;
      }

      if (!currentSide) {
        oppositeVisibleSince = 0;
        switchWatcherRAF = requestAnimationFrame(watch);
        return;
      }

      const oppositeSide =
        currentSide === 'atlanta'
          ? 'idis'
          : 'atlanta';

      const oppositeTarget =
        oppositeSide === 'atlanta'
          ? atlantaTarget
          : idisTarget;

      const oppositeVisible =
        !!(
          oppositeTarget &&
          oppositeTarget.object3D &&
          oppositeTarget.object3D.visible
        );

      if (oppositeVisible) {
        if (!oppositeVisibleSince) {
          oppositeVisibleSince = now;
        }

        if (now - oppositeVisibleSince >= OPPOSITE_FACE_HOLD_MS) {
          oppositeVisibleSince = 0;
          beginPresentation(oppositeSide);
        }
      } else {
        oppositeVisibleSince = 0;
      }

      switchWatcherRAF = requestAnimationFrame(watch);
    };

    switchWatcherRAF = requestAnimationFrame(watch);
  }

  /* ------------------------------------------------------------------------
     30 SECOND PRESENTATION SESSION
  ------------------------------------------------------------------------ */

  function clearPresentationTimer() {
    if (presentationTimeout) {
      clearTimeout(presentationTimeout);
      presentationTimeout = null;
    }

    cancelAnimationFrame(countdownRAF);
    countdownRAF = 0;
  }

  function updateCountdown() {
    if (!currentSide || !presentationDeadline) {
      countdownRAF = 0;
      return;
    }

    const remaining = Math.max(
      0,
      presentationDeadline - performance.now()
    );

    presentationSeconds.textContent =
      String(Math.ceil(remaining / 1000));

    if (remaining > 0) {
      countdownRAF =
        requestAnimationFrame(updateCountdown);
    } else {
      countdownRAF = 0;
    }
  }

  function startPresentationTimer() {
    clearPresentationTimer();

    presentationStartedAt = performance.now();
    presentationDeadline =
      presentationStartedAt + PRESENTATION_MS;

    presentationSeconds.textContent = '30';

    presentationTimeout = setTimeout(() => {
      presentationTimeout = null;
      endPresentationToScan();
    }, PRESENTATION_MS);

    countdownRAF =
      requestAnimationFrame(updateCountdown);
  }

  function hideAllPresentations(options = {}) {
    cancelAnimationFrame(presentationRAF);
    presentationRAF = 0;

    hideAtlantaPresentation();

    if (!options.keepIDISCinematic) {
      removeIDISPresentation();
    }
  }

  function finishEndCardToScan() {
    hideEndCard();

    currentSide = null;
    oppositeVisibleSince = 0;
    resetGestureState();

    const timerChip =
      presentationSeconds &&
      presentationSeconds.closest('.presentation-timer');

    if (timerChip) {
      timerChip.style.display = '';
    }

    // Camera + MindAR stay live underneath.
    setARUI(true);
    showScanUI('SCAN COIN NOW');
  }

  function endPresentationToScan() {
    clearPresentationTimer();

    const endingSide = currentSide || 'atlanta';

    // Hide the interactive content but do NOT return to scan yet.
    hideAllPresentations();
    hidePresentationControls();

    // During the end card, prevent the switch watchdog from changing scenes.
    currentSide = null;
    oppositeVisibleSince = 0;
    resetGestureState();

    // Hide scanner HUD and let the end card own the screen.
    hideScanUI();

    showEndCard(
      endingSide === 'idis'
        ? 'idis'
        : 'atlanta'
    );
  }

  function beginPresentation(side) {
    if (!active || endCardActive) return;

    // If the same face is recognized again during its 30-second session,
    // do nothing. It does NOT restart the timer.
    if (currentSide === side) return;

    // A DIFFERENT face immediately cuts the previous timer short.
    clearPresentationTimer();
    hideAllPresentations();

    currentSide = side;
    oppositeVisibleSince = 0;
    resetGestureState();

    // Re-zero from the latest LIVE sensor sample for every unlocked scene.
    // This works on the first scan and all subsequent scans.
    resetPhoneTiltNeutral();

    hideScanUI();
    showPresentationControls();

    const timerChip =
      presentationSeconds &&
      presentationSeconds.closest('.presentation-timer');

    if (side === 'atlanta') {
      // Atlanta remains the existing 30-second interactive experience.
      if (timerChip) {
        timerChip.style.display = '';
      }

      showAtlantaPresentation();
      startPresentationTimer();
    } else {
      // IDIS duration is driven by its media sequence.
      clearPresentationTimer();

      if (timerChip) {
        timerChip.style.display = 'none';
      }

      // Run the detached IDIS cinematic sequence plus the live preserve-3D
      // phone/drag parallax render loop.
      removeIDISPresentation();
      startIDISCinematicSequence();
      renderPresentation();
    }
  }

  function foundAtlanta() {
    // Scanner mode -> Atlanta begins.
    // IDIS presentation -> Atlanta immediately replaces it.
    // Atlanta already showing -> ignore.
    beginPresentation('atlanta');
  }

  function foundIDIS() {
    // Scanner mode -> IDIS begins.
    // Atlanta presentation -> IDIS immediately replaces it.
    // IDIS already showing -> ignore.
    beginPresentation('idis');
  }

  // IMPORTANT:
  // targetLost intentionally does NOTHING while a presentation is active.
  // Once the coin has unlocked the scene, the scene is independent.
  function lostAtlanta() {}
  function lostIDIS() {}

  /* ------------------------------------------------------------------------
     START / STOP AR
  ------------------------------------------------------------------------ */

  async function startAR() {
    if (starting || active) return;

    // Request motion access while we are still inside the user's Start AR tap.
    // On Android this usually resolves without a prompt; on iPhone Safari
    // this is where iOS may ask for Motion & Orientation access.
    if (!motionTiltEnabled) {
      try {
        await enablePhoneTilt();
      } catch (_) {}
    }

    // Capture the current field and remember it for future visits.
    if (guestNameInput) {
      saveGuestName(guestNameInput.value);
    }

    // Do not start large media downloads during camera initialization.
    // They warm in the background only after the live camera is ready.

    starting = true;
    const myToken = ++sessionToken;

    hideError();
    hideEndCard();
    clearPresentationTimer();
    hideAllPresentations();
    hidePresentationControls();
    currentSide = null;
    resetGestureState();

    try {
      const targetReady = await verifyTargetFile();

      if (!targetReady) {
        showError(
          'Tracking file is missing.',
          'Keep gsx2026-two-sided.mind inside assets/targets/.',
          'TARGET FILE MISSING'
        );
        return;
      }

      intro.classList.add('hidden');
      setARUI(true);
      showScanUI('STARTING CAMERA');
      watchForCameraVideo();

      arSystem = await waitForSceneSystem();

      if (myToken !== sessionToken) return;

      install4KCameraPatch(arSystem);

      await Promise.resolve(arSystem.start());
      const cameraVideo = await waitForLiveCamera();

      if (myToken !== sessionToken) return;

      active = true;
      styleCameraVideos();
      startSwitchWatcher();

      const actualW = cameraVideo.videoWidth || 0;
      const actualH = cameraVideo.videoHeight || 0;

      showScanUI(`CAMERA READY • ${actualW} × ${actualH}`);
      scheduleMediaWarmup();

      setTimeout(() => {
        if (
          active &&
          myToken === sessionToken &&
          !currentSide
        ) {
          showScanUI('SCAN COIN NOW');
        }
      }, 1100);
    } catch (error) {
      console.error(error);

      showError(
        'Camera could not start.',
        'Allow camera permission, close other camera apps, then try again.',
        'CAMERA ERROR'
      );
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
    currentSide = null;

    hideEndCard();
    clearPresentationTimer();
    hideAllPresentations();
    hidePresentationControls();
    stopSwitchWatcher();
    disablePhoneTilt();
    resetGestureState();

    hideError();
    stopWatchingCamera();

    try {
      if (!arSystem && scene.systems) {
        arSystem =
          scene.systems['mindar-image-system'];
      }

      if (arSystem) {
        await Promise.resolve(arSystem.stop());
      }
    } catch (_) {}

    stopAllCameraTracks();

    status.classList.remove('locked', 'error');
    status.classList.add('hidden');
    guide.classList.add('hidden');
    sideChip.classList.add('hidden');

    setARUI(false);
    intro.classList.remove('hidden');
  }

  /* ------------------------------------------------------------------------
     EVENTS
  ------------------------------------------------------------------------ */

  // IDIS cinematic media events.
  if (idisShowcaseVideo) {
    prepareIDISCinematicVideo(idisShowcaseVideo);

    idisShowcaseVideo.addEventListener(
      'loadedmetadata',
      () => {
        initIDISAlphaRenderer();
        sizeIDISAlphaCanvas();
      }
    );

    idisShowcaseVideo.addEventListener(
      'seeked',
      () => {
        if (
          idisSequenceActive &&
          (
            idisSequencePhase === 'logo' ||
            idisSequencePhase === 'feature'
          )
        ) {
          renderIDISAlphaFrame();
          freezeIDISAlphaSurface();
        }
      }
    );
    idisShowcaseVideo.addEventListener(
      'ended',
      handleIDISShowcaseEnded
    );

    idisShowcaseVideo.addEventListener('error', () => {
      if (
        idisSequenceActive &&
        idisSequencePhase === 'showcase'
      ) {
        console.warn('IDIS showcase source error.');
        launchIDISFeatureSegment();
      }
    });
  }

  // Restore remembered visitor name on page load.
  loadRememberedGuestName();

  if (guestNameInput) {
    guestNameInput.addEventListener('change', () => {
      saveGuestName(guestNameInput.value);
    });

    guestNameInput.addEventListener('blur', () => {
      saveGuestName(guestNameInput.value);
    });

    guestNameInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveGuestName(guestNameInput.value);
        guestNameInput.blur();
      }
    });
  }

  scene.addEventListener('loaded', () => {
    arSystem = scene.systems['mindar-image-system'];
    forceTransparentRenderer();
    hideAtlantaPresentation();
  });

  scene.addEventListener('renderstart', () => {
    forceTransparentRenderer();
    styleCameraVideos();
  });

  scene.addEventListener('arReady', () => {
    if (active && !currentSide) {
      showScanUI('SCAN COIN NOW');
    }
  });

  atlantaTarget.addEventListener(
    'targetFound',
    foundAtlanta
  );

  atlantaTarget.addEventListener(
    'targetLost',
    lostAtlanta
  );

  idisTarget.addEventListener(
    'targetFound',
    foundIDIS
  );

  idisTarget.addEventListener(
    'targetLost',
    lostIDIS
  );

  gestureSurface.addEventListener(
    'pointerdown',
    onPointerDown,
    { passive: false }
  );

  gestureSurface.addEventListener(
    'pointermove',
    onPointerMove,
    { passive: false }
  );

  gestureSurface.addEventListener(
    'pointerup',
    onPointerEnd,
    { passive: false }
  );

  gestureSurface.addEventListener(
    'pointercancel',
    onPointerEnd,
    { passive: false }
  );

  startButton.addEventListener('click', startAR);
  retryButton.addEventListener('click', startAR);

  closeButton.addEventListener(
    'pointerup',
    stopAR,
    { passive: false }
  );

  closeButton.addEventListener(
    'touchend',
    stopAR,
    { passive: false }
  );

  closeButton.addEventListener(
    'click',
    stopAR
  );

  errorClose.addEventListener(
    'click',
    hideError
  );

  window.addEventListener('pagehide', () => {
    ++sessionToken;
    active = false;
    currentSide = null;

    hideEndCard();
    clearPresentationTimer();
    hideAllPresentations();
    hidePresentationControls();
    stopSwitchWatcher();
    disablePhoneTilt();

    try {
      if (arSystem) arSystem.stop();
    } catch (_) {}

    stopAllCameraTracks();
  });
});
