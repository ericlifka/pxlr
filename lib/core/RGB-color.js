SM.DefineModule('pxlr/core/RGB-color', function (require) {
  const RGBColor = SM.DefineClass([{
    constructor(r=0, g=0, b=0) {
      this.r = r;
      this.g = g;
      this.b = b;
    },

    setR(newR) {
      this.r = newR % 256;
    },
    getR() {
      return this.r;
    },
    setG(newG) {
      this.g = newG % 256;
    },
    getG() {
      return this.g;
    },
    setB(newB) {
      this.b = newB % 256;
    },
    getB() {
      return this.b;
    },

    setFromHex(hex) {
      if (hex.length === 7 || hex.length === 4) {
        hex = hex.slice(1);
      }

      if (hex.length === 3) {
        hex = hex
          .split('')
          .map(char => char + char)
          .join('');
      }

      if (hex.length !== 6) {
        throw new Error(`Invalid hex string: ${hex}`);
      }

      this.setR(parseInt(hex.slice(0, 2), 16));
      this.setG(parseInt(hex.slice(2, 4), 16));
      this.setB(parseInt(hex.slice(4, 6), 16));
    },

    clone() {
      return new RGBColor(this.getR(), this.getG(), this.getB());
    }
  }]);

  return RGBColor;
});
