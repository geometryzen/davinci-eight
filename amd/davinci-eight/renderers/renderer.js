define(["require", "exports", '../core', '../core/Color', '../checks/expectArg', '../utils/uuid4'], function (require, exports, core, Color, expectArg, uuid4) {
    var CLASS_NAME = "ContextRenderer";
    // FIXME: multi-context monitors: etc
    // FIXME; Remove attributes
    /**
     *
     */
    var renderer = function (canvas, canvasId) {
        // FIXME: Replace.
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        // Forced to cache this becuase of the need to avoid duplicating every call by wrapping.
        var gl = void 0;
        var autoClear = true;
        var clearColor = Color.fromRGB(0, 0, 0);
        var clearAlpha = 0;
        var uuid = uuid4().generate();
        function drawHandler(drawable) {
            drawable.draw(canvasId);
        }
        var self = {
            get canvas() { return canvas; },
            get gl() { return gl; },
            contextFree: function () {
                gl = void 0;
            },
            contextGain: function (manager) {
                // FIXME: multi-context
                gl = manager.gl;
                console.log(core.NAMESPACE + " " + core.VERSION + " (" + core.GITHUB + ") " + core.LAST_AUTHORED_DATE);
                if (core.LOG_WEBGL_VERSION) {
                    console.log(gl.getParameter(gl.VERSION));
                }
                if (core.LOG_WEBGL_CONTEXT_ATTRIBUTES) {
                    var attributes = gl.getContextAttributes();
                    console.log("alpha                 => " + attributes.alpha);
                    console.log("antialias             => " + attributes.antialias);
                    console.log("depth                 => " + attributes.depth);
                    console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
                    console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
                    console.log("stencil               => " + attributes.stencil);
                }
                gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha);
                gl.clearDepth(1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.viewport(0, 0, canvas.width, canvas.height);
            },
            contextLoss: function () {
                gl = void 0;
            },
            get autoClear() {
                return autoClear;
            },
            set autoClear(value) {
                autoClear = expectArg('autoClear', value).toBeBoolean().value;
            },
            clearColor: function (red, green, blue, alpha) {
                clearColor.r = expectArg('red', red).toBeNumber().value;
                clearColor.g = expectArg('green', green).toBeNumber().value;
                clearColor.b = expectArg('blue', blue).toBeNumber().value;
                clearAlpha = expectArg('alpha', alpha).toBeNumber().value;
                if (gl) {
                    gl.clearColor(red, green, blue, alpha);
                }
            },
            render: function (drawList, unused) {
                if (gl) {
                    if (autoClear) {
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    }
                }
                else {
                    console.warn("renderer is unable to clear because WebGLRenderingContext is missing");
                }
                drawList.traverse(drawHandler);
            }
        };
        return self;
    };
    return renderer;
});
