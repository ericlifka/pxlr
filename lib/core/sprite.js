SM.DefineModule('pxlr/core/sprite', function (require) {
  const CellGrid = require('pxlr/core/cell-grid');
  const RGBColor = require('pxlr/core/RGB-color');

  const Sprite = SM.DefineClass([CellGrid, {
    finished: true,
    constructor({ defaultColor=RGBColor, offsetAdjustment={x:0, y:0} }={}) {
      this.meta = { defaultColor, offsetAdjustment };

      this.width = 0;
      this.height = 0;
      this.cells = null;
    },
    setPermanentOffset({x=0, y=0}={}) {
      this.meta.offsetAdjustment = { x, y };

      return this;
    },
    applyColor(colorCode) {
      this.iterateCells(color =>
        color.setFromHex(colorCode));

      return this;
    },
    update(dtime) {
      /*
      sprites ignore updates by default, but accept the event
      so that the api signature of sprites and animations matches
      */
    },
    renderToFrame(frame, x=0, y=0, index=0) {
      let offset_x = this.meta.offsetAdjustment.x;
      let offset_y = this.meta.offsetAdjustment.y;
      this.iterateCells((color, _x, _y) => {
        if (color && !color.clear) {
          let frameColor = frame.cellAt(x + _x + offset_x, y + _y + offset_y);
          if (index >= frameColor.index) {
            frameColor.copyFromColor(color);
            frameColor.index = index;
          }
        }
      });
    },
    clone() {
      let colorGrid = [];
      for (let x = 0; x < this.width; x++) {
        colorGrid[ x ] = [];
        for (let y = 0; y < this.height; y++) {
          colorGrid[ x ][ y ] = this.cells[ x ][ y ].clone();
        }
      }

      let sprite = new Sprite(this.meta);
      sprite.cells = colorGrid;

      return sprite;
    },
    rotateLeft() {
      let width = this.width;
      let height = this.height;
      let oldCells = this.cells;
      let newCells = [];
      let x, y;

      for (x = 0; x < height; x++) {
        newCells[ x ] = [];
      }

      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          newCells[ y ][ width - x - 1 ] = oldCells[ x ][ y ];
        }
      }

      this.width = height;
      this.height = width;
      this.cells = newCells;
      return this;
    },
    rotateRight() {
      return this
        .rotateLeft()
        .rotateLeft()
        .rotateLeft();
    },
    invertX() {
      for (let x = 0; x < this.width / 2; x++) {
        let left = this.cells[ x ];
        let right = this.cells[ this.width - x - 1 ];
        this.cells[ x ] = right;
        this.cells[ this.width - x - 1 ] = left;
      }
      return this;
    },
    invertY() {
      for (let x = 0; x < this.width; x++) {
        this.cells[ x ].reverse();
      }
      return this;
    },

    _buildEmptySheet({ width, height }) {
      this.width = width;
      this.height = height;
      this.cells = [ ];
      let Color = this.meta.defaultColor;

      for (let x = 0; x < width; x++) {
        this.cells[ x ] = [ ];
        for (let y = 0; y < height; y++) {
          this.cells[ x ][ y ] = new Color(0, 0, 0);
        }
      }
    }
  }]);

  Sprite.newEmptySprite = function ({ width=1, height=1, meta={} }) {
    let sprite = new Sprite(meta);
    sprite._buildEmptySheet({ width, height });

    return sprite;
  };

  Sprite.newFromColorSheet = function ({ pixels, meta={} }) {
    let height = pixels.length;
    let width = pixels[0].length;
    let sprite = new Sprite(meta);
    sprite._buildEmptySheet({ height, width });

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        sprite.cellAt(w, height - h - 1).setFromHex(pixels[ h ][ w ]);
      }
    }

    return sprite;
  };

  return Sprite;
});
