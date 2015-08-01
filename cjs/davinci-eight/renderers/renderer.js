var expectArg = require('../checks/expectArg');
var renderer = function (canvas, parameters) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    parameters = parameters || {};
    var gl;
    var glId;
    var self = {
        get canvas() { return canvas; },
        get context() { return gl; },
        contextFree: function () {
            gl = void 0;
            glId = void 0;
        },
        contextGain: function (context, contextId) {
            expectArg('contextId', contextId).toBeString();
            gl = context;
            glId = contextId;
        },
        contextLoss: function () {
            gl = void 0;
            glId = void 0;
        },
        hasContext: function () {
            return !!gl;
        },
        render: function (drawList, view) {
            expectArg('drawList', drawList).toNotBeNull();
            if (gl) {
                if (!drawList.hasContext()) {
                    drawList.contextGain(gl, glId);
                }
                var programLoaded;
                for (var drawGroupName in drawList.drawGroups) {
                    programLoaded = false;
                    drawList.drawGroups[drawGroupName].forEach(function (drawable) {
                        if (!programLoaded) {
                            drawable.useProgram();
                            programLoaded = true;
                        }
                        drawable.draw(view);
                    });
                }
            }
            else {
                console.warn("renderer is unable to render because WebGLRenderingContext is missing");
            }
        },
    };
    return self;
};
module.exports = renderer;
