SM.DefineModule('pxlr/gl/frame', function (require) {
  const CellGrid = require('pxlr/core/cell-grid');
  const Color = require('pxlr/core/RGB-color');

  return SM.DefineClass([CellGrid, {
    constructor: function (dimensions) {
      this.width = dimensions.width;
      this.height = dimensions.height;
      this.cells = [];

      for (let x = 0; x < this.width; x++) {
        this.cells[ x ] = [];

        for (let y = 0; y < this.height; y++) {
          let color = new Color(0, 0, 0);
          color.x = x;
          color.y = y;
          color.render_x = x * dimensions.pixelSize;
          color.render_y = y * dimensions.pixelSize;
          color.index = -1;
          this.cells[ x ][ y ] = color;
        }
      }
    },
    clear: function () {
      let color = this.fillColor || "#000000";
      if (color) {
        this.iterateCells(function (cell) {
          cell.setFromHex(color);
          cell.index = -1;
        });
      }
    },
    setFillColor: function (fillColor) {
      this.fillColor = fillColor;
    }
  }]);
});
