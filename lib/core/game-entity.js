SM.DefineModule('pxlr/core/game-entity', function (require) {
  return SM.DefineClass([{
    init: SM.event(function (parent) {
      this.parent = parent;
      this.children = [];
    }),

    processInput: SM.event(function (inputSources) {
      this.children.forEach(child => child.trigger('processInput', inputSources));
    }),

    update: SM.event(function (dtime) {
      this.children.forEach(child => child.trigger('update', dtime));
    }),

    renderToFrame: SM.event(function (frame) {
      this.children.forEach(child => child.trigger('renderToFrame', frame));
    })
  }]);
});
