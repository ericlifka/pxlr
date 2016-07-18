SM.DefineModule('pxlr/gl/webgl', function (require) {
  const Frame = require('pxlr/gl/gl-frame');
  const DomHelpers = require('pxlr/gl/dom-helpers');

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

  return SM.DefineClass([DomHelpers, {
    width: 200,
    height: 150,
    pixelSize: 1,

    constructor(options) {
      this.canvasSetup(options || {});

      this.createGl();
      this.initShaders();
      this.createBuffers();
      this.drawScene();
      this.setCameraPerspective();

      let animFrame = () => {
        this.drawScene();

        requestAnimationFrame(animFrame);
      };

      requestAnimationFrame(animFrame);
    },

    newRenderFrame() {

    },
    renderFrame() {

    },
    setFillColor(fillColor) {

    },

    createGl() {
      let gl = this.canvas.getContext("webgl");
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      this.gl = gl;
    },

    initShaders() {
      let gl = this.gl;

      let fragmentShader = this.getShader("shader-fs");
      let vertexShader = this.getShader("shader-vs");
      let shaderProgram = gl.createProgram();

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program.");
      }

      gl.useProgram(shaderProgram);

      let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(vertexPositionAttribute);

      let vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      gl.enableVertexAttribArray(vertexColorAttribute);

      this.shaderProgram = shaderProgram;
      this.vertexPositionAttribute = vertexPositionAttribute;
      this.vertexColorAttribute = vertexColorAttribute;
    },

    getShader(id) {
      let gl = this.gl;
      let shaderScript = document.getElementById(id);

      if (!shaderScript) {
        console.error('Invallid shader id: ' + id);
        return null;
      }

      let theSource = "";
      let currentChild = shaderScript.firstChild;

      while (currentChild) {
        if (currentChild.nodeType == 3) {
          theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
      }

      let shader;
      if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
      }

      gl.shaderSource(shader, theSource);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
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

    setCameraPerspective() {
      this.perspectiveMatrix = makePerspective(45, this.width / this.height, 0.1, 200.0);
      this.loadIdentity();
      let z = ( Math.sin(3/8 * Math.PI) * this.height/2 ) / ( Math.sin(1/8 * Math.PI) );
      this.mvTranslate([
        -this.width / 2,
        -this.height / 2,
        -z
      ]);
      this.setMatrixUniforms();
    },

    drawScene() {
      let gl = this.gl;

      this.updateColors();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      this.chunks.forEach(chunk => {
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesBuffer);
        gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesColorBuffer);
        gl.vertexAttribPointer(this.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.verticesIndexBuffer);

        gl.drawElements(gl.TRIANGLES, chunk.vertexCount, gl.UNSIGNED_SHORT, 0);
      });
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
    },

    loadIdentity() {
      this.mvMatrix = Matrix.I(4);
    },

    multMatrix(m) {
      this.mvMatrix = this.mvMatrix.x(m);
    },

    mvTranslate(v) {
      this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    },

    setMatrixUniforms() {
      let gl = this.gl;
      let pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
      gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

      let mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
      gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));
    }
  }]);
});
