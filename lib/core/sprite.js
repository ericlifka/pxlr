SM.DefineModule('pxlr/core/sprite', function (require) {
    const CellGrid = require('pxlr/core/cell-grid');

    const Sprite = SM.DefineClass([CellGrid, {
        finished: true,
        constructor(pixels, meta) {
            this.meta = meta || {};
            this.width = pixels.length;
            this.height = pixels[ 0 ].length;
            this.offsetAdjustment = { x: 0, y: 0 };

            this.cells = [];
            for (let x = 0; x < this.width; x++) {
                this.cells[ x ] = [];
                for (let y = 0; y < this.height; y++) {
                    this.cells[ x ][ y ] = {
                        x: x,
                        y: y,
                        color: pixels[ x ][ y ]
                    };
                }
            }
        },
        setPermanentOffset(offset) {
            offset = offset || { };
            this.offsetAdjustment.x = offset.x || 0;
            this.offsetAdjustment.y = offset.y || 0;

            return this;
        },
        applyColor(color) {
            this.iterateCells(cell => {
                if (cell.color) {
                    cell.color = color;
                }
            });

            return this;
        },
        update(dtime) {
            /*
             sprites ignore updates by default, but accept the event
             so that the api signature of sprites and animations matches
             */
        },
        renderToFrame(frame, x, y, index) {
            index = index || 0;
            let offset_x = this.offsetAdjustment.x;
            let offset_y = this.offsetAdjustment.y;
            this.iterateCells((cell, _x, _y) => {
                if (cell.color) {
                    let frameCell = frame.cellAt(x + _x + offset_x, y + _y + offset_y);
                    if (index >= frameCell.index) {
                        frameCell.color = cell.color;
                        frameCell.index = index;
                    }
                }
            });
        },
        clone() {
            let colorGrid = [];
            for (let x = 0; x < this.width; x++) {
                colorGrid[ x ] = [];
                for (let y = 0; y < this.height; y++) {
                    colorGrid[ x ][ y ] = this.cells[ x ][ y ].color;
                }
            }

            let sprite = new Sprite(colorGrid);
            sprite.setPermanentOffset(this.offsetAdjustment);

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
                    newCells[ y ][ width - x - 1 ] = {
                        x: y,
                        y: width - x - 1,
                        color: oldCells[ x ][ y ].color
                    };
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
        }
    }]);

    return Sprite;
});
