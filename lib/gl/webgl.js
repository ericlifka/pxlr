SM.DefineModule('pxlr/gl/webgl', function (require) {
  const Frame = require('pxlr/gl/gl-frame');
  const DomHelpers = require('pxlr/gl/dom-helpers');

  return SM.DefineClass([DomHelpers, {
    width: 200,
    height: 150,
    pixelSize: 1,

    constructor(options) {
      this.canvasSetup(options || {});

      this.createGl();
      this.initShaders();
      this.setCameraPerspective();

      this.frame = new Frame(this);
    },

    newRenderFrame() {
      return this.frame;
    },
    renderFrame(frame) {
      this.frame.flushToBuffers();
      this.drawScene();
    },
    setFillColor(fillColor) {
      this.frame.setFillColor(fillColor);
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

    setCameraPerspective() {
      this.makePerspectiveMatrix();
      this.makeMovementMatrix();

      this.setMatrixUniforms();
    },

    makeMovementMatrix() {
      let x = -this.width / 2;
      let y = -this.height / 2;
      let z = -1 * ( Math.sin(3/8 * Math.PI) * this.height/2 ) / ( Math.sin(1/8 * Math.PI) );

      this.movementMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
      ];
    },

    makePerspectiveMatrix() {
      let fieldOfView = 45;
      let aspectRatio = this.width / this.height;
      let zmin = 0.1;
      let zmax = 1000.0;
      let ymax = zmin * Math.tan(fieldOfView * Math.PI / 360.0);
      let ymin = -ymax;
      let xmax = ymax * aspectRatio;
      let xmin = ymin * aspectRatio;

      this.perspectiveMatrix = this.makeFrustumMatrix(xmin, xmax, ymin, ymax, zmin, zmax);
    },

    makeFrustumMatrix(left, right, bottom, top, znear, zfar) {
      let X = 2 * znear / (right - left);
      let Y = 2 * znear / (top - bottom);
      let A = (right + left) / (right - left);
      let B = (top + bottom) / (top - bottom);
      let C = -(zfar + znear) / (zfar - znear);
      let D = -2 * zfar * znear / (zfar - znear);

      return [
        X, 0, 0, 0,
        0, Y, 0, 0,
        A, B, C, -1,
        0, 0, D, 0
      ];
    },

    drawScene() {
      let gl = this.gl;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      this.frame.chunks.forEach(chunk => {
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesBuffer);
        gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.verticesColorBuffer);
        gl.vertexAttribPointer(this.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.verticesIndexBuffer);

        gl.drawElements(gl.TRIANGLES, chunk.vertexCount, gl.UNSIGNED_SHORT, 0);
      });
    },

    setMatrixUniforms() {
      let gl = this.gl;
      let pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
      gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix));

      let mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
      gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.movementMatrix));
    }
  }]);
});
