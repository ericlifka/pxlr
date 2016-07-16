SM.DefineModule('pxlr/gl/dom-helpers', function () {
  return {
    canvasSetup: function (options) {
      this.container = options.container || document.body;
      this.width = options.width || this.width;
      this.height = options.height || this.height;

      this.calculateMaximumPixelSize();
      this.createCanvasElement();
      this.createGl();
    },

    createCanvasElement: function () {
      this.canvas = document.createElement('canvas');

      this.canvas.width = this.fullWidth;
      this.canvas.height = this.fullHeight;
      this.canvas.classList.add('pxlr-canvas');

      this.container.appendChild(this.canvas);
    },

    calculateMaximumPixelSize: function () {
      var maxWidth = window.innerWidth;
      var maxHeight = window.innerHeight;
      var width = this.width;
      var height = this.height;
      var pixelSize = 1;

      while (true) {
        if (width * pixelSize > maxWidth || height * pixelSize > maxHeight) {
          pixelSize--;
          break;
        }

        pixelSize++;
      }

      if (pixelSize <= 0) {
        pixelSize = 1;
      }

      this.pixelSize = pixelSize;
      this.fullWidth = width * pixelSize;
      this.fullHeight = height * pixelSize;
    },

    createGl: function () {
      this.gl = this.canvas.getContext("webgl");
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
      this.gl.clearDepth(1.0);                 // Clear everything
      this.gl.enable(gl.DEPTH_TEST);           // Enable depth testing
      this.gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    }
  };
});
