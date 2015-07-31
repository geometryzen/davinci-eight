define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    var renderer = function (canvas, parameters) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        parameters = parameters || {};
        //var drawContext = new FrameworkDrawContext();
        var gl;
        var gid;
        var publicAPI = {
            get canvas() { return canvas; },
            get context() { return gl; },
            contextFree: function () {
                gl = void 0;
                gid = void 0;
            },
            contextGain: function (context, contextIdArg) {
                gl = context;
                gid = contextIdArg;
            },
            contextLoss: function () {
                gl = void 0;
                gid = void 0;
            },
            hasContext: function () {
                return !!gl;
            },
            render: function (world, views) {
                expectArg('world', world).toNotBeNull();
                if (gl) {
                    if (!world.hasContext()) {
                        world.contextGain(gl, gid);
                    }
                    var programLoaded;
                    for (var drawGroupName in world.drawGroups) {
                        programLoaded = false;
                        world.drawGroups[drawGroupName].forEach(function (drawable) {
                            if (!programLoaded) {
                                drawable.useProgram();
                                programLoaded = true;
                            }
                            views.forEach(function (view) {
                                drawable.draw(view);
                            });
                        });
                    }
                }
                else {
                    console.warn("renderer is unable to render because WebGLRenderingContext is missing");
                }
            },
        };
        return publicAPI;
    };
    return renderer;
});
