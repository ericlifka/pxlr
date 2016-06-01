SM.DefineModule('pxlr/gl/webgl', function (require) {
  var Frame = require('pxlr/gl/frame');
  var DomHelpers = require('pxlr/gl/dom-helpers');

  function createCanvas() {

  }

  return SM.DefineClass([ DomHelpers, {
    width: 80,
    height: 50,
    pixelSize: 1,

    constructor: function (options) {
      this.canvasSetup(options || { });
    },

    newRenderFrame: function () {

    },
    renderFrame: function () {

    },
    setFillColor: function (fillColor) {

    }
  }]);
});
