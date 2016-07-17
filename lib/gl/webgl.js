SM.DefineModule('pxlr/gl/webgl', function (require) {
  var Frame = require('pxlr/gl/frame');
  var DomHelpers = require('pxlr/gl/dom-helpers');

  function pushOntoEnd(target, data) {
    for (var i = 0; i < data.length; i++) {
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

    constructor: function (options) {
      this.canvasSetup(options || {});

      this.createGl();
      this.initShaders();
      this.createBuffers();
      this.drawScene();
      this.setCameraPerspective();

      var self = this;

      function animFrame() {
        self.drawScene();

        requestAnimationFrame(animFrame);
      }

      requestAnimationFrame(animFrame);
    },

    newRenderFrame: function () {

    },
    renderFrame: function () {

    },
    setFillColor: function (fillColor) {

    },

    createGl: function () {
      var gl = this.canvas.getContext("webgl");
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      this.gl = gl;
    },

    initShaders: function () {
      var gl = this.gl;

      var fragmentShader = this.getShader("shader-fs");
      var vertexShader = this.getShader("shader-vs");
      var shaderProgram = gl.createProgram();

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program.");
      }

      gl.useProgram(shaderProgram);

      var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(vertexPositionAttribute);

      var vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      gl.enableVertexAttribArray(vertexColorAttribute);

      this.shaderProgram = shaderProgram;
      this.vertexPositionAttribute = vertexPositionAttribute;
      this.vertexColorAttribute = vertexColorAttribute;
    },

    getShader: function (id) {
      var gl = this.gl;
      var shaderScript = document.getElementById(id);

      if (!shaderScript) {
        console.error('Invallid shader id: ' + id);
        return null;
      }

      var theSource = "";
      var currentChild = shaderScript.firstChild;

      while (currentChild) {
        if (currentChild.nodeType == 3) {
          theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
      }

      var shader;
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

    createBuffers: function () {
      var gl = this.gl;
      var chunk = emptyChunk();
      var chunks = [ chunk ];
      var height = this.height;
      var width = this.width;

      this.colorWidthStep = 1.0 / width;
      this.colorHeightStep = 1.0 / height;

      for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {

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

          var color = [
            this.colorWidthStep * w,
            this.colorHeightStep * h,
            0.0,
            1.0
          ];

          for (var i = 0; i < 4; i++) {
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

      chunks.forEach(function (chunk) {
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

    setCameraPerspective: function () {
      this.perspectiveMatrix = makePerspective(45, this.width / this.height, 0.1, 200.0);
      this.loadIdentity();
      var z = ( Math.sin(3/8 * Math.PI) * this.height/2 ) / ( Math.sin(1/8 * Math.PI) );
      this.mvTranslate([
        -this.width / 2,
        -this.height / 2,
        -z
      ]);
      this.setMatrixUniforms();
    },

    drawScene: function () {
      var gl = this.gl;
      var self = this;

      this.updateColors();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      this.chunks.forEach(function (chunk) {
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesBuffer);
        gl.vertexAttribPointer(self.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesColorBuffer);
        gl.vertexAttribPointer(self.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.verticesIndexBuffer);

        gl.drawElements(gl.TRIANGLES, chunk.vertexCount, gl.UNSIGNED_SHORT, 0);
      });
    },

    updateColors: function () {
      var gl = this.gl;
      var colorWidthStep = this.colorWidthStep;
      var colorHeightStep = this.colorHeightStep;

      this.chunks.forEach(function (chunk) {
        for (var i = 0; i < chunk.generatedColors.length; i += 4) {
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

    loadIdentity: function () {
      this.mvMatrix = Matrix.I(4);
    },

    multMatrix: function (m) {
      this.mvMatrix = this.mvMatrix.x(m);
    },

    mvTranslate: function (v) {
      this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    },

    setMatrixUniforms: function () {
      var gl = this.gl;
      var pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
      gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

      var mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
      gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));
    }
  }]);
});
