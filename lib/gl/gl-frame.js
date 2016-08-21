SM.DefineModule('pxlr/gl/gl-frame', function (require) {
  const CellGrid = require('pxlr/core/cell-grid');
  const BufferColor = require('pxlr/gl/buffer-color');

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

      let colorGrid = [];

      for (let w = 0; w < width; w++) {
        let currentColorColumn = [];

        for (let h = 0; h < height; h++) {

          if (chunk.squareIndex >= 5000) {
            chunk = emptyChunk();
            chunks.push(chunk);
          }

          currentColorColumn.push(new BufferColor(chunk, chunk.generatedColors.length));

          pushOntoEnd(chunk.vertices, [
            w, h, 0,
            w + 1, h, 0,
            w + 1, h + 1, 0,
            w, h + 1, 0
          ]);

          let color = [ 0.0, 0.0, 0.0, 1.0 ];
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

        colorGrid.push(currentColorColumn);
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
      this.cells = colorGrid;
    },

    flushToBuffers() {
      let gl = this.gl;
      this.chunks.forEach(chunk => {
          gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesColorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk.generatedColors), gl.STATIC_DRAW);
      });
    },

    clear() {
      /* needs to reset the colors AND the indexes */
    }
  } ]);
});
