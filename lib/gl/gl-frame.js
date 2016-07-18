SM.DefineModule('pxlr/gl/gl-frame', function (require) {
  const CellGrid = require('pxlr/core/cell-grid');

  function pushOntoEnd(target, data) {
    for (let i = 0; i < data.length; i++) {
      target.push(data[i]);
    }
  }

  function emptyChunk() {
    return {
      vertices: [],
      generatedColors: [],
      cubeVertexIndices: [],
      squareIndex: 0,
      vertexCount: 0
    };
  }

  return SM.DefineClass([ CellGrid, {
    constructor({ width, height, gl }) {
      this.width = width;
      this.height = height;
      this.gl = gl;

      this.createBuffers();
    },

    createBuffers() {
      let gl = this.gl;
      let chunk = emptyChunk();
      let chunks = [ chunk ];
      let height = this.height;
      let width = this.width;

      this.colorWidthStep = 1.0 / width;
      this.colorHeightStep = 1.0 / height;

      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {

          if (chunk.squareIndex >= 5000) {
            chunk = emptyChunk();
            chunks.push(chunk);
          }

          pushOntoEnd(chunk.vertices, [
            w, h, 0,
            w + 1, h, 0,
            w + 1, h + 1, 0,
            w, h + 1, 0
          ]);

          let color = [
            this.colorWidthStep * w,
            this.colorHeightStep * h,
            0.0,
            1.0
          ];

          for (let i = 0; i < 4; i++) {
            pushOntoEnd(chunk.generatedColors, color);
          }

          pushOntoEnd(chunk.cubeVertexIndices, [
            chunk.squareIndex, chunk.squareIndex + 1, chunk.squareIndex + 2, // first triangle in square
            chunk.squareIndex, chunk.squareIndex + 2, chunk.squareIndex + 3  // second
          ]);

          chunk.squareIndex += 4; // four vertices have been created
          chunk.vertexCount += 6; // but they're mapped to six render-able vertex indices
        }
      }

      chunks.forEach(chunk => {
        chunk.verticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk.vertices), gl.STATIC_DRAW);

        chunk.verticesColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk.generatedColors), gl.STATIC_DRAW);

        chunk.verticesIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.verticesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(chunk.cubeVertexIndices), gl.STATIC_DRAW);
      });

      this.chunks = chunks;
    },

    updateColors() {
      let gl = this.gl;
      let colorWidthStep = this.colorWidthStep;
      let colorHeightStep = this.colorHeightStep;

      this.chunks.forEach(chunk => {
        for (let i = 0; i < chunk.generatedColors.length; i += 4) {
          chunk.generatedColors[i] += colorWidthStep;
          chunk.generatedColors[i + 1] += colorHeightStep;
          if (chunk.generatedColors[i] > 1) {
            chunk.generatedColors[i] -= 1;
          }
          if (chunk.generatedColors[i + 1] > 1) {
            chunk.generatedColors[i + 1] -= 1;
          }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk.generatedColors), gl.STATIC_DRAW);
      });
    }
  } ]);
});
