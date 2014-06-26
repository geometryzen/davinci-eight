import object3D = require('eight/core/object3D');

var scene = function() {
    var kids: { onContextGain: (gl: WebGLRenderingContext) => void; onContextLoss: () => void; tearDown: () => void }[] = [];

    // TODO: What do we want out of the base object3D?
    var base = object3D();

    var that = {
        get children() { return kids; },
        onContextGain: function(gl: WebGLRenderingContext): void {
            for (var i = 0, length = kids.length; i < length; i++) {
                kids[i].onContextGain(gl);
            }
        },
        onContextLoss: function(): void {
            for (var i = 0, length = kids.length; i < length; i++) {
                kids[i].onContextLoss();
            }
        },
        tearDown: function(): void {
            for (var i = 0, length = kids.length; i < length; i++) {
                kids[i].tearDown();
            }
        },
        add: function(child: { onContextGain: (gl: WebGLRenderingContext) => void; onContextLoss: () => void; tearDown: () => void }) {
            kids.push(child);
        }
    }

    return that;
};

export = scene;
