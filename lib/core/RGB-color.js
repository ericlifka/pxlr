SM.DefineModule('pxlr/core/RGB-color', function (require) {
  return SM.DefineClass([{
    constructor(r=0, g=0, b=0) {
      this.r = r;
      this.g = g;
      this.b = b;
    },

    setR(newR) {
      this.r = newR % 256;
    },
    setG(newG) {
      this.g = newG % 256;
    },
    setB(newB) {
      this.b = newB % 256;
    },
  }]);
});
