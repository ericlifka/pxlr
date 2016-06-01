SM.DefineModule('pxlr/gl/canvas', function (require) {
  var Frame = require('pxlr/gl/frame');
  var DomHelpers = require('pxlr/gl/dom-helpers');

  return SM.DefineClass([ DomHelpers, {
    width: 80,
    height: 50,
    pixelSize: 1,
    nextFrame: 0,

    constructor: function (options) {
      this.canvasSetup(options || { });

      this.canvasDrawContext = this.canvas.getContext("2d", { alpha: false });
      this.frames = [
        new Frame(this),
        new Frame(this)
      ];
    },

    newRenderFrame: function () {
      return this.frames[ this.nextFrame ];
    },
    renderFrame: function () {
      var frame = this.frames[ this.nextFrame ];
      var pixelSize = this.pixelSize;
      var ctx = this.canvasDrawContext;
      var fillColor = frame.fillColor;

      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, this.fullWidth, this.fullHeight);

      frame.iterateCells(function (cell, x, y) {
        if (cell.color !== fillColor) {
          ctx.beginPath();
          ctx.rect(cell.render_x, cell.render_y, pixelSize, pixelSize);
          ctx.fillStyle = cell.color;
          ctx.fill();
          ctx.closePath();
        }
      });

      this.nextFrame = +!this.nextFrame; // switch the frames
    },
    setFillColor: function (fillColor) {
      this.frames.forEach(function (frame) {
        frame.setFillColor(fillColor);
      });
    }
  }]);
});
