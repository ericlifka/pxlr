SM.DefineModule('pxlr/fonts/phoenix', function (require) {
    var Sprite = require('models/sprite');

    var w = "white";
    var n = null;

    return {
        meta: {
            width: 15,
            height: 15,
            lineHeight: 16,
            letterSpacing: -1
        },
        P: new Sprite([
            [ n, n, n, w, w, w, w, w, w, w, w, w, n, n ],
            [ n, n, n, n, n, w, w, w, n, n, w, w, w, n ],
            [ n, n, n, n, n, w, w, n, n, n, n, w, w, w ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, w, w ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, w, w ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, w, w ],
            [ n, n, n, n, w, w, w, n, n, n, n, w, w, w ],
            [ n, n, n, w, w, w, w, w, n, n, w, w, w, n ],
            [ n, n, n, w, w, n, w, w, w, w, w, w, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, n, n, n, n ],
            [ w, w, w, w, w, w, n, n, n, n, n, n, n, n ]
        ]).invertY().rotateRight(),
        H: new Sprite([
            [ n, n, n, w, w, w, w, w, w, n, n, w, w, w, w, w, w ],
            [ n, n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n ],
            [ n, n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n, n ],
            [ n, n, n, w, w, w, w, w, w, w, w, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n, n ],
            [ w, w, w, w, w, w, n, n, w, w, w, w, w, w, n, n, n ]
        ]).invertY().rotateRight(),
        O: new Sprite([
            [ n, n, n, n, n, w, w, w, w, w, n, n ],
            [ n, n, n, n, w, w, w, n, w, w, w, n ],
            [ n, n, n, w, w, w, n, n, n, w, w, n ],
            [ n, n, n, w, w, n, n, n, n, w, w, w ],
            [ n, n, w, w, n, n, n, n, n, n, w, w ],
            [ n, n, w, w, n, n, n, n, n, n, w, w ],
            [ n, w, w, n, n, n, n, n, n, n, w, w ],
            [ n, w, w, n, n, n, n, n, n, n, w, w ],
            [ n, w, w, n, n, n, n, n, n, w, w, n ],
            [ w, w, n, n, n, n, n, n, n, w, w, n ],
            [ w, w, n, n, n, n, n, n, n, w, w, n ],
            [ w, w, n, n, n, n, n, n, w, w, n, n ],
            [ n, w, w, n, n, n, n, w, w, n, n, n ],
            [ n, n, w, w, n, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, w, w, n, n, n, n, n ]
        ]).invertY().rotateRight(),
        E: new Sprite([
            [ n, n, n, w, w, w, w, w, w, w, w, w, w, w ],
            [ n, n, n, n, n, w, w, n, n, n, n, n, n, w ],
            [ n, n, n, n, n, w, w, n, n, n, n, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, n, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, n, w, n, n, n ],
            [ n, n, n, w, w, w, w, w, w, w, w, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, w, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, n, w, n, n ],
            [ w, w, w, w, w, w, w, w, w, w, w, w, n, n ]
        ]).invertY().rotateRight(),
        N: new Sprite([
            [ n, n, n, w, w, w, w, n, n, n, n, w, w, w, w, w, w ],
            [ n, n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n ],
            [ n, n, n, n, n, w, w, w, n, n, n, n, n, w, w, n, n ],
            [ n, n, n, n, w, w, w, w, n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, w, w, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, w, w, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, w, w, n, n, n, w, w, n, n, n ],
            [ n, n, n, w, w, n, n, n, w, w, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, w, w, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, w, w, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, w, w, w, w, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, w, w, w, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n, n ],
            [ w, w, w, w, w, w, n, n, n, n, w, w, w, w, n, n, n ]
        ]).invertY().rotateRight(),
        I: new Sprite([
            [ n, n, n, w, w, w, w, w, w ],
            [ n, n, n, n, n, w, w, n, n ],
            [ n, n, n, n, n, w, w, n, n ],
            [ n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, w, w, n, n, n ],
            [ n, n, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n ],
            [ w, w, w, w, w, w, n, n, n ]
        ]).invertY().rotateRight(),
        X: new Sprite([
            [ n, n, n, w, w, w, w, w, w, n, n, w, w, w, w, w, w ],
            [ n, n, n, n, n, w, w, n, n, n, n, n, n, w, w, n, n ],
            [ n, n, n, n, n, w, w, n, n, n, n, n, w, w, n, n, n ],
            [ n, n, n, n, n, n, w, w, n, n, n, w, w, n, n, n, n ],
            [ n, n, n, n, n, n, w, w, n, n, w, w, n, n, n, n, n ],
            [ n, n, n, n, n, n, n, w, w, w, w, n, n, n, n, n, n ],
            [ n, n, n, n, n, n, n, w, w, w, n, n, n, n, n, n, n ],
            [ n, n, n, n, n, n, n, w, w, w, n, n, n, n, n, n, n ],
            [ n, n, n, n, n, n, n, w, w, w, n, n, n, n, n, n, n ],
            [ n, n, n, n, n, n, w, w, w, w, n, n, n, n, n, n, n ],
            [ n, n, n, n, n, w, w, n, n, w, w, n, n, n, n, n, n ],
            [ n, n, n, n, w, w, n, n, n, w, w, n, n, n, n, n, n ],
            [ n, n, n, w, w, n, n, n, n, n, w, w, n, n, n, n, n ],
            [ n, n, w, w, n, n, n, n, n, n, w, w, n, n, n, n, n ],
            [ w, w, w, w, w, w, n, n, w, w, w, w, w, w, n, n, n ]
        ]).invertY().rotateRight()
    };
});
