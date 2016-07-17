SM.DefineModule('pxlr/gl/webgl', function (require) {
  var Frame = require('pxlr/gl/frame');
  var DomHelpers = require('pxlr/gl/dom-helpers');

  function pushOntoEnd(target, data) {
    for (var i = 0; i < data.length; i++) {
      target.push(data[i]);
    }
  }
  var lastTime;
  function logTime(tag) {
    var now = new Date().valueOf();

    if (!lastTime) {
      console.log('timing: ' + tag);
    } else {
      console.log('timing: ' + tag, now - lastTime);
    }

    lastTime = now;
  }

  return SM.DefineClass([DomHelpers, {
    width: 80,
    height: 50,
    pixelSize: 1,

    constructor: function (options) {
      this.canvasSetup(options || {});
      this.createGl();
      this.initShaders();
      this.createBuffers();
      this.drawScene();

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
      this.gl = this.canvas.getContext("webgl");
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
      this.gl.clearDepth(1.0);                 // Clear everything
      this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
      this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
    },

    initShaders: function () {
      var gl = this.gl;

      var fragmentShader = this.getShader("shader-fs");
      var vertexShader = this.getShader("shader-vs");

      var shaderProgram = this.shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      // If creating the shader program failed, alert
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program.");
      }

      gl.useProgram(shaderProgram);

      this.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(this.vertexPositionAttribute);

      this.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      gl.enableVertexAttribArray(this.vertexColorAttribute);
    },

    getShader: function (id) {
      var gl = this.gl;
      var shaderScript = document.getElementById(id);

      if (!shaderScript) {
        return null;
      }

      // Walk through the source element's children, building the
      // shader source string.

      var theSource = "";
      var currentChild = shaderScript.firstChild;

      while (currentChild) {
        if (currentChild.nodeType == 3) {
          theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
      }

      // Now figure out what type of shader script we have,
      // based on its MIME type.

      var shader;

      if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
        return null;  // Unknown shader type
      }

      // Send the source to the shader object

      gl.shaderSource(shader, theSource);

      // Compile the shader program

      gl.compileShader(shader);

      // See if it compiled successfully

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
    },

    createBuffers: function () {
      logTime('start - buffers');

      var gl = this.gl;
      var chunks = [
        {
          vertices: [],
          generatedColors: [],
          cubeVertexIndices: [],
          squareIndex: 0
        }
      ];
      var chunk = chunks[0];
      var height = this.height;
      var width = this.width;

      this.colorWidthStep = 1.0 / width;
      this.colorHeightStep = 1.0 / height;

      for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {

          if (chunk.squareIndex >= 5000) {
            chunk = {
              vertices: [],
              generatedColors: [],
              cubeVertexIndices: [],
              squareIndex: 0
            };

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

          chunk.squareIndex += 4;
        }
      }

      logTime('create js data');

      chunks.forEach(function (chunk) {
        chunk.cubeVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.cubeVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk.vertices), gl.STATIC_DRAW);

        chunk.cubeVerticesColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.cubeVerticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk.generatedColors), gl.STATIC_DRAW);

        chunk.cubeVerticesIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.cubeVerticesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(chunk.cubeVertexIndices), gl.STATIC_DRAW);
      });

      logTime('create buffers');

      this.chunks = chunks;
      logTime('end - buffers');
    },

    drawScene: function () {
      var gl = this.gl;
      var chunks = this.chunks;
      var self = this;

      this.updateColors();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Establish the perspective with which we want to view the
      // scene. Our field of view is 45 degrees, with a width/height
      // ratio of 640:480, and we only want to see objects between 0.1 units
      // and 100 units away from the camera.

      this.perspectiveMatrix = makePerspective(45, this.width / this.height, 0.1, 200.0);

      // Set the drawing position to the "identity" point, which is
      // the center of the scene.

      this.loadIdentity();

      // Now move the drawing position a bit to where we want to start
      // drawing the cube.

      // this.mvTranslate([-40.0, -25.0, -61.0]);
      var z = ( Math.sin(3/8 * Math.PI) * this.height/2 ) / ( Math.sin(1/8 * Math.PI) );
      this.mvTranslate([
        -this.width / 2,
        -this.height / 2,
        -z
      ]);
      self.setMatrixUniforms();
      // Draw the cube by binding the array buffer to the cube's vertices
      // array, setting attributes, and pushing it to GL.

      chunks.forEach(function (chunk) {
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.cubeVerticesBuffer);
        gl.vertexAttribPointer(self.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        // Set the colors attribute for the vertices.

        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.cubeVerticesColorBuffer);
        gl.vertexAttribPointer(self.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        // Draw the cube.

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.cubeVerticesIndexBuffer);

        gl.drawElements(gl.TRIANGLES, chunk.squareIndex / 4 * 6, gl.UNSIGNED_SHORT, 0);
      });
    },

    updateColors: function () {
      var gl = this.gl;
      var chunks = this.chunks;
      var colorWidthStep = this.colorWidthStep;
      var colorHeightStep = this.colorHeightStep;

      chunks.forEach(function (chunk) {
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

        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.cubeVerticesColorBuffer);
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
