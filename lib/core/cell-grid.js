SM.DefineModule('pxlr/core/cell-grid', function (require) {
  const Color = require('pxlr/core/RGB-color');

  return SM.DefineClass([ {
    iterateCells(handler) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          handler(this.cellAt(x, y), x, y);
        }
      }
    },

    cellAt(x, y) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        return this.cells[ x ][ y ];
      }
      else {
        return this.emptyCell();
      }
    },

    emptyCell() {
      let color = new Color();
      color.x = -1;
      color.y = -1;
      color.index = -1;
      return color;
    }
  } ]);
});
