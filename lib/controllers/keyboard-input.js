SM.DefineModule('pxlr/controllers/keyboard-input', function () {
  function cloneObj(obj) {
    let nObj = {};
    Object.keys(obj).forEach(function (key) {
      nObj[ key ] = obj[ key ];
    });
    return nObj;
  }

  function newInputDescriptor() {
    return {
      W: false, A: false, S: false, D: false,
      SPACE: false, ENTER: false
    };
  }

  const KEYS = {
    87: 'W', 65: 'A', 83: 'S', 68: 'D',
    32: 'SPACE', 13: 'ENTER'
  };

  return SM.DefineClass([{
    constructor() {
      this.clearState();

      document.body.addEventListener('keydown', event => this.keydown(event));
      document.body.addEventListener('keyup', event => this.keyup(event));
    },
    getInputState() {
      let state = cloneObj(this.inputState);
      this.propagateInputClears();
      return state;
    },
    clearState() {
      this.clearAfterNext = newInputDescriptor();
      this.inputState = newInputDescriptor();
      this.inputState.INPUT_TYPE = "keyboard";
    },
    propagateInputClears() {
      Object.keys(this.clearAfterNext).forEach(key => {
        if (this.clearAfterNext[ key ]) {
          this.inputState[ key ] = false;
          this.clearAfterNext[ key ] = false;
        }
      });
    },
    keydown(event) {
      this.inputState[ KEYS[ event.keyCode ] ] = true;
      this.clearAfterNext[ KEYS[ event.keyCode ] ] = false;
    },
    keyup(event) {
      this.clearAfterNext[ KEYS[ event.keyCode ] ] = true;
    }
  }]);
});
