define(["require", "exports", '../checks/expectArg', '../core/Color', '../core/updateUniform'], function (require, exports, expectArg, Color, updateUniform) {
    var renderer = function (canvas, parameters) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        parameters = parameters || {};
        var gl;
        var glId;
        var autoClear = true;
        var clearColor = Color.fromRGB(0, 0, 0);
        var clearAlpha = 0;
        var self = {
            get canvas() { return canvas; },
            get context() { return gl; },
            contextFree: function () {
                gl = void 0;
                glId = void 0;
            },
            contextGain: function (context, contextId) {
                expectArg('contextId', contextId).toBeString();
                var attributes = context.getContextAttributes();
                //console.log(context.getParameter(context.VERSION));
                //console.log("alpha                 => " + attributes.alpha);
                //console.log("antialias             => " + attributes.antialias);
                //console.log("depth                 => " + attributes.depth);
                //console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
                //console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
                //console.log("stencil               => " + attributes.stencil);
                gl = context;
                glId = contextId;
                gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearAlpha);
                gl.clearDepth(1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.viewport(0, 0, canvas.width, canvas.height);
            },
            contextLoss: function () {
                gl = void 0;
                glId = void 0;
            },
            hasContext: function () {
                return !!gl;
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
            render: function (drawList, ambients) {
                var program;
                expectArg('drawList', drawList).toNotBeNull();
                if (gl) {
                    if (autoClear) {
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    }
                    if (!drawList.hasContext()) {
                        drawList.contextGain(gl, glId);
                    }
                    var programLoaded;
                    for (var drawGroupName in drawList.drawGroups) {
                        programLoaded = false;
                        drawList.drawGroups[drawGroupName].forEach(function (drawable) {
                            if (!programLoaded) {
                                var program_1 = drawable.program.use();
                                var uniformLocations = program_1.uniformLocations;
                                var umis = ambients.getUniformMeta();
                                for (var name in umis) {
                                    var uniformLocation = uniformLocations[name];
                                    if (uniformLocation) {
                                        updateUniform(uniformLocation, ambients);
                                    }
                                }
                                programLoaded = true;
                            }
                            drawable.draw();
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
    return renderer;
});
