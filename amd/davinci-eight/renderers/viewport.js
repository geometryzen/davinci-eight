define(["require", "exports", '../core/Color', '../renderers/ViewportArgs'], function (require, exports, Color, ViewportArgs) {
    //import initWebGL = require('../renderers/initWebGL');
    //import FrameworkDrawContext = require('../renderers/FrameworkDrawContext');
    var viewport = function (parameters) {
        parameters = parameters || {};
        var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');
        var alpha = parameters.alpha !== undefined ? parameters.alpha : false;
        var depth = parameters.depth !== undefined ? parameters.depth : true;
        var stencil = parameters.stencil !== undefined ? parameters.stencil : true;
        var antialias = parameters.antialias !== undefined ? parameters.antialias : false;
        var premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
        var preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;
        //var drawContext = new FrameworkDrawContext();
        var context;
        var contextGainId;
        var devicePixelRatio = 1;
        var autoClearColor = true;
        var autoClearDepth = true;
        var clearColor = new Color(1.0, 1.0, 1.0, 1.0);
        // If we had an active context then we might use context.drawingBufferWidth etc.
        var viewport = new ViewportArgs(0, 0, canvas.width, canvas.height);
        function setViewport(x, y, width, height) {
            if (context) {
                context.viewport(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, height * devicePixelRatio);
            }
        }
        function clear() {
            var mask = 0;
            if (context) {
                if (autoClearColor) {
                    mask |= context.COLOR_BUFFER_BIT;
                }
                if (autoClearDepth) {
                    mask |= context.DEPTH_BUFFER_BIT;
                }
                context.clear(mask);
            }
        }
        var publicAPI = {
            get canvas() { return canvas; },
            get context() { return context; },
            contextFree: function () {
                context = void 0;
            },
            contextGain: function (contextArg, contextGainId) {
                context = contextArg;
                context.enable(context.DEPTH_TEST);
                context.enable(context.SCISSOR_TEST);
            },
            contextLoss: function () {
                context = void 0;
            },
            hasContext: function () {
                return !!context;
            },
            clearColor: function (red, green, blue, alpha) {
                clearColor.red = red;
                clearColor.green = green;
                clearColor.blue = blue;
                clearColor.alpha = alpha;
                //
            },
            render: function (world, views) {
                if (context) {
                    context.scissor(viewport.x, viewport.y, viewport.width, viewport.height);
                    context.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
                    context.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearColor.alpha);
                    clear();
                    var drawGroups = {};
                    if (!world.hasContext()) {
                        world.contextGain(context, contextGainId);
                    }
                    var programLoaded;
                    var drawHandler = function (drawable, index) {
                        if (!programLoaded) {
                            drawable.useProgram();
                            programLoaded = true;
                        }
                        views.forEach(function (view) {
                            drawable.draw(view);
                        });
                    };
                    for (var drawGroupName in world.drawGroups) {
                        programLoaded = false;
                        world.drawGroups[drawGroupName].forEach(drawHandler);
                    }
                }
            },
            setViewport: setViewport,
            get x() {
                return viewport.x;
            },
            set x(value) {
                viewport.x = value;
            },
            get y() {
                return viewport.y;
            },
            set y(value) {
                viewport.y = value;
            },
            get width() {
                return viewport.width;
            },
            set width(value) {
                viewport.width = value;
            },
            get height() {
                return viewport.height;
            },
            set height(value) {
                viewport.height = value;
            },
            setSize: function (width, height, updateStyle) {
                canvas.width = width * devicePixelRatio;
                canvas.height = height * devicePixelRatio;
                if (updateStyle !== false) {
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                }
                setViewport(0, 0, width, height);
            }
        };
        var attributes = {
            'alpha': alpha,
            'depth': depth,
            'stencil': stencil,
            'antialias': antialias,
            'premultipliedAlpha': premultipliedAlpha,
            'preserveDrawingBuffer': preserveDrawingBuffer
        };
        return publicAPI;
    };
    return viewport;
});