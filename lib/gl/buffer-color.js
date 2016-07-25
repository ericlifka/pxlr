SM.DefineModule('pxlr/gl/buffer-color', function (require) {
  return SM.DefineClass([{
    constructor(vertexGroup, colorBufferOffset) {
      this.vertexGroup = vertexGroup;
      this.colorBufferOffset = colorBufferOffset;

      this.r = 0.0;
      this.g = 0.0;
      this.b = 0.0;
      this.opacity = 1.0;
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
    }
  }]);
});
