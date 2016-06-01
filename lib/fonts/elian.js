SM.DefineModule('pxlr/fonts/elian', function (require) {
    var Sprite = require('models/sprite');

    var w = "white";
    var n = null;
    var lowerCaseOffset = { x: 0, y: 2 };

    var font = {
        meta: {
            width: 3,
            height: 3,
            lineHeight: 7,
            letterSpacing: 1
        },
        A: new Sprite([
            [w, w],
            [n, w],
            [n, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        B: new Sprite([
            [w, w],
            [n, w],
            [w, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        C: new Sprite([
            [n, w],
            [n, w],
            [w, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),

        D: new Sprite([
            [w, w, w],
            [w, n, w],
            [w, n, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        E: new Sprite([
            [w, w, w],
            [w, n, w],
            [w, w, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        F: new Sprite([
            [w, n, w],
            [w, n, w],
            [w, w, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),

        G: new Sprite([
            [w, w],
            [w, n],
            [w, n]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        H: new Sprite([
            [w, w],
            [w, n],
            [w, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        I: new Sprite([
            [w, n],
            [w, n],
            [w, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),


        J: new Sprite([
            [w, w],
            [n, w],
            [n, w],
            [n, w],
            [n, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        K: new Sprite([
            [w, w],
            [n, w],
            [n, w],
            [n, w],
            [w, w]
        ]).invertY().rotateRight().setPermanentOffset({x: 0, y: 1}),
        L: new Sprite([
            [n, w],
            [n, w],
            [n, w],
            [n, w],
            [w, w]
        ]).invertY().rotateRight(),

        M: new Sprite([
            [w, w, w],
            [w, n, w],
            [n, n, w],
            [n, n, w],
            [n, n, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        N: new Sprite([
            [w, w, w],
            [w, n, w],
            [w, w, w],
            [n, n, w],
            [n, n, w]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        O: new Sprite([
            [n, n, w],
            [n, n, w],
            [n, n, w],
            [w, n, w],
            [w, w, w]
        ]).invertY().rotateRight(),

        P: new Sprite([
            [w, w],
            [w, n],
            [w, n],
            [w, n],
            [w, n]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        Q: new Sprite([
            [w, w],
            [w, n],
            [w, n],
            [w, n],
            [w, w]
        ]).invertY().rotateRight().setPermanentOffset({x: 0, y: 1}),
        R: new Sprite([
            [w, n],
            [w, n],
            [w, n],
            [w, n],
            [w, w]
        ]).invertY().rotateRight(),


        S: new Sprite([
            [n, w],
            [n, n],
            [w, w],
            [n, w],
            [n, w],
            [n, w],
            [n, w]
        ]).invertY().rotateRight(),
        T: new Sprite([
            [n, w, w],
            [n, n, w],
            [w, n, w],
            [n, n, w],
            [n, w, w]
        ]).invertY().rotateRight().setPermanentOffset({x: 0, y: 1}),
        U: new Sprite([
            [n, w],
            [n, n],
            [n, w],
            [n, w],
            [n, w],
            [n, w],
            [w, w]
        ]).invertY().rotateRight().setPermanentOffset({x: 0, y: -2}),

        V: new Sprite([
            [n, w, n],
            [n, n, n],
            [w, w, w],
            [w, n, w],
            [n, n, w],
            [n, n, w],
            [n, n, w]
        ]).invertY().rotateRight(),
        W: new Sprite([
            [n, w, n],
            [n, n, n],
            [w, w, w],
            [w, n, w],
            [w, w, w],
            [n, n, w],
            [n, n, w]
        ]).invertY().rotateRight(),
        X: new Sprite([
            [n, n, w],
            [n, n, n],
            [n, n, w],
            [n, n, w],
            [n, n, w],
            [w, n, w],
            [w, w, w]
        ]).invertY().rotateRight().setPermanentOffset({x: 0, y: -2}),

        Y: new Sprite([
            [w, n],
            [n, n],
            [w, w],
            [w, n],
            [w, n],
            [w, n],
            [w, n]
        ]).invertY().rotateRight(),
        Z: new Sprite([
            [w, w, n],
            [w, n, n],
            [w, n, w],
            [w, n, n],
            [w, w, n]
        ]).invertY().rotateRight().setPermanentOffset({x: 0, y: 1}),
        ' ': new Sprite([
            [n, n],
            [n, n],
            [n, n]
        ]),
        '.': new Sprite([
            [n, n],
            [n, n],
            [w, n]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        ',': new Sprite([
            [n, n],
            [n, n],
            [w, n],
            [w, n]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset),
        "'": new Sprite([
            [w],
            [w]
        ]).invertY().rotateRight().setPermanentOffset({x: 0, y: 1}),
        '-': new Sprite([
            [n, n],
            [w, w],
            [n, n]
        ]).invertY().rotateRight().setPermanentOffset(lowerCaseOffset)
    };

    var toLower = function (index) { return 'abcdefghijklmnopqrstuvwxyz'[ index ]; };
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (capital, index) {
        font[ toLower(index) ] = font[ capital ];
    });

    return font;
});
