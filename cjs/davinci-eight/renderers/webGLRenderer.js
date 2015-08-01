var renderer = require('../renderers/renderer');
var expectArg = require('../checks/expectArg');
var Color = require('../core/Color');
var webGLRenderer = function (canvas) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    var base = renderer(canvas);
    var gl;
    var glId;
    var autoClear = true;
    var clearColor = Color.fromRGB(0, 0, 0);
    var clearAlpha = 0;
    var self = {
        contextFree: function () {
            gl = void 0;
            glId = void 0;
            return base.contextFree();
        },
        contextGain: function (context, contextId) {
            expectArg('contextId', contextId).toBeString();
            var attributes = context.getContextAttributes();
            console.log(context.getParameter(context.VERSION));
            gl = context;
            glId = contextId;
            gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearAlpha);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.viewport(0, 0, canvas.width, canvas.height);
            return base.contextGain(context, contextId);
        },
        contextLoss: function () {
            gl = void 0;
            glId = void 0;
            return base.contextLoss();
        },
        hasContext: function () {
            return base.hasContext();
        },
        get autoClear() {
            return autoClear;
        },
        set autoClear(value) {
            expectArg('autoClear', value).toBeBoolean();
            autoClear = value;
        },
        clearColor: function (red, green, blue, alpha) {
            clearColor.red = red;
            clearColor.green = green;
            clearColor.blue = blue;
            clearAlpha = alpha;
            if (gl) {
                gl.clearColor(red, green, blue, alpha);
            }
            return self;
        },
        render: function (drawList, view) {
            if (autoClear && gl) {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            }
            return base.render(drawList, view);
        }
    };
    return self;
};
module.exports = webGLRenderer;
