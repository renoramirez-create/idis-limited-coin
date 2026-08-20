/* IDIS high-quality rear-camera preference for MindAR A-Frame. */
window.IDIS_HQ_CAMERA = (() => {
  'use strict';
  const preferred = {
    audio:false,
    video:{
      facingMode:{ideal:'environment'},
      width:{ideal:1920},
      height:{ideal:1080},
      frameRate:{ideal:30,max:30}
    }
  };
  const fallback = {audio:false, video:{facingMode:'environment'}};

  function patch(arSystem) {
    if (!arSystem || arSystem.__idisHQPatched) return;
    arSystem._startVideo = function() {
      this.video = document.createElement('video');
      this.video.setAttribute('autoplay','');
      this.video.setAttribute('muted','');
      this.video.setAttribute('playsinline','');
      this.video.style.position='absolute';
      this.video.style.top='0px';
      this.video.style.left='0px';
      this.video.style.zIndex='-2';
      this.container.appendChild(this.video);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.el.emit('arError',{error:'VIDEO_FAIL'});
        if (this.ui && this.ui.showCompatibility) this.ui.showCompatibility();
        return;
      }

      const startStream = (constraints, isFallback=false) => {
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          const track = stream.getVideoTracks()[0];
          const settings = track && track.getSettings ? track.getSettings() : {};
          console.info('IDIS camera stream', {fallback:isFallback, ...settings});
          this.video.addEventListener('loadedmetadata', () => {
            this.video.setAttribute('width', this.video.videoWidth);
            this.video.setAttribute('height', this.video.videoHeight);
            document.documentElement.dataset.cameraResolution = `${this.video.videoWidth}x${this.video.videoHeight}`;
            this._startAR();
          }, {once:true});
          this.video.srcObject = stream;
        }).catch(err => {
          if (!isFallback) {
            console.warn('1080p preference unavailable; using browser default rear camera.', err);
            startStream(fallback,true);
            return;
          }
          console.error('getUserMedia error', err);
          this.el.emit('arError',{error:'VIDEO_FAIL'});
        });
      };
      startStream(preferred,false);
    };
    arSystem.__idisHQPatched = true;
    console.info('IDIS HQ camera patch installed');
  }
  return {patch};
})();
