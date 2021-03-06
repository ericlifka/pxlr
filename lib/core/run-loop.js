SM.DefineModule('pxlr/core/run-loop', function (require) {
  var fpsCounterDOM = null;

  function updateFPScounter(dtime) {
    if (!fpsCounterDOM) {
      fpsCounterDOM = document.createElement('div');
      fpsCounterDOM.classList.add('fps-counter');
      fpsCounterDOM.oldfps = 0;
      document.body.appendChild(fpsCounterDOM);
    }

    var fps = Math.floor(1000 / dtime * 10) / 10;
    if (Math.abs(fps - fpsCounterDOM.oldfps) > .2) {
      fpsCounterDOM.oldfps = fps;
      fps = fps + "";
      fps += (fps.length <= 2 ? ".0" : "") + " fps";
      fpsCounterDOM.innerHTML = fps;
    }
  }

  function now() {
    return (new Date()).valueOf();
  }

  function fpsTracker() {
    var frameTimes = [];

    for (var i = 0; i < 100; i++) {
      frameTimes.push(20);
    }
    frameTimes.totalTime = 20 * 100;

    frameTimes.push = function (ftime) {
      var overflow = this.shift();
      this.totalTime += ftime - overflow;
      return Array.prototype.push.call(this, ftime);
    };
    frameTimes.average = function () {
      return this.totalTime / this.length;
    };

    return frameTimes;
  }

  return SM.DefineClass([ {
    constructor(callback) {
      this.callback = callback || (() => null);

      this.fpsTracker = fpsTracker();
      this.active = false;
      this.lastFrameTime = now();
      this.boundFrameHandler = this.frameHandler.bind(this);
    },
    frameHandler() {
      if (!this.active) return;

      let currentTime = now();
      let dtime = currentTime - this.lastFrameTime;

      this.lastFrameTime = currentTime;
      this.updateFPScounter(dtime);

      try {
        this.callback(dtime);
      } catch (e) {
        console.error('Error running frame: ', e);
      }

      window.requestAnimationFrame(this.boundFrameHandler);
    },
    start() {
      if (!this.active) {
        this.active = true;
        window.requestAnimationFrame(this.boundFrameHandler);
      }
    },
    stop() {
      this.active = false;
    },
    addCallback(callback) {
      this.callback = callback;
    },
    updateFPScounter(dtime) {
      this.fpsTracker.push(dtime);

      updateFPScounter(this.fpsTracker.average());
    }
  } ]);
});
