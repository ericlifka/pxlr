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
      this.vertexGroup.generatedColors[ this.colorBufferOffset ] = newR;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 4 ] = newR;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 8 ] = newR;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 12 ] = newR;
    },

    setG(newG) {
      this.g = newG;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 1 ] = newG;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 5 ] = newG;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 9 ] = newG;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 13 ] = newG;
    },

    setB(newB) {
      this.b = newB;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 2 ] = newB;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 6 ] = newB;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 10 ] = newB;
      this.vertexGroup.generatedColors[ this.colorBufferOffset + 14 ] = newB;
    }
  }]);
});
