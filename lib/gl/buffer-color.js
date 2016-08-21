SM.DefineModule('pxlr/gl/buffer-color', function (require) {
  return SM.DefineClass([{
    constructor(vertexGroup, colorBufferOffset) {
      this.vertexGroup = vertexGroup;
      this.colorBufferOffset = colorBufferOffset;

      this.r = 0.0;
      this.g = 0.0;
      this.b = 0.0;
      this.opacity = 1.0;
      this.index = -1;
    },

    setR(newR) {
      this.r = newR;
      this.updateColorBuffers(newR, 0);
    },

    setG(newG) {
      this.g = newG;
      this.updateColorBuffers(newG, 1);
    },

    setB(newB) {
      this.b = newB;
      this.updateColorBuffers(newB, 2);
    },

    updateColorBuffers(colorValue, offset) {
      for (let index = offset; index <= 14; index += 4) {
        this.vertexGroup.generatedColors[ this.colorBufferOffset + index ] = colorValue;
      }
    },

    copyFromColor(color) {
      let r = color.getR();
      let g = color.getG();
      let b = color.getB();

      this.setR( r / 255.0 );
      this.setG( g / 255.0 );
      this.setB( b / 255.0 );
    }
  }]);
});
