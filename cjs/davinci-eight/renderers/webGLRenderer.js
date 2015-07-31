var renderer = require('../renderers/renderer');
var expectArg = require('../checks/expectArg');
var webGLRenderer = function (canvas) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    var base = renderer(canvas);
    var gl;
    var self = {
        contextFree: function () {
            gl = void 0;
            return base.contextFree();
        },
        contextGain: function (context, contextId) {
            var attributes = context.getContextAttributes();
            console.log(context.getParameter(context.VERSION));
            gl = context;
            gl.clearColor(0.3, 0.3, 0.3, 1.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.viewport(0, 0, canvas.width, canvas.height);
            return base.contextGain(context, contextId);
        },
        contextLoss: function () {
            gl = void 0;
            return base.contextLoss();
        },
        hasContext: function () {
            return base.hasContext();
        },
        render: function (world, views) {
            if (gl) {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            }
            return base.render(world, views);
        }
    };
    return self;
};
module.exports = webGLRenderer;
