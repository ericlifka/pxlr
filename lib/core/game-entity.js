SM.DefineModule('pxlr/core/game-entity', function (require) {
  return SM.DefineClass([{
    init: SM.event(function (parent) {
      this.parent = parent;
      this.children = [];
    }),

    update: SM.event(function (dtime, inputSources) {
      this.children.forEach(child => child.trigger('update', dtime, inputSources));
    }),

    renderToFrame: SM.event(function (frame) {
      this.children.forEach(child => child.trigger('renderToFrame', frame));
    })
  }]);
});
